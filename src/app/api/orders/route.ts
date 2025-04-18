/* 
Search db for active orders:
-> List all active orders
*/
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Exclude delivered orders (here defined as order_status = 4)
    const result = await sql`SELECT * FROM orders ord INNER JOIN (
        SELECT DISTINCT ON (order_id) *
        FROM order_status_history
        ORDER BY order_id, status_update DESC
      ) AS ost ON ord.order_id = ost.order_id WHERE ost.order_status <> 4`;
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
