"use client";

import { useState } from "react";
import { OrderFormProps } from "@/app/lib/definitions";
// import OrderDetails from "./OrderDetails";
import NewOrder from "./NewOrder";

const initialOrderData = {
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

const ActiveOrders = () => {
  const [loading, setLoading] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false); // Able to use same OrderDetails component for new order creation and for editing existing orders - default: edit existing order
  const [searchResult, setSearchResult] = useState<
    OrderFormProps["orderData"][]
  >([]);
  const [selectedOrder, setSelectedOrder] = useState<
    OrderFormProps["orderData"] | null
  >(null);
  const [orderFormVisible, setOrderFormVisible] = useState(false);

  // Click on Display Orders button
  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    setSelectedOrder(null);
    try {
      const response = await fetch(`/api/orders`);
      const orderData = await response.json();
      if (orderData && Array.isArray(orderData)) {
        // console.log(orderData);
        setSearchResult(orderData);
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResult([]);
    } finally {
      setLoading(false);
    }
  };

  // Click on order from search result
  const handleClick = (order: OrderFormProps["orderData"]) => {
    setSelectedOrder(order);
    setOrderFormVisible(true);
    console.log("Selected order:", order);
  };

  // Click on Add New Order button
  const handleAddOrder = () => {
    setSelectedOrder(initialOrderData);
    setOrderFormVisible(true);
    setIsNewOrder(true);
  };

  // Function to hide the NewOrder component
  const handleCancelOrder = () => {
    setOrderFormVisible(false);
    setSelectedOrder(null); // clear selected order
  };

  return (
    <div className="flex justify-center my-20">
      <div className="flex flex-col bg-[url('/modalBg.jpg')] bg-contain text-black p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        <div className="flex justify-between w-full">
          <div className="flex flex-col items-center text-2xl mx-auto">
            <form className="flex gap-2 text-2xl" onSubmit={handleSubmit}>
              <button
                type="submit"
                className="px-5 pt-1.5 pb-2 mb-4 bg-blue-500 text-white rounded-xl disabled:bg-gray-400 hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "Searching..." : "Display Orders"}
              </button>
            </form>

            <button
              className="px-4 pt-1.5 pb-2 bg-green-500 text-white rounded-xl hover:cursor-pointer"
              onClick={handleAddOrder}
            >
              Add New Order
            </button>

            {orderFormVisible && isNewOrder && selectedOrder && (
              // <OrderDetails orderData={selectedOrder} />
              <NewOrder
                orderData={selectedOrder}
                onCancel={handleCancelOrder}
              />
            )}

            {orderFormVisible && selectedOrder && !isNewOrder && (
              // <OrderDetails orderData={selectedOrder} />
              <NewOrder
                orderData={selectedOrder}
                onCancel={handleCancelOrder}
              />
            )}
          </div>
        </div>
        {searchResult.length > 0 && (
          <div className="flex flex-col mt-6 p-6 bg-neutral-600/50 text-white items-start w-full rounded-xl text-start text-2xl">
            {searchResult.map((order) => (
              <div
                onClick={() => handleClick(order)}
                // key={order?.order_id || idx}
                // key={`${order?.order_id ?? "order"}-${idx}`}
                key={order?.order_id}
                className="mb-4 border-b p-2 pb-4 rounded-xl cursor-pointer hover:bg-gray-100 hover:text-black w-full"
              >
                <p>
                  <strong>Account Name:</strong> {order?.account_name}
                </p>
                <p>
                  <strong>Order Created:</strong> {order?.order_created}
                </p>
                <p>
                  <strong>Dishes:</strong>
                  {order?.order_items && order.order_items.length > 0 ? (
                    order.order_items.map((item, i) => (
                      <span key={item.order_items_id || i}>
                        {item.item_name}
                        {i < order.order_items.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    <span>None</span>
                  )}
                </p>

                <p>
                  <strong>Order Status:</strong> {order?.order_status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* {selectedOrder && editOrderVisible && (
        <div className="h-[250px] bg-[url('/modalBg.jpg')] bg-contain text-white p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
          <h3 className="font-bold mb-2">Edit Order Status</h3>
          <form
            onSubmit={async (evt) => {
              evt.preventDefault();
              // Next step: Add API for adding new status
              // For order status: new row in order_status_history table
              // For order item update: replace current data in table
              try {
                const response = await fetch("/api/order-update", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    order_id: selectedOrder.order_id,
                    order_status_id: selectedOrder.order_status_id,
                  }),
                });
                if (!response.ok) {
                  throw new Error("Failed to update order status");
                }
                setEditOrderVisible(false);
                setSearchResult([]);
                alert("Order status has been updated!");
              } catch (error) {
                alert("There was an error updating the order status.");
                console.error(error);
              }
            }}
          >
            <div className="mb-2">
              <select
                name="order_status_id"
                value={selectedOrder.order_status_id}
                className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black text-2xl"
                onChange={(evt) => handleStatusChange(evt)}
              >
                <option value="1">order pending</option>
                <option value="2">order in progress</option>
                <option value="3">order ready for delivery</option>
                <option value="4">order delivered</option>
              </select>
            </div>
            <div className="flex justify-between gap-1 text-2xl">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-1 rounded-lg w-[50%] hover:cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-orange-300 text-white px-4 py-1 rounded-lg w-[50%] hover:cursor-pointer"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              className="bg-green-500 w-full mt-2 text-white px-4 py-1 text-2xl rounded-lg mb-10 hover:cursor-pointer"
              onClick={() => handleViewOrderDetails(selectedOrder!)}
            >
              View Order Details
            </button>
          </form>
        </div>
      )} */}
      {/* {selectedOrder && !isNewOrder && orderDetailsVisible && ( */}
    </div>
  );
};
export default ActiveOrders;
