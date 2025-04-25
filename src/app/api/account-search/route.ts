/* 
Search db by account in order to:
-Be able to quickly find specific order (requires change of SQL)
-Be able to update status of latest order (requires change of SQL)
*/
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("account_email");

  if (!email) {
    return NextResponse.json(
      { error: "Account email required" },
      { status: 400 }
    );
  }
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const user = await sql`

      SELECT 
        acc.account_name,
        TO_CHAR(ord.order_created, 'DD-MM-YYYY at HH24:MI') AS order_created,
        ost.order_status,
        TO_CHAR(ost.status_update, 'DD-MM-YYYY at HH24:MI') AS status_update,
        json_agg(
          json_build_object(
            'brand_name', br.brand_name,
            'item_name', itm.item_name,
            'item_qty', orit.item_qty,
			      'order_status', os_item.order_status
          )
        ) AS order_items
      FROM 
        accounts acc
        INNER JOIN orders ord ON acc.account_id = ord.account_id
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
        acc.account_email = ${email}
      GROUP BY
        acc.account_name, ord.order_created, ost.order_status, ost.status_update
      
      `;
    console.log("API orders:", user);
    return NextResponse.json(user || null);
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
