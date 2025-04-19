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
    // Change SQL based on infomration need - currently only account information provided (name, phone, email)
    const [user] = await sql`
      SELECT 
      acc.account_name, 
      TO_CHAR(orse.order_created, 'DD-MM-YYYY at HH24:MI') AS order_created, 
      ost.order_status, 
      TO_CHAR(ost.status_update, 'DD-MM-YYYY at HH24:MI') AS status_update
      FROM accounts acc
      INNER JOIN order_set orse ON acc.account_id = orse.account_id
      INNER JOIN (
        SELECT DISTINCT ON (order_id) *
        FROM order_status_history INNER JOIN order_status os ON order_status_history.order_status_id = os.order_status_id
        ORDER BY order_id, status_update DESC
      ) AS ost ON orse.order_id = ost.order_id
      WHERE acc.account_email = ${email}

      
      `;

    return NextResponse.json(user || null);
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
