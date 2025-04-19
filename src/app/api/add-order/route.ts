import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { account_name, account_email, account_phone } = await req.json();
    console.log(
      `order_id: ${account_name}, order_status_id: ${account_email} account_phone: ${account_phone}`
    );
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO accounts (account_name, account_email, account_phone)
      VALUES (${account_name}, ${account_email}, ${account_phone})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(`Error: ${error}`);

    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
