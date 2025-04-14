"use client";

import { useState } from "react";

const Searchbar = () => {
  const [customer, setCustomer] = useState("");

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    // Insert logic for db connection and send data (customer name)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search customer"
            value={customer}
            onChange={(evt) => setCustomer(evt.target.value)}
            className="w-full p-2 mb-4 border rounded text-black"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Searchbar;
