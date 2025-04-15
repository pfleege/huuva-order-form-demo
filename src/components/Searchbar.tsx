"use client";

import { useState } from "react";

const Searchbar = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState("");

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/account-search?email=${encodeURIComponent(email)}`
      );

      const userData = await response.json();

      if (userData) {
        console.log(userData);
        setSearchResult(userData.email);
      } else {
        setSearchResult("Account not found.");
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
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Search customer by email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            className="w-full p-2 mb-4 border rounded text-black"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Searching..." : "Submit"}
          </button>
        </form>
        <h1 className="text-black">{searchResult}</h1>
      </div>
    </div>
  );
};

export default Searchbar;
