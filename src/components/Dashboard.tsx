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
    <div className="flex">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-center">
          {searchResult.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">Brand</th>
                  <th className="border border-gray-200 px-4 py-2">Item</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Total Quantity
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
          ) : (
            <h3 className="font-bold mb-2">No order statistics available.</h3>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
