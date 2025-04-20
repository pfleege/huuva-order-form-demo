import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql`

        SELECT
        brd.brand_name,
        itm.item_name,
        sum(orit.item_qty) AS total_qty
        FROM order_items orit
        INNER JOIN items itm ON orit.item_id = itm.item_id
        INNER JOIN brands brd ON brd.brand_id = orit.brand_id
        GROUP BY
        itm.item_name, brd.brand_name
        ORDER BY total_qty DESC

      `;

    // Verify via console.log that result is logged as an array
    // console.log("Dashboard data:", result);
    return NextResponse.json(result || []);
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
