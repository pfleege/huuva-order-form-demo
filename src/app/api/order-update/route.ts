import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { order_id, order_status } = await req.json();
    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      INSERT INTO order_status_history (order_id, order_status)
      VALUES (${order_id}, ${order_status})
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
