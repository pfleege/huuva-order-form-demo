import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      account_name,
      account_email,
      account_phone,
      city,
      street,
      postal_code,
      dishes,
    } = await req.json();

    // console.log(`Received ${dishes.length} dishes in order`);

    const sql = neon(process.env.DATABASE_URL!);

    // Add Account (if it doesn't exist)
    // If it does exist, return the existing account_id
    const account = await sql`
      INSERT INTO accounts (account_name, account_email, account_phone)
      VALUES (${account_name}, ${account_email}, ${account_phone})
      -- Return existing account if it already exists
      ON CONFLICT (account_name, account_email, account_phone) 
      DO UPDATE SET
        account_name = EXCLUDED.account_name
      RETURNING account_id;
    `;

    // Add Pick-Up Address (if it doesn't exist)
    // If it does exist, return the existing address_id
    const address = await sql`
      INSERT INTO delivery_addresses (city, street, postal_code)
      VALUES (${city}, ${street}, ${postal_code})
      -- Return existing address if it already exists
      ON CONFLICT (city, street, postal_code)
      DO UPDATE SET 
        city = EXCLUDED.city
      RETURNING address_id;
    `;

    // Add Order
    const order = await sql`
      INSERT INTO orders (
        order_created, 
        order_channel_id, 
        account_id, 
        address_id,
        pickup_time
      ) VALUES (
        NOW(), 
        1, 
        ${account[0].account_id}, 
        ${address[0].address_id},  
        NOW() + INTERVAL '2 hours'
      )
      RETURNING order_id;
    `;

    // Add All Dishes
    for (const dish of dishes) {
      await sql`
            INSERT INTO order_items (
            order_id,
            brand_id,
            item_id,
            item_qty,
            order_item_status_id
            ) VALUES (
            ${order[0].order_id},
            (SELECT brand_id FROM brands WHERE brand_name = ${dish.brand_name}),
            (SELECT item_id FROM items WHERE item_name = ${dish.item_name}),
            ${dish.item_qty},
            1
            )
        `;
    }

    // Add All Dishes
    await sql`
        INSERT INTO order_status_history (
          order_status_id,
          order_id,
          status_update
        ) VALUES (
            1,
          ${order[0].order_id},
          NOW()
        )
          RETURNING history_id;
      `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error: ${error}`);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
