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

  const handleClick = (order: OrderFormProps["orderData"]) => {
    setSelectedOrder(order);
    setEditOrderVisible(true);
    // console.log("Selected order:", order);
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
    <div className="flex justify-center my-20">
      <div className="bg-[url('/modalBg.jpg')] bg-contain text-black p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        <div className="flex justify-center">
          <form className="flex gap-2 text-2xl" onSubmit={handleSubmit}>
            <button
              type="submit"
              className="px-4 pt-1.5 pb-2 bg-blue-500 text-white rounded-xl disabled:bg-gray-400 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Searching..." : "Display Orders"}
            </button>
          </form>
        </div>
        {searchResult.length > 0 && (
          <div className="flex flex-col mt-6 p-6 bg-neutral-600/50 text-white items-start w-full rounded-xl text-start text-2xl">
            {searchResult.map((order, idx) => (
              <div
                onClick={() => handleClick(order)}
                key={order?.order_id || idx}
                className="mb-4 border-b p-2 pb-4 rounded-xl cursor-pointer hover:bg-gray-100 hover:text-black w-full"
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
        <div className="h-[200px] bg-[url('/modalBg.jpg')] bg-contain text-white p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
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
                onChange={(e) => handleStatusChange(e)}
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
          </form>
        </div>
      )}
    </div>
  );
};
export default ActiveOrders;
