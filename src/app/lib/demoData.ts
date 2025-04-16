import {
  accountType,
  deliveryAddressType,
  orderChannelType,
  orderType,
  orderItemsType,
  orderStatusHistoryType,
} from "./definitions";

export const accounts: accountType[] = [
  // account_id is auto-incremented
  {
    account_name: "Account_1",
    account_phone: "+12345678",
    account_email: "account.1@demo.com", // UNIQUE
  },
  {
    account_name: "Account_2",
    account_phone: "+23456789",
    account_email: "account.2@demo.com", // UNIQUE
  },

  {
    account_name: "Account_3",
    account_phone: "+34567890",
    account_email: "account.3@demo.com", // UNIQUE
  },
];

export const delivery_addresses: deliveryAddressType[] = [
  // address_id is auto-incremented
  {
    city: "City_1",
    street: "Street_1",
    postal_code: "01234",
  },
  {
    city: "City_2",
    street: "Street_2",
    postal_code: "12345",
  },
  {
    city: "City_3",
    street: "Street_3",
    postal_code: "23456",
  },
];

export const order_channel: orderChannelType[] = [
  // order_channel_id is auto-incremented
  {
    order_channel: "phone",
  },
  {
    order_channel: "email",
  },
  {
    order_channel: "online",
  },
];

export const orders: orderType[] = [
  // order_id is auto-incremented
  {
    order_created: "2025-01-22T20:00:00Z",
    brand_id: 1,
    order_channel_id: 1,
    account_id: 1,
    address_id: 1,
    pickup_time: "2025-01-22T22:30:00Z",
  },
  {
    order_created: "2025-02-15T10:00:00Z",
    brand_id: 2,
    order_channel_id: 3,
    account_id: 3,
    address_id: 3,
    pickup_time: "2025-02-15T12:30:00Z",
  },
  {
    order_created: "2025-04-02T18:45:00Z",
    brand_id: 3,
    order_channel_id: 2,
    account_id: 2,
    address_id: 2,
    pickup_time: "2025-04-02T19:15:00Z",
  },
];

export const order_items: orderItemsType[] = [
  // brand_id is auto-incremented
  {
    item_id: 3,
    item_name: "Item_3",
    item_plu: "CAT3-0001",
    item_qty: 4,
  },
  {
    item_id: 1,
    item_name: "Item_2",
    item_plu: "CAT2-0001",
    item_qty: 2,
  },
  {
    item_id: 2,
    item_name: "Item_1",
    item_plu: "CAT1-0001",
    item_qty: 5,
  },
];

export const order_status_history: orderStatusHistoryType[] = [
  // brand_id is auto-incremented
  {
    order_id: 1,
    order_status: 2,
    status_update: "2025-01-22T22:30:00Z",
  },
  {
    order_id: 2,
    order_status: 1,
    status_update: "2025-02-15T12:30:00Z",
  },
  {
    order_id: 3,
    order_status: 4,
    status_update: "2025-04-02T18:45:00Z",
  },
];
