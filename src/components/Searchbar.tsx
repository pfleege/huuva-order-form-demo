"use client";

import { useState } from "react";

interface OrderFormProps {
  userData?: {
    account_email: string;
    account_id: number;
    account_name: string;
    account_phone: string;
    address_id: number;
    brand_id: number;
    order_channel_id: number;
    order_created: string;
    order_id: number;
    pickup_time: string;
    order_status: number;
    status_update: string;
  }; // Simplified userData type
}

const Searchbar = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] =
    useState<OrderFormProps["userData"]>();

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/account-search?account_email=${encodeURIComponent(email)}`
      );

      const userData = await response.json();

      if (userData) {
        console.log(userData);
        setSearchResult(userData);
        console.log(searchResult);
      } else {
        setSearchResult(undefined);
        console.log("Account not found.");
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-center">
          <form className="flex gap-2 text-2xl" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Search customer by email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
            <button
              type="submit"
              className="px-4 pb-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Searching..." : "Submit"}
            </button>
          </form>
        </div>
        {searchResult && (
          <div className="flex flex-col p-6 text-black items-start w-full">
            <h3 className="text-xl font-bold">
              Account Name:
              <span className="text-lg mx-2 py-1 px-3 rounded-lg">
                {searchResult.account_name}
              </span>
            </h3>
            <h3 className="text-xl font-bold">
              Order Created:
              <span className="text-lg mx-2 py-1 px-3 rounded-lg">
                {searchResult.order_created}
              </span>
            </h3>
            <h3 className="text-xl font-bold">
              Order Status:
              <span className="text-lg mx-2 py-1 px-3 rounded-lg">
                {searchResult.order_status}
              </span>
            </h3>
            <h3 className="text-xl font-bold">
              Order Status Update:
              <span className="text-lg mx-2 py-1 px-3 rounded-lg">
                {searchResult.status_update}
              </span>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
