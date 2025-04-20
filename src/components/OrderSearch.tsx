"use client";

import { useState } from "react";
import { OrderFormProps } from "@/app/lib/definitions";

const ActiveOrders = () => {
  const [loading, setLoading] = useState(false);
  const [editOrderVisible, setEditOrderVisible] = useState(false);
  const [searchResult, setSearchResult] = useState<
    OrderFormProps["orderData"][]
  >([]);
  const [selectedOrder, setSelectedOrder] = useState<
    OrderFormProps["orderData"] | null
  >(null);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/orders`);
      const orderData = await response.json();
      if (orderData && Array.isArray(orderData)) {
        console.log(orderData);
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

  const handleClick = (order: OrderFormProps["orderData"]) => {
    setSelectedOrder(order);
    setEditOrderVisible(true);
    console.log("Selected order:", order);
  };

  // Handle changes for dish fields
  const handleStatusChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedOrder) return;

    setSelectedOrder({
      ...selectedOrder,
      order_status_id: parseInt(evt.target.value, 10),
    });
  };

  return (
    <div className="flex">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-center">
          <form className="flex gap-2 text-2xl" onSubmit={handleSubmit}>
            <button
              type="submit"
              className="px-4 pb-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Searching..." : "Display Orders"}
            </button>
          </form>
        </div>
        {searchResult.length > 0 && (
          <div className="flex flex-col p-6 text-black items-start w-full">
            {searchResult.map((order, idx) => (
              <div
                onClick={() => handleClick(order)}
                key={order?.order_id || idx}
                className="mb-4 border-b pb-2 cursor-pointer hover:bg-gray-100"
              >
                <p>
                  <strong>Account Name:</strong> {order?.account_name}
                </p>
                <p>
                  <strong>Order Created:</strong> {order?.order_created}
                </p>

                <p>
                  <strong>Order Status:</strong> {order?.order_status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedOrder && editOrderVisible && (
        <div className="p-4 mt-4 border rounded bg-gray-50 text-black">
          <h3 className="font-bold mb-2">Edit Order</h3>
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
              <label className="block font-semibold">Order Status:</label>
              <select
                name="order_status_id"
                value={selectedOrder.order_status_id}
                className="border-[1px] w-[285px] px-2 py-1 rounded"
                onChange={(e) => handleStatusChange(e)}
              >
                <option value="1">order pending</option>
                <option value="2">order in progress</option>
                <option value="3">order ready for delivery</option>
                <option value="4">order delivered</option>
              </select>
              {/* <input
                className="border px-2 py-1 rounded"
                value={selectedOrder.order_status_id}
                onChange={(evt) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    order_status_id: parseInt(evt.target.value, 10),
                  })
                }
              /> */}
            </div>
            {/* Insert other relevant order fields */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="ml-2 text-gray-500 underline"
              onClick={() => setSelectedOrder(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default ActiveOrders;
