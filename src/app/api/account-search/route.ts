/* 
Search db by account in order to:
-Be able to quickly find specific order (requires change of SQL)
-Be able to update status of latest order (requires change of SQL)
*/
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Account email required" },
      { status: 400 }
    );
  }
  try {
    const sql = neon(process.env.DATABASE_URL!);
    // Change SQL based on infomration need - currently only account information provided (name, phone, email)
    const [user] = await sql`SELECT * FROM accounts WHERE email = ${email}`;

    return NextResponse.json(user || null);
  } catch (error) {
    console.log(`Error: ${error}`);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
