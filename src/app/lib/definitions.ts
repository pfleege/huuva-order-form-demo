/*
TYPE DEFINITION EXAMPLE:
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

// TYPES:
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
  order_channel_id: number; // Manually set in the database
  order_channel: string;
};

export type ordersType = {
  order_created: string;
  order_channel_id: number;
  account_id: number;
  address_id: number;
  pickup_time: string;
};

export type brandsType = {
  brand_id: number; // Manually set in the database
  brand_name: string;
};

export type orderItemsType = {
  order_item_status_id: number;
  order_id: number;
  brand_id: number;
  item_id: number;
  item_qty: number;
};

export type itemsType = {
  item_id: number; // Manually set in the database
  item_name: string;
  item_plu: string;
};

export type orderStatusType = {
  order_status_id: number; // Manually set in the database
  order_status: string;
};

export type orderStatusHistoryType = {
  order_status_id: number;
  order_id: number;
  status_update: string;
};

// INITIAL FORM DATA
export const initialOrderData = {
  account_name: "",
  account_email: "",
  account_phone: "",
  account_id: 0,
  address_id: 0,
  brand_id: 0,
  order_channel_id: 0,
  city: "",
  street: "",
  postal_code: "",
  order_created: "",
  order_id: 0,
  order_status: "order pending",
  order_status_id: 0,
  order_items: [],
  pickup_time: "",
  status_update: "",
  dishes: [
    {
      brand_id: 0,
      order_items_id: 0,
      brand_name: "",
      item_name: "",
      item_id: 0,
      item_qty: 1,
      order_item_status_id: 0,
      order_status: "order pending",
    },
  ],
};

// INTERFACES - OrderSearch, NewOrder Searchbar:
export interface OrderFormProps {
  orderData?: {
    account_email: string;
    account_id: number;
    account_name: string;
    account_phone: string;
    address_id: number;
    city: string;
    street: string;
    postal_code: string;
    brand_id: number;
    order_channel_id: number;
    order_created: string;
    order_id: number;
    pickup_time: string;
    order_status_id: number;
    order_status: string;
    status_update: string;
    order_items: DishOrder[];
  };
  onCancel: () => void;
  isNewOrder?: boolean;
}

export interface DishOrder {
  brand_id: number;
  brand_name: string;
  order_items_id: number;
  item_id: number;
  item_name: string;
  item_qty: number;
  order_item_status_id: number;
  order_status: string;
}

//NewOrder
export interface AddOrderProps {
  orderData?: {
    order_id: number;
    account_name: string;
    account_email: string;
    account_phone: string;
    city: string;
    street: string;
    postal_code: string;
    dishes: DishOrder[]; // Add array of DishOrder objects
  };
}

export interface DashboardProps {
  dashboardData?: {
    brand_name: string;
    item_id: number;
    item_name: string;
    item_qty: number;
    total_qty: number;
  };
}

export interface OrderDetailsProps {
  orderDetails?: OrderFormProps["orderData"];
  // orderDetails?: OrderFormProps["orderData"][];
}
