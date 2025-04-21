/* 
Search db for active orders:
-> List all active orders
*/
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const {
      /* Add properties */
    } = await req.json();
    const sql = neon(process.env.DATABASE_URL!);

    await sql`

      /* ADD SQL */

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
