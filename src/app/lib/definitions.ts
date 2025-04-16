/*
Example:
export type Invoice = {
    id: string;
    customer_id: string;
    amount: number;
    date: string;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
    status: 'pending' | 'paid';
};
*/

export type accountType = {
  account_name: string;
  account_phone: string;
  account_email: string;
};

export type deliveryAddressType = {
  city: string;
  street: string;
  postal_code: string;
};

export type orderChannelType = {
  order_channel_id: number;
  order_channel: string;
};

export type orderType = {
  order_created: string;
  brand_id: number;
  order_channel_id: number;
  account_id: number;
  address_id: number;
  pickup_time: string;
};

export type orderItemsType = {
  item_id: number;
  item_name: string;
  item_plu: string;
  item_qty: number;
};

export type orderStatusHistoryType = {
  order_id: number;
  order_status: number;
  status_update: string;
};
