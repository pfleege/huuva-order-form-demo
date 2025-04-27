import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Add array to store the results of the two queries
    const [itemSales, statusTimes, troughPut, customerOrders] =
      await sql.transaction([
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
        sql`
        SELECT
          DATE(delivered.status_update) AS order_date,
          EXTRACT(HOUR FROM delivered.status_update) AS order_hour,
          COUNT(DISTINCT delivered.order_id) AS throughput
        FROM
          order_status_history AS received
        JOIN
          order_status_history AS delivered
            ON received.order_id = delivered.order_id
        WHERE
          received.order_status_id = 1
          AND delivered.order_status_id = 4
          AND delivered.status_update > received.status_update
          AND EXTRACT(HOUR FROM delivered.status_update) BETWEEN 7 AND 21
        GROUP BY
          DATE(delivered.status_update),
          EXTRACT(HOUR FROM delivered.status_update)
        ORDER BY
          order_date, order_hour;
      `,
        sql`
        SELECT
          acc.account_id,
          acc.account_name,
          acc.account_email,
          COUNT(ord.order_id) AS number_of_orders
        FROM
          accounts acc
        LEFT JOIN
          orders ord ON acc.account_id = ord.account_id
        GROUP BY
          acc.account_id,
          acc.account_name,
          acc.account_email
        ORDER BY
          acc.account_id;
      `,
      ]);
    // console.log("Item Sales:", itemSales);
    // console.log("Status Times:", statusTimes);
    return NextResponse.json({
      itemSales: itemSales || [],
      statusTimes: statusTimes || [],
      troughPut: troughPut || [],
      customerOrders: customerOrders || [],
    });
  } catch (error) {
    console.error(`Database error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
