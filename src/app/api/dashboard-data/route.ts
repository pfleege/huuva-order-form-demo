import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Add array to store the results of the two queries
    const [itemSales, statusTimes] = await sql.transaction([
      sql`
        SELECT
          brd.brand_name,
          itm.item_name,
          sum(orit.item_qty) AS total_qty
        FROM order_items orit
        INNER JOIN items itm ON orit.item_id = itm.item_id
        INNER JOIN brands brd ON brd.brand_id = orit.brand_id
        GROUP BY itm.item_name, brd.brand_name
        ORDER BY total_qty DESC
      `,
      sql`
        SELECT
          current_status,
          CASE current_status
            WHEN 2 THEN 'Pending -> In Progress'
            WHEN 3 THEN 'In Progress -> Ready for Delivery'
            WHEN 4 THEN 'Ready for Delivery -> Delivered'
          END AS current_status_text,
          EXTRACT(MINUTE FROM avg(time_diff)) AS minutes,
          TRUNC(EXTRACT(SECOND FROM avg(time_diff))) AS seconds
        FROM
          status_change_times
        GROUP BY
          current_status
        ORDER BY
          current_status;
        ;
      `,
    ]);
    console.log("Item Sales:", itemSales);
    console.log("Status Times:", statusTimes);
    return NextResponse.json({
      itemSales: itemSales || [],
      statusTimes: statusTimes || [],
    });
  } catch (error) {
    console.error(`Database error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
