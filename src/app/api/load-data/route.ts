import { Client } from "pg";
import { NextResponse } from "next/server";

import { accountType } from "@/app/lib/definitions";

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

const accounts: [
  accountType
  // {
  //   account_id: string;
  //   account_name: string;
  //   account_phone: string;
  //   email: string;
  // }
] = [
  // To add test-user -> make sure to un-comment "insertedUsers()" below
  {
    account_id: "1", // CHANGE! Must be unique
    account_name: "TestUser2",
    account_phone: "+12345678",
    account_email: "test@test.com", // CHANGE! Must be unique
  },
];

async function loadTables() {
  await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        account_id SERIAL PRIMARY KEY,
        account_name VARCHAR(255),
        account_phone VARCHAR(50),
        account_email VARCHAR(255) UNIQUE
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS delivery_addresses (
        address_id SERIAL PRIMARY KEY,
        city VARCHAR(100),
        street VARCHAR(255),
        postal_code VARCHAR(20)
      );
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS order_channel (
          order_channel_id SERIAL PRIMARY KEY,
          order_channel VARCHAR(255)
        );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        order_created TIMESTAMP DEFAULT NOW(),
        brand_id INT,
        order_channel_id INT REFERENCES order_channel(order_channel_id),
        account_id INT REFERENCES accounts(account_id),
        address_id INT REFERENCES delivery_addresses(address_id),
        pickup_time TIMESTAMP,
        order_status INT
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        brand_id SERIAL PRIMARY KEY,
        item_id INT,
        item_name VARCHAR(255),
        item_plu VARCHAR(255),
        item_qty INT
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        history_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        order_status INT,
        status_update TIMESTAMP DEFAULT NOW()
      );
    `);

  // Un-comment to insert test-user

  const insertAccounts = await Promise.all(
    accounts.map(async (account) => {
      return client.query(
        `
            INSERT INTO accounts (account_name, account_phone, account_email)
            VALUES ($1, $2, $3)
            ON CONFLICT (account_email) DO NOTHING;
          `,
        [
          // account.account_id,
          account.account_name,
          account.account_phone,
          account.account_email,
        ]
      );
    })
  );
  return insertAccounts;
}

export async function GET() {
  try {
    await client.connect();
    await client.query("BEGIN");
    await loadTables();
    await client.query("COMMIT");
    await client.end();
    return NextResponse.json({ message: "Accounts loaded successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    await client.end();
    console.error("Error loading accounts:", error);
    return NextResponse.json(
      { error: "Failed to load accounts" },
      { status: 500 }
    );
  }
}
