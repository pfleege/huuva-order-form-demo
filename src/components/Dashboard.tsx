"use client";

import { useEffect, useState } from "react";
import {
  DashboardData,
  StatusTime,
  TroughputTime,
} from "@/app/lib/definitions";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [popularItems, setPopularItems] = useState<DashboardData[]>([]);
  const [averageTimes, setAverageTimes] = useState<StatusTime[]>([]);
  const [throughputTimes, setThroughputTimes] = useState<TroughputTime[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/dashboard-data`);
        const data = await response.json();

        if (data) {
          setPopularItems(data.itemSales || []);
          setAverageTimes(data.statusTimes || []);
          setThroughputTimes(data.troughPut || []);
        } else {
          setPopularItems([]);
          setAverageTimes([]);
          setThroughputTimes([]);
        }
      } catch (error) {
        console.error("Fetching data failed:", error);
        setPopularItems([]);
        setAverageTimes([]);
        setThroughputTimes([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex justify-center my-20">
      <div className="bg-[url('/modalBg.jpg')] bg-contain text-black p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        <div className="flex flex-col p-6">
          <h3 className="font-bold text-white mb-2">Order Statistics</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : popularItems.length > 0 ? (
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
                {popularItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {item.brand_name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.item_name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.total_qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No order statistics available.</div>
          )}
        </div>

        {/* AVERAGE TIMES SPENT ON ORDER STATES */}
        <div className="flex flex-col p-6">
          <h3 className="font-bold text-white mb-2">Average Times Spent</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : averageTimes.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-200 text-lg bg-gray-100/50">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">Status</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Average Time (min/sec)
                  </th>
                </tr>
              </thead>
              <tbody>
                {averageTimes.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {item.current_status_text}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.minutes}m {item.seconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No average times available.</div>
          )}
        </div>

        {/* NUMBER OF ORDERS SERVED DURING OFFICE HOURS (7:00 - 22:00) */}
        <div className="flex flex-col p-6">
          <h3 className="font-bold text-white mb-2">Order Throughput</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : throughputTimes.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-200 text-lg bg-gray-100/50">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">Status</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Average Time (min/sec)
                  </th>
                </tr>
              </thead>
              <tbody>
                {throughputTimes.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {item.order_date}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {item.throughput}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No average times available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
