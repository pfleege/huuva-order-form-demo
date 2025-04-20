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
        TO_CHAR(ord.order_created, 'DD-MM-YYYY at HH24:MI') AS order_created,
        ost.order_status,
        osth.order_status_id,
        TO_CHAR(osth.status_update, 'DD-MM-YYYY at HH24:MI') AS status_update
        FROM orders ord INNER JOIN (
        SELECT DISTINCT ON (order_id) *
        FROM order_status_history
        ORDER BY order_id, status_update DESC
      ) AS osth ON ord.order_id = osth.order_id INNER JOIN
        accounts acc ON ord.account_id = acc.account_id
        INNER JOIN delivery_addresses addr ON ord.address_id = addr.address_id
        INNER JOIN order_status ost ON osth.order_status_id = ost.order_status_id
       
      WHERE osth.order_status_id <> 4`;
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
