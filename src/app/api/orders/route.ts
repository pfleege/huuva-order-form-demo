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
        ord.order_id,		
        acc.account_name,
        acc.account_email,
        acc.account_phone,
        addr.city,
        addr.street,
        addr.postal_code,
        TO_CHAR(ord.order_created, 'DD-MM-YYYY at HH24:MI') AS order_created,
        ost.order_status,
        oshi.order_status_id,
        TO_CHAR(ost.status_update, 'DD-MM-YYYY at HH24:MI') AS status_update,
        json_agg(
          json_build_object(
            'order_items_id', orit.order_items_id,
            'brand_id', br.brand_id,
            'brand_name', br.brand_name,
            'item_id', itm.item_id,
            'item_name', itm.item_name,
            'item_qty', orit.item_qty,
            'order_status', os_item.order_status
          )
        ) AS order_items
      FROM 
        accounts acc
        INNER JOIN orders ord ON acc.account_id = ord.account_id 
        INNER JOIN order_status_history oshi ON ord.order_id = oshi.order_id
        INNER JOIN (
          SELECT DISTINCT ON (order_id) *
          FROM order_status_history
          INNER JOIN order_status os ON order_status_history.order_status_id = os.order_status_id
          ORDER BY order_id, status_update DESC
        ) AS ost ON ord.order_id = ost.order_id
        INNER JOIN delivery_addresses addr ON ord.address_id = addr.address_id 
        INNER JOIN order_items orit ON orit.order_id = ord.order_id
        INNER JOIN order_status os_item ON orit.order_item_status_id = os_item.order_status_id
        INNER JOIN items itm ON itm.item_id = orit.item_id
        INNER JOIN brands br ON br.brand_id = orit.brand_id
      WHERE 
        ord.order_id IN (SELECT orders.order_id FROM orders INNER JOIN order_status_history ON order_status_history.order_id = orders.order_id
        WHERE order_status_history.order_status_id <> 4)
      GROUP BY
        ord.order_id, acc.account_name, acc.account_email, acc.account_phone, addr.city, addr.street, addr.postal_code, ord.order_created, ost.order_status, oshi.order_status_id, ost.status_update

        `;

    // Verify via console.log that result is logged as an array
    console.log("API orders:", result);
    return NextResponse.json(result || []);
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
