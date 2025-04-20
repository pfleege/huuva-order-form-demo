"use client";

import { useState } from "react";
import { OrderFormProps } from "@/app/lib/definitions";

const Searchbar = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] =
    useState<OrderFormProps["orderData"]>();

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
    <div className="bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[url('/modalBg.jpg')] bg-contain text-black p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        <div className="flex justify-center">
          <form className="flex gap-2 text-2xl" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Search by email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              className="w-full p-2 border-[1px] border-white rounded text-white"
              required
            />
            <button
              type="submit"
              className="px-4 pb-1 bg-blue-500 text-white rounded-xl disabled:bg-gray-400 hover:cursor-pointer"
              disabled={loading}
            >
              {loading ? "Searching..." : "Submit"}
            </button>
          </form>
        </div>
        {searchResult && (
          <div className="flex flex-col mt-6 p-6 bg-neutral-600/50 text-white items-start w-full rounded-xl">
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
            <div className="flex flex-col border-2 border-gray-300 rounded-lg p-4 my-4 w-full">
              {searchResult.order_items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-4">
                  <h3 className="pl-4 text-lg font-bold">
                    Dish: {item.brand_name} - {item.item_name}, ({item.item_qty}{" "}
                    ordered)
                    <p className="text-sm pl-2 pb-1 text-start">
                      Dish status: {item.order_status}
                    </p>
                  </h3>
                </div>
              ))}
            </div>
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
