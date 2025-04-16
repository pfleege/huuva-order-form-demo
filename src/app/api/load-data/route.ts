/* 
To load data into database:
1) Uncomment relevant step below
2) Go to page http://localhost:3000/api/load-data and run page
*/

import { Client } from "pg";
import { NextResponse } from "next/server";

// Uncomment in order to add demoData from /app/lib/demoData.ts
// Uncomment relevant insert step below as well
import {
  accounts,
  delivery_addresses,
  order_channel,
  orders,
  order_items,
  order_status_history,
} from "@/app/lib/demoData";

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

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
        pickup_time TIMESTAMP
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

  /* 
  Uncomment to insert demo data from /app/lib/demoData.ts
  */
  // Uncomment to insert test-accounts
  const insertAccounts = await Promise.all(
    accounts.map(async (account) => {
      return client.query(
        `
            INSERT INTO accounts (account_name, account_phone, account_email)
            VALUES ($1, $2, $3)
            ON CONFLICT (account_email) DO NOTHING;
          `,
        [account.account_name, account.account_phone, account.account_email]
      );
    })
  );
  // return insertAccounts;
  console.log(insertAccounts);

  // Un-comment to insert test-delivery_addresses
  const insertDeliveryAddress = await Promise.all(
    delivery_addresses.map(async (address) => {
      return client.query(
        `
            INSERT INTO delivery_addresses (city, street, postal_code)
            VALUES ($1, $2, $3)
          `,
        [address.city, address.street, address.postal_code]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertDeliveryAddress);

  // Un-comment to insert test-delivery_addresses
  const insertOrderChannel = await Promise.all(
    order_channel.map(async (channel) => {
      return client.query(
        `
            INSERT INTO order_channel (order_channel)
            VALUES ($1)
          `,
        [channel.order_channel]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderChannel);

  // Un-comment to insert test-delivery_addresses
  const insertOrders = await Promise.all(
    orders.map(async (order) => {
      return client.query(
        `
            INSERT INTO orders (order_created, brand_id, order_channel_id, account_id, address_id, pickup_time)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
        [
          order.order_created,
          order.brand_id,
          order.order_channel_id,
          order.account_id,
          order.address_id,
          order.pickup_time,
        ]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrders);

  // Un-comment to insert test-delivery_addresses
  const insertOrderItems = await Promise.all(
    order_items.map(async (items) => {
      return client.query(
        `
            INSERT INTO order_items (item_id, item_name, item_plu, item_qty)
            VALUES ($1, $2, $3, $4)
          `,
        [items.item_id, items.item_name, items.item_plu, items.item_qty]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderItems);

  // Un-comment to insert test-delivery_addresses
  const insertOrderStatusHistory = await Promise.all(
    order_status_history.map(async (history) => {
      return client.query(
        `
            INSERT INTO order_status_history (order_id, order_status, status_update)
            VALUES ($1, $2, $3)
          `,
        [history.order_id, history.order_status, history.status_update]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderStatusHistory);
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
