"use client";

import { useState } from "react";
import { OrderFormProps, initialOrderData } from "@/app/lib/definitions";
import NewOrder from "./NewOrder";

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

    // Scroll up to view the selected order details
    setTimeout(() => {
      window.scrollTo({
        top: 900,
        behavior: "smooth",
      });
    }, 0);
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
    setSelectedOrder(null);
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
              <NewOrder
                orderData={selectedOrder}
                onCancel={handleCancelOrder}
              />
            )}

            {orderFormVisible && selectedOrder && !isNewOrder && (
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
    </div>
  );
};
export default ActiveOrders;
