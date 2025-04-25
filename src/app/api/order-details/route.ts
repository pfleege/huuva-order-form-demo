import { DishOrder } from "@/app/lib/definitions";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const {
    order_id,
    account_name,
    account_email,
    account_phone,
    city,
    street,
    postal_code,
    dishes,
  } = await req.json();

  console.log(
    order_id,
    account_name,
    account_email,
    account_phone,
    city,
    street,
    postal_code,
    dishes
  );

  const sql = neon(process.env.DATABASE_URL!);

  // Set transaction isolation level
  await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

  // Check items in existing orders in case we want to delete an item from the order
  const existingOrderItems = await sql`
    SELECT order_items_id
    FROM order_items
    WHERE order_id = ${order_id}
  `;

  // Create an array of order_items_id from the existing order items
  const existingOrderItemsIds = existingOrderItems.map(
    (item) => item.order_items_id
  );
  // Create an array of order_items_id from the new order items
  const newOrderItemsIds: number[] = dishes.map(
    (item: DishOrder) => item.order_items_id
  );
  // Create updated array where we remove the order_items_id that are not in the updated order
  const orderItemsIdsToDelete = existingOrderItemsIds.filter(
    (id) => !newOrderItemsIds.includes(id)
  );
  // Delete order_items that have been removed from the order
  if (orderItemsIdsToDelete.length > 0) {
    await sql`
      DELETE FROM order_items
      WHERE order_items_id = ANY(${orderItemsIdsToDelete})
    `;
  }

  // Check if it is a new order_item (with dummy id = 0) and create an array of all new order_items
  const newOrderItems = dishes.filter(
    (dish: DishOrder) => dish.order_items_id === 0
  );

  // If it is a new order_item -> add to system with new order_item_id (i.e. don't specify order_items_id -> it will be auto-incremented)
  for (const dish of newOrderItems) {
    await sql`
      INSERT INTO order_items (
        order_id, brand_id, item_id, item_qty, order_item_status_id
      ) VALUES (
        ${order_id}, ${dish.brand_id}, ${dish.item_id}, ${dish.item_qty}, ${dish.order_item_status_id}
      )
    `;
  }

  // Update existing order items using the dishes array
  try {
    // Check status change: if one item's status has changed to 2, then update the order_status for the whole order to 2 (i.e. "in progress")
    // When all items have a status 3, then update the order_status for the whole order to 3 (i.e. "ready for delivery")

    let itemStatusChangedTo2 = false;
    let allItemsStatus3 = true;

    for (const dish of dishes) {
      // Get previous order_item_status_id for item BEFORE the update
      const prev = await sql`
        SELECT order_item_status_id FROM order_items WHERE order_items_id = ${dish.order_items_id}
      `;
      const prevStatus = prev[0]?.order_item_status_id;
      console.log("Previous status:", prevStatus);

      // Convert order_item_status_id to a number
      const currentStatus = Number(dish.order_item_status_id);
      console.log("Current status:", dish.order_item_status_id);

      // Update order_items
      await sql`
        UPDATE order_items
        SET brand_id = ${dish.brand_id},
            item_id = ${dish.item_id},
            item_qty = ${dish.item_qty},
            order_item_status_id = ${currentStatus}
        WHERE order_items_id = ${dish.order_items_id}
      `;

      // Check status changes and update variables
      if (prevStatus === 1 && currentStatus === 2) {
        itemStatusChangedTo2 = true;
      }
      if (currentStatus !== 3) {
        allItemsStatus3 = false;
      }
    }

    // Add new row to order_status_history if status has changed
    if (itemStatusChangedTo2) {
      await sql`
        INSERT INTO order_status_history (order_status_id, order_id, status_update)
        VALUES (2, ${order_id}, NOW())
      `;
    }

    if (allItemsStatus3) {
      await sql`
        INSERT INTO order_status_history (order_status_id, order_id, status_update)
        VALUES (3, ${order_id}, NOW())
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}

// Add new order
export async function POST(req: Request) {
  try {
    const {
      order_id,
      account_name,
      account_email,
      account_phone,
      city,
      street,
      postal_code,
      dishes,
    } = await req.json();

    console.log(
      order_id,
      account_name,
      account_email,
      account_phone,
      city,
      street,
      postal_code,
      dishes
    );

    const sql = neon(process.env.DATABASE_URL!);

    // Add Account (if it doesn't exist)
    // If it does exist, return the existing account_id
    const account = await sql`
      INSERT INTO accounts (account_name, account_email, account_phone)
      VALUES (${account_name}, ${account_email}, ${account_phone})
      -- Return existing account if it already exists
      ON CONFLICT (account_name, account_email, account_phone) 
      DO UPDATE SET
        account_name = EXCLUDED.account_name
      RETURNING account_id;
    `;

    // Add Pick-Up Address (if it doesn't exist)
    // If it does exist, return the existing address_id
    const address = await sql`
      INSERT INTO delivery_addresses (city, street, postal_code)
      VALUES (${city}, ${street}, ${postal_code})
      -- Return existing address if it already exists
      ON CONFLICT (city, street, postal_code)
      DO UPDATE SET 
        city = EXCLUDED.city
      RETURNING address_id;
    `;

    // Add Order
    const orderResult = await sql`
      INSERT INTO orders (
        order_created, 
        order_channel_id, 
        account_id, 
        address_id,
        pickup_time
      ) VALUES (
        NOW(), 
        1, 
        ${account[0].account_id}, 
        ${address[0].address_id},  
        NOW() + INTERVAL '2 hours'
      )
      RETURNING order_id;
    `;

    const newOrderId = orderResult[0].order_id;

    // Add All Dishes
    for (const dish of dishes) {
      await sql`
        INSERT INTO order_items (
          order_id, brand_id, item_id, item_qty, order_item_status_id
        ) VALUES (
          ${newOrderId}, ${dish.brand_id}, ${dish.item_id}, ${dish.item_qty}, 1
        )
      `;
    }

    // Add All Dishes
    await sql`
      INSERT INTO order_status_history (
        order_status_id,
        order_id,
        status_update
      ) VALUES (
          1,
        ${newOrderId},
        NOW()
      )
        RETURNING history_id;
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
