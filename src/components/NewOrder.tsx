"use client";

import { useState } from "react";
import { AddOrderProps } from "@/app/lib/definitions";

const initialOrderData = {
  account_name: "",
  account_email: "",
  account_phone: "",
  city: "",
  street: "",
  postal_code: "",
  dishes: [
    {
      brand_name: "",
      item_name: "",
      item_qty: 1,
      order_status: "order pending",
    },
  ],
};

const NewOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] =
    useState<AddOrderProps["orderData"]>(initialOrderData);

  // Generic handler for all input fields
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setOrderData((prev) => ({
      ...prev!,
      [name]: value || "",
    }));
  };

  //   const handleDropDown = (
  //     evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  //   ) => {
  //     const { name, value } = evt.target;
  //     setOrderData((prev) => ({
  //       ...prev!,
  //       [name]: value || "",
  //     }));
  //   };

  // Handle changes for dish fields
  const handleDishChange = (
    idx: number,
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = evt.target;
    setOrderData((prev) => {
      const newDishes = [...(prev?.dishes || [])];
      newDishes[idx] = {
        ...newDishes[idx],
        [name]: name === "item_qty" ? Number(value) : value,
      };
      return {
        ...prev!,
        dishes: newDishes,
      };
    });
  };
  // Add a new empty dish order
  const addDishOrder = () => {
    setOrderData((prev) => ({
      ...prev!,
      dishes: [
        ...(prev?.dishes || []),
        {
          brand_name: "",
          item_name: "",
          item_qty: 1,
          order_status: "order pending",
        },
      ],
    }));
  };
  // Remove a dish order
  const removeDishOrder = (idx: number) => {
    setOrderData((prev) => {
      const newDishes = [...(prev?.dishes || [])];
      newDishes.splice(idx, 1);
      return {
        ...prev!,
        dishes: newDishes,
      };
    });
  };

  return (
    <div className="flex">
      <div className="p-4 mt-4 border rounded bg-gray-50 text-black">
        <h3 className="font-bold mb-2">Add New Order</h3>
        <form
          onSubmit={async (evt) => {
            evt.preventDefault();
            setLoading(true);
            console.log("Submitting order data:", JSON.stringify(orderData));
            try {
              const response = await fetch("/api/add-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData),
              });
              if (!response.ok)
                throw new Error("Failed to update order status");
              alert("Order status has been updated!");
            } catch (error) {
              alert("There was an error updating the order status.");
              console.error(error);
            }
            setLoading(false);
            setOrderData(initialOrderData);
          }}
        >
          <div className="flex mb-2 text-2xl justify-between">
            <label className="font-semibold pr-2">Name:</label>
            <input
              className="border px-2 rounded"
              name="account_name"
              value={orderData?.account_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex mb-2 text-2xl justify-between">
            <label className="font-semibold pr-2">Email:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_email"
              value={orderData?.account_email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex mb-2 text-2xl justify-between">
            <label className="font-semibold pr-2">Phone:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_phone"
              value={orderData?.account_phone || ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mt-6 mb-3">
            <h3 className="text-3xl py-2">Delivery Address</h3>
            <div className="flex flex-col mb-2 text-2xl">
              <div className="flex mb-2 text-2xl justify-between">
                <label className="font-semibold pr-2">City:</label>
                <input
                  className="border px-2 py-1 rounded"
                  name="city"
                  value={orderData?.city || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2 text-2xl justify-between">
                <label className="font-semibold pr-2">Street Name:</label>
                <input
                  className="border px-2 py-1 rounded"
                  name="street"
                  value={orderData?.street || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2 text-2xl justify-between">
                <label className="font-semibold pr-2">Postal Code:</label>
                <input
                  className="border px-2 py-1 rounded"
                  name="postal_code"
                  value={orderData?.postal_code || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-6 mb-3">
            <h3 className="text-3xl py-2">Dish Order</h3>
            {orderData?.dishes?.map((dish, idx) => (
              <div
                key={idx}
                className="flex flex-col mb-4 border p-2 rounded bg-white"
              >
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Kitchen:</label>
                  <select
                    name="brand_name"
                    value={dish.brand_name}
                    className="border-[1px] w-[285px] px-2 py-1 rounded"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value=""></option>
                    <option value="Brand_1">Brand_1</option>
                    <option value="Brand_2">Brand_2</option>
                    <option value="Brand_3">Brand_3</option>
                    <option value="Brand_4">Brand_4</option>
                  </select>
                </div>
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Dish:</label>
                  <select
                    name="item_name"
                    value={dish.item_name}
                    className="border-[1px] w-[285px] px-2 py-1 rounded"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value=""></option>
                    <option value="Item_1">Item_1</option>
                    <option value="Item_2">Item_2</option>
                    <option value="Item_3">Item_3</option>
                    <option value="Item_4">Item_4</option>
                  </select>
                </div>
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Quantity:</label>
                  <select
                    name="item_qty"
                    value={dish.item_qty}
                    className="border-[1px] w-[285px] px-2 py-1 rounded"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                {orderData.dishes.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 underline mt-2"
                    onClick={() => removeDishOrder(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-1 rounded mb-4"
              onClick={addDishOrder}
            >
              Add order
            </button>
          </div>
          {/* ... submit/cancel buttons ... */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-1 rounded"
            disabled={loading}
          >
            {loading ? "Sending order..." : "Send order"}
          </button>
          <button
            type="button"
            className="ml-2 text-gray-500 underline"
            onClick={() => setOrderData(initialOrderData)}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;
