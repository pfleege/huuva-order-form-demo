"use client";

import { useState } from "react";
import { AddOrderProps } from "@/app/lib/definitions";

const initialOrderData = {
  account_name: "",
  account_email: "",
  account_phone: "",
  // Add other fields as needed
};

const NewOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] =
    useState<AddOrderProps["orderData"]>(initialOrderData);

  // Generic handler for all inputs
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setOrderData((prev) => ({
      ...prev!,
      [name]: value || "",
    }));
  };

  return (
    <div className="flex">
      <div className="p-4 mt-4 border rounded bg-gray-50 text-black">
        <h3 className="font-bold mb-2">Add New Order</h3>
        <form
          onSubmit={async (evt) => {
            evt.preventDefault();
            setLoading(true);
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
          }}
        >
          <div className="mb-2">
            <label className="block font-semibold">Account Name:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_name"
              value={orderData?.account_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Account Email:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_email"
              value={orderData?.account_email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Account Phone:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_phone"
              value={orderData?.account_phone || ""}
              onChange={handleChange}
            />
          </div>
          {/* Add other relevant order fields here */}
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
