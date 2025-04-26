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

  // Begin by getting the current order statuses in the system
  // Since all new orders start with status 1, we can check if any of the items have changed to status 2
  let itemStatusChangedTo2 = false;

  for (const dish of dishes) {
    // Get previous order_item_status_id for item BEFORE the update
    const prev = await sql`
      SELECT order_item_status_id FROM order_items WHERE order_items_id = ${dish.order_items_id}
    `;
    const prevStatus = prev[0]?.order_item_status_id;
    console.log("Previous status:", prevStatus); // DEMO check: Account_4, Dishes: Item_2, Item_3, Item_1

    // Convert order_item_status_id to a number
    const currentStatus = Number(dish.order_item_status_id);
    console.log("Current status:", dish.order_item_status_id); // DEMO check: Account_4, Dishes: Item_2, Item_3, Item_1

    /* 
    Result:
        Previous status: 1
        Current status: 1
        Previous status: 1
        Current status: 1
        Previous status: 1
        Current status: 2
    */

    // Finally, check status changes and update variable
    if (prevStatus === 1 && currentStatus === 2) {
      itemStatusChangedTo2 = true;
    }
  }

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

  // Update existing order items using the dishes array (i.e. order_items_id not equal to 0)
  for (const dish of dishes) {
    if (dish.order_items_id !== 0) {
      await sql`
        UPDATE order_items
        SET brand_id = ${dish.brand_id},
            item_id = ${dish.item_id},
            item_qty = ${dish.item_qty},
            order_item_status_id = ${dish.order_item_status_id}
        WHERE order_items_id = ${dish.order_items_id}
      `;
    }
  }

  // Update status of the order by:
  // Check status change: if one item's status has changed to 2, then update the order_status for the whole order to 2 (i.e. "in progress")
  // When all items have a status 3, then update the order_status for the whole order to 3 (i.e. "ready for delivery")
  // Do the same for items with status 4 (i.e. "delivered")

  try {
    // In order to evaluate whether to create a new record for the order in the order_status_history table, we need to check the current status of each item within the order
    const updatedItems = await sql`
      SELECT order_item_status_id FROM order_items WHERE order_id = ${order_id}
    `;
    console.log("Updated items:", updatedItems); // DEMO check: Account_4, Dishes: Item_2, Item_3, Item_1
    /* 
    Result:
      Updated items: [
        { order_item_status_id: 1 },
        { order_item_status_id: 1 },
        { order_item_status_id: 2 }
      ]
    */

    // Add a general function to check if all items are at a certain status
    const allItemsAtStatus = (status: number) =>
      updatedItems.every((item) => item.order_item_status_id >= status);

    // Get the latest order_status_id for this order from history
    const latestStatusRes = await sql`
      SELECT order_status_id FROM order_status_history
      WHERE order_id = ${order_id}
      ORDER BY status_update DESC
      LIMIT 1
    `;
    console.log("Latest status:", latestStatusRes); // DEMO check: Account_4, Dishes: Item_2, Item_3, Item_1
    /* 
    Result:
      Latest status: [ { order_status_id: 1 } ]
    */

    // Get the latest order_status_id or default to 1 if not found
    const latestStatus = latestStatusRes[0]?.order_status_id ?? 1;

    // Insert status 2 when ANY item transitions from 1 to 2
    if (itemStatusChangedTo2 && latestStatus < 2) {
      await sql`
      INSERT INTO order_status_history (order_status_id, order_id, status_update)
      VALUES (2, ${order_id}, NOW())
    `;
    }

    // Insert status 3 only when ALL items are at least 3, and previous status < 3
    if (allItemsAtStatus(3) && latestStatus < 3) {
      await sql`
      INSERT INTO order_status_history (order_status_id, order_id, status_update)
      VALUES (3, ${order_id}, NOW())
    `;
    }

    // Insert status 4 only when ALL items are at least 4, and previous status < 4
    if (allItemsAtStatus(4) && latestStatus < 4) {
      await sql`
      INSERT INTO order_status_history (order_status_id, order_id, status_update)
      VALUES (4, ${order_id}, NOW())
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

    // Add Order - Automatically set pickup_time to 2 hours from now as it is currently not specified in the form
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
