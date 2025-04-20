"use client";

import { useEffect, useState } from "react";
import { DashboardProps } from "@/app/lib/definitions";

const Dashboard = () => {
  const [searchResult, setSearchResult] = useState<
    DashboardProps["dashboardData"][]
  >([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/dashboard-data`);
        const dashboardData = await response.json();
        if (dashboardData && Array.isArray(dashboardData)) {
          console.log(dashboardData);
          setSearchResult(dashboardData);
        } else {
          setSearchResult([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResult([]);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="flex justify-center my-20">
      <div className="bg-[url('/modalBg.jpg')] bg-contain text-black p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        <div className="flex justify-center">
          {searchResult.length > 0 ? (
            <div className="flex flex-col p-6">
              <h3 className="font-bold text-white mb-2">Order Statistics</h3>
              <table className="min-w-full border-collapse border border-gray-200 text-lg bg-gray-100/50">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2">Brand</th>
                    <th className="border border-gray-200 px-4 py-2">Item</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Order Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {searchResult.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        {item?.brand_name}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item?.item_name}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item?.total_qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h3 className="font-bold mb-2">No order statistics available.</h3>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
