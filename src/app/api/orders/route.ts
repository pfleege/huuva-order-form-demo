/* 
Search db for active orders:
-> List all active orders
*/
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Exclude delivered orders (order_status_id = 4)
    const result = await sql`

      SELECT
        actv.history_id,
        actv.order_id,
        actv.order_status_id,
        actv.status_update,
        actv.order_created,
        actv.order_channel_id,
        actv.account_id,
        actv.address_id,
        actv.pickup_time,
        acc.account_name,
        acc.account_email,
        acc.account_phone,
        addr.city,
        addr.street,
        addr.postal_code,
        ost.order_status,
        json_agg(
          json_build_object(
          'order_items_id', orit.order_items_id,
          'brand_id', br.brand_id,
          'brand_name', br.brand_name,
          'item_id', itm.item_id,
          'item_name', itm.item_name,
          'item_qty', orit.item_qty,
          'order_item_status_id', orit.order_item_status_id,
          'order_status', osit.order_status
          )
        ) AS order_items

      FROM
        active_orders actv 
        INNER JOIN accounts acc ON actv.account_id = acc.account_id
        INNER JOIN delivery_addresses addr ON actv.address_id = addr.address_id
        INNER JOIN order_status ost ON ost.order_status_id = actv.order_status_id
        INNER JOIN order_items orit ON actv.order_id = orit.order_id
        INNER JOIN brands br on br.brand_id = orit.brand_id
        INNER JOIN items itm ON itm.item_id = orit.item_id
        INNER JOIN order_status osit ON orit.order_item_status_id = osit.order_status_id

      GROUP BY
        actv.history_id,
        actv.order_id,
        actv.order_status_id,
        actv.status_update,
        actv.order_created,
        actv.order_channel_id,
        actv.account_id,
        actv.address_id,
        actv.pickup_time,
        acc.account_name,
        acc.account_email,
        acc.account_phone,
        addr.city,
        addr.street,
        addr.postal_code,
        ost.order_status
      ;

      `;

    // Verify via console.log that result is logged as an array
    // console.log("API orders:", result);
    return NextResponse.json(result || []);
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
