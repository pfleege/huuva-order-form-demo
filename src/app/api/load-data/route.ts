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
  brands,
  items,
  order_items,
  order_status,
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
        account_email VARCHAR(255),
        -- Add a unique constraint to ensure no duplicate accounts
        -- based on name, email, and phone number
        CONSTRAINT unique_account_combo 
          UNIQUE (account_name, account_email, account_phone)
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS delivery_addresses (
        address_id SERIAL PRIMARY KEY,
        city VARCHAR(100),
        street VARCHAR(255),
        postal_code VARCHAR(20),
        -- Add a unique constraint to ensure no duplicate
        -- city/street/postal_code combinations
        CONSTRAINT unique_address_combo 
          UNIQUE (city, street, postal_code)
      );
    `);

  await client.query(`
        CREATE TABLE IF NOT EXISTS order_channel (
          order_channel_id INT PRIMARY KEY,
          order_channel VARCHAR(255)
        );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS order_status (
        order_status_id INT PRIMARY KEY,
        order_status VARCHAR(255)
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        order_created TIMESTAMP DEFAULT NOW(),
        order_channel_id INT REFERENCES order_channel(order_channel_id),
        account_id INT REFERENCES accounts(account_id),
        address_id INT REFERENCES delivery_addresses(address_id),
        pickup_time TIMESTAMP
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        item_id INT PRIMARY KEY,
        item_name VARCHAR(255),
        item_plu VARCHAR(255)
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS brands (
        brand_id INT PRIMARY KEY,
        brand_name VARCHAR(255)
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS order_status (
        order_status_id INT PRIMARY KEY,
        order_status VARCHAR(255)
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_items_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        brand_id INT REFERENCES brands(brand_id),
        item_id INT REFERENCES items(item_id),
        item_qty INT,
        order_item_status_id INT REFERENCES order_status(order_status_id)
      );
    `);

  await client.query(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        history_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        order_status_id INT REFERENCES order_status(order_status_id),
        status_update TIMESTAMP DEFAULT NOW()
      );
    `);

  // Add view necessary for querying items and order status at a later stage
  await client.query(`
      CREATE VIEW active_orders AS
      SELECT DISTINCT ON (osth.order_id)
        osth.history_id,
        osth.order_id,
        osth.order_status_id,
        osth.status_update,
        ord.order_created,
        ord.order_channel_id,
        ord.account_id,
        ord.address_id,
        ord.pickup_time
      FROM order_status_history osth 
      INNER JOIN orders ord ON osth.order_id = ord.order_id
      WHERE osth.order_status_id <> 4
      ORDER BY osth.order_id, osth.status_update DESC;
    `);

  // Views for Dashboard queries
  await client.query(`
      CREATE VIEW status_change_times AS
      SELECT
      order_id,
      current_status,
      time_diff
      FROM (
      SELECT
        order_id,
        order_status_id AS current_status,
        LAG(order_status_id) OVER win AS previous_status,
        status_update AS current_time,
        LAG(status_update) OVER win AS previous_time,
        status_update - LAG(status_update) OVER win AS time_diff
      FROM order_status_history
      WINDOW win AS (PARTITION BY order_id ORDER BY status_update)
      )
      WHERE not time_diff isnull
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
            ON CONFLICT (account_name, account_email, account_phone)
            DO UPDATE SET 
              account_name = EXCLUDED.account_name
            RETURNING account_id;
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

  // Un-comment to insert test-order-channels
  const insertOrderChannel = await Promise.all(
    order_channel.map(async (channel) => {
      return client.query(
        `
            INSERT INTO order_channel (order_channel_id, order_channel)
            VALUES ($1, $2)
          `,
        [channel.order_channel_id, channel.order_channel]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderChannel);

  // Un-comment to insert test-order-channels
  const insertOrderStatus = await Promise.all(
    order_status.map(async (status) => {
      return client.query(
        `
            INSERT INTO order_status (order_status_id, order_status)
            VALUES ($1, $2)
          `,
        [status.order_status_id, status.order_status]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderStatus);

  // Un-comment to insert test-orders
  const insertOrderSet = await Promise.all(
    orders.map(async (order) => {
      return client.query(
        `
            INSERT INTO orders (order_created, order_channel_id, account_id, address_id, pickup_time)
            VALUES ($1, $2, $3, $4, $5)
          `,
        [
          order.order_created,
          order.order_channel_id,
          order.account_id,
          order.address_id,
          order.pickup_time,
        ]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderSet);

  // Un-comment to insert test-order_items
  const insertBrands = await Promise.all(
    brands.map(async (brand) => {
      return client.query(
        `
            INSERT INTO brands (brand_id, brand_name)
            VALUES ($1, $2)
          `,
        [brand.brand_id, brand.brand_name]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertBrands);

  // Un-comment to insert test-order_items
  const insertItems = await Promise.all(
    items.map(async (item) => {
      return client.query(
        `
            INSERT INTO items (item_id, item_name, item_plu)
            VALUES ($1, $2, $3)
          `,
        [item.item_id, item.item_name, item.item_plu]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertItems);

  // Un-comment to insert test-order_items
  const insertOrderItems = await Promise.all(
    order_items.map(async (order_item) => {
      return client.query(
        `
            INSERT INTO order_items (order_id, brand_id, item_id, item_qty, order_item_status_id)
            VALUES ($1, $2, $3, $4, $5)
          `,
        [
          order_item.order_id,
          order_item.brand_id,
          order_item.item_id,
          order_item.item_qty,
          order_item.order_item_status_id,
        ]
      );
    })
  );
  // return insertDeliveryAddress;
  console.log(insertOrderItems);

  // Un-comment to insert test-order_history
  const insertOrderStatusHistory = await Promise.all(
    order_status_history.map(async (history) => {
      return client.query(
        `
            INSERT INTO order_status_history (order_status_id, order_id, status_update)
            VALUES ($1, $2, $3)
          `,
        [history.order_status_id, history.order_id, history.status_update]
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
