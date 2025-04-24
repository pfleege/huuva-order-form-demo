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

  try {
    // Check status change: if one item's status has changed to 2, then update the order_status for the whole order to 2 (i.e. "in progress")
    // When all items haev a status 3, then update the order_status for the whole order to 3 (i.e. "ready for delivery")
    let itemStatusChangedTo2 = false;
    let allItemsStatus3 = true;

    for (const dish of dishes) {
      // Get previous order_item_status_id for item
      const prev = await sql`
        SELECT order_item_status_id FROM order_items WHERE order_items_id = ${dish.order_items_id}
      `;
      const prevStatus = prev[0]?.order_item_status_id;

      // Update order_items
      await sql`
        UPDATE order_items
        SET brand_id = ${dish.brand_id},
            item_id = ${dish.item_id},
            order_item_status_id = ${dish.order_item_status_id},
            item_qty = ${dish.item_qty}
        WHERE order_items_id = ${dish.order_items_id}
      `;

      // Check status changes and update variables
      if (prevStatus === 1 && dish.order_item_status_id === 2) {
        itemStatusChangedTo2 = true;
      }
      if (dish.order_item_status_id !== 3) {
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
