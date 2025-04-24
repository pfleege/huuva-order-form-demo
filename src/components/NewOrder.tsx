// "use client";

// import { useState } from "react";
// import { AddOrderProps } from "@/app/lib/definitions";

// const initialOrderData = {
//   account_name: "",
//   account_email: "",
//   account_phone: "",
//   city: "",
//   street: "",
//   postal_code: "",
//   dishes: [
//     {
//       brand_id: 0,
//       order_items_id: 0,
//       brand_name: "",
//       item_name: "",
//       item_id: 0,
//       item_qty: 1,
//       order_item_status_id: 0,
//       order_status: "order pending",
//     },
//   ],
// };

// const NewOrder = () => {
//   const [loading, setLoading] = useState(false);
//   const [orderData, setOrderData] =
//     useState<AddOrderProps["orderData"]>(initialOrderData);

//   // Generic handler for all input fields
//   const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = evt.target;
//     setOrderData((prev) => ({
//       ...prev!,
//       [name]: value || "",
//     }));
//   };

//   // Handle changes for dish fields
//   const handleDishChange = (
//     idx: number,
//     evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = evt.target;
//     setOrderData((prev) => {
//       const newDishes = [...(prev?.dishes || [])];
//       newDishes[idx] = {
//         ...newDishes[idx],
//         [name]: name === "item_qty" ? Number(value) : value,
//       };
//       return {
//         ...prev!,
//         dishes: newDishes,
//       };
//     });
//   };
//   // Add a new empty dish order
//   const addDishOrder = () => {
//     setOrderData((prev) => ({
//       ...prev!,
//       dishes: [
//         ...(prev?.dishes || []),
//         {
//           brand_id: 0,
//           order_items_id: 0,
//           brand_name: "",
//           item_id: 0,
//           item_name: "",
//           item_qty: 1,
//           order_item_status_id: 0,
//           order_status: "order pending",
//         },
//       ],
//     }));
//   };
//   // Remove a dish order
//   const removeDishOrder = (idx: number) => {
//     setOrderData((prev) => {
//       const newDishes = [...(prev?.dishes || [])];
//       newDishes.splice(idx, 1);
//       return {
//         ...prev!,
//         dishes: newDishes,
//       };
//     });
//   };

//   return (
//     <div className="flex justify-center my-20">
//       <div className="bg-[url('/modalBg.jpg')] bg-contain text-white p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
//         <h3 className="font-bold mb-2">Add New Order</h3>
//         <form
//           onSubmit={async (evt) => {
//             evt.preventDefault();
//             setLoading(true);
//             // console.log("Submitting order data:", JSON.stringify(orderData));
//             try {
//               const response = await fetch("/api/add-order", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(orderData),
//               });
//               if (!response.ok)
//                 throw new Error("Failed to update order status");
//               alert("Order status has been updated!");
//             } catch (error) {
//               alert("There was an error updating the order status.");
//               console.error(error);
//             }
//             setLoading(false);
//             setOrderData(initialOrderData);
//           }}
//         >
//           <div className="flex mb-2 text-2xl justify-between">
//             <label className="font-semibold pr-2">Name:</label>
//             <input
//               className="border px-2 rounded"
//               name="account_name"
//               value={orderData?.account_name || ""}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="flex mb-2 text-2xl justify-between">
//             <label className="font-semibold pr-2">Email:</label>
//             <input
//               className="border px-2 py-1 rounded"
//               name="account_email"
//               value={orderData?.account_email || ""}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="flex mb-2 text-2xl justify-between">
//             <label className="font-semibold pr-2">Phone:</label>
//             <input
//               className="border px-2 py-1 rounded"
//               name="account_phone"
//               value={orderData?.account_phone || ""}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="flex flex-col mt-6 mb-3">
//             <h3 className="text-3xl py-2">Delivery Address</h3>
//             <div className="flex flex-col mb-2 text-2xl">
//               <div className="flex mb-2 text-2xl justify-between">
//                 <label className="font-semibold pr-2">City:</label>
//                 <input
//                   className="border px-2 py-1 rounded"
//                   name="city"
//                   value={orderData?.city || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="flex mb-2 text-2xl justify-between">
//                 <label className="font-semibold pr-2">Street Name:</label>
//                 <input
//                   className="border px-2 py-1 rounded"
//                   name="street"
//                   value={orderData?.street || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="flex mb-2 text-2xl justify-between">
//                 <label className="font-semibold pr-2">Postal Code:</label>
//                 <input
//                   className="border px-2 py-1 rounded"
//                   name="postal_code"
//                   value={orderData?.postal_code || ""}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col mt-6 mb-3">
//             <h3 className="text-3xl py-2">Dish Order</h3>
//             {orderData?.dishes?.map((dish, idx) => (
//               <div key={idx} className="flex flex-col mb-4 border p-2 rounded">
//                 <div className="flex mb-2 text-2xl justify-between">
//                   <label className="font-semibold pr-2">Kitchen:</label>
//                   <select
//                     name="brand_name"
//                     value={dish.brand_name}
//                     className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
//                     onChange={(e) => handleDishChange(idx, e)}
//                   >
//                     <option value=""></option>
//                     <option value="Brand_1">Brand_1</option>
//                     <option value="Brand_2">Brand_2</option>
//                     <option value="Brand_3">Brand_3</option>
//                     <option value="Brand_4">Brand_4</option>
//                   </select>
//                 </div>
//                 <div className="flex mb-2 text-2xl justify-between">
//                   <label className="font-semibold pr-2">Dish:</label>
//                   <select
//                     name="item_name"
//                     value={dish.item_name}
//                     className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
//                     onChange={(e) => handleDishChange(idx, e)}
//                   >
//                     <option value=""></option>
//                     <option value="Item_1">Item_1</option>
//                     <option value="Item_2">Item_2</option>
//                     <option value="Item_3">Item_3</option>
//                     <option value="Item_4">Item_4</option>
//                   </select>
//                 </div>
//                 <div className="flex mb-2 text-2xl justify-between">
//                   <label className="font-semibold pr-2">Quantity:</label>
//                   <select
//                     name="item_qty"
//                     value={dish.item_qty}
//                     className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
//                     onChange={(e) => handleDishChange(idx, e)}
//                   >
//                     <option value="1">1</option>
//                     <option value="2">2</option>
//                     <option value="3">3</option>
//                     <option value="4">4</option>
//                     <option value="5">5</option>
//                   </select>
//                 </div>
//                 {orderData.dishes.length > 1 && (
//                   <button
//                     type="button"
//                     className="text-red-500 text-2xl underline mt-2 hover:cursor-pointer"
//                     onClick={() => removeDishOrder(idx)}
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             ))}
//             <button
//               type="button"
//               className="bg-green-500 text-white px-4 py-1 text-2xl rounded-lg mb-10 hover:cursor-pointer"
//               onClick={addDishOrder}
//             >
//               Add dish
//             </button>
//           </div>
//           <div className="flex justify-between gap-1 text-2xl">
//             {/* ... submit/cancel buttons ... */}
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-1 rounded-lg w-[50%] hover:cursor-pointer"
//               disabled={loading}
//             >
//               {loading ? "Sending order..." : "Send order"}
//             </button>
//             <button
//               type="button"
//               className="bg-orange-300 text-white px-4 py-1 rounded-lg w-[50%] hover:cursor-pointer"
//               onClick={() => setOrderData(initialOrderData)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewOrder;

"use client";

import { useState, useEffect } from "react";
import { AddOrderProps } from "@/app/lib/definitions";
import { OrderFormProps } from "@/app/lib/definitions";

const initialOrderData = {
  account_name: "",
  account_email: "",
  account_phone: "",
  city: "",
  street: "",
  postal_code: "",
  dishes: [
    {
      brand_id: 0,
      order_items_id: 0,
      brand_name: "",
      item_name: "",
      item_id: 0,
      item_qty: 1,
      order_item_status_id: 0,
      order_status: "order pending",
    },
  ],
};

const NewOrder = ({ orderData }: OrderFormProps) => {
  const [loading, setLoading] = useState(false);
  // const [orderData, setOrderData] =
  //   useState<AddOrderProps["orderData"]>(initialOrderData);
  const [orderInfo, setOrderData] =
    useState<AddOrderProps["orderData"]>(initialOrderData);

  //
  useEffect(() => {
    if (orderData) {
      // Pre-fill the form with orderData
      setOrderData({
        account_name: orderData.account_name || "",
        account_email: orderData.account_email || "",
        account_phone: orderData.account_phone || "",
        city: orderData.city || "",
        street: orderData.street || "",
        postal_code: orderData.postal_code || "",
        dishes:
          orderData.order_items.map((item) => ({
            brand_id: item.brand_id,
            order_items_id: item.order_items_id,
            brand_name: item.brand_name,
            item_name: item.item_name,
            item_id: item.item_id,
            item_qty: item.item_qty,
            order_item_status_id: item.order_item_status_id,
            order_status: item.order_status,
          })) ?? [],
        // })) as AddOrderProps["orderData"]["dishes"] || [],
      });
    } else {
      // Use initialOrderData for a new order
      setOrderData(initialOrderData);
    }
  }, [orderData]);
  //

  // Generic handler for all input fields
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setOrderData((prev) => ({
      ...prev!,
      [name]: value || "",
    }));
  };

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
          brand_id: 0,
          order_items_id: 0,
          brand_name: "",
          item_id: 0,
          item_name: "",
          item_qty: 1,
          order_item_status_id: 1,
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
    <div className="flex justify-center my-20">
      <div className="bg-[url('/modalBg.jpg')] bg-contain text-white p-6 rounded-2xl border-4 border-stone-700 shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        {orderInfo?.dishes[0]?.order_items_id === 0 ? (
          <h3 className="font-bold mb-2">Add New Order</h3>
        ) : (
          <h3 className="font-bold mb-2">Edit Order</h3>
        )}
        {/* <h3 className="font-bold mb-2">Add New Order</h3> */}
        <form
          onSubmit={async (evt) => {
            evt.preventDefault();
            setLoading(true);
            // console.log("Submitting order data:", JSON.stringify(orderData));
            // try {
            //   const response = await fetch("/api/order-details", {
            //     method: "PUT",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(orderInfo),
            //   });
            //   if (!response.ok) throw new Error("Failed to update order");
            //   alert("Order has been updated!");
            // } catch (error) {
            //   alert("There was an error updating the order.");
            //   console.error(error);
            // }
            console.log("Submitting order data:", JSON.stringify(orderInfo));
            setLoading(false);
            setOrderData(initialOrderData);
          }}
        >
          <div className="flex mb-2 text-2xl justify-between">
            <label className="font-semibold pr-2">Name:</label>
            <input
              className="border px-2 rounded"
              name="account_name"
              value={orderInfo?.account_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex mb-2 text-2xl justify-between">
            <label className="font-semibold pr-2">Email:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_email"
              value={orderInfo?.account_email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex mb-2 text-2xl justify-between">
            <label className="font-semibold pr-2">Phone:</label>
            <input
              className="border px-2 py-1 rounded"
              name="account_phone"
              value={orderInfo?.account_phone || ""}
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
                  value={orderInfo?.city || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2 text-2xl justify-between">
                <label className="font-semibold pr-2">Street Name:</label>
                <input
                  className="border px-2 py-1 rounded"
                  name="street"
                  value={orderInfo?.street || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex mb-2 text-2xl justify-between">
                <label className="font-semibold pr-2">Postal Code:</label>
                <input
                  className="border px-2 py-1 rounded"
                  name="postal_code"
                  value={orderInfo?.postal_code || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-6 mb-3">
            <h3 className="text-3xl py-2">Dish Order</h3>
            {orderInfo?.dishes?.map((dish, idx) => (
              <div key={idx} className="flex flex-col mb-4 border p-2 rounded">
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Kitchen:</label>
                  <select
                    name="brand_id"
                    value={dish.brand_id}
                    className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value=""></option>
                    <option value="1">Brand_1</option>
                    <option value="2">Brand_2</option>
                    <option value="3">Brand_3</option>
                    <option value="4">Brand_4</option>
                  </select>
                </div>
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Dish:</label>
                  <select
                    name="item_id"
                    value={dish.item_id}
                    className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value=""></option>
                    <option value="1">Item_1</option>
                    <option value="2">Item_2</option>
                    <option value="3">Item_3</option>
                    <option value="4">Item_4</option>
                  </select>
                </div>
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Quantity:</label>
                  <select
                    name="item_qty"
                    value={dish.item_qty}
                    className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div className="flex mb-2 text-2xl justify-between">
                  <label className="font-semibold pr-2">Order Status:</label>
                  <select
                    name="order_item_status_id"
                    value={dish.order_item_status_id}
                    className="border-[1px] w-[285px] px-2 py-1 rounded bg-amber-50 text-black"
                    onChange={(e) => handleDishChange(idx, e)}
                  >
                    <option value="1">Pending</option>
                    <option value="2">In progress</option>
                    <option value="3">Ready for delivery</option>
                    <option value="4">Delivered</option>
                  </select>
                </div>
                {orderInfo.dishes.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 text-2xl underline mt-2 hover:cursor-pointer"
                    onClick={() => removeDishOrder(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-1 text-2xl rounded-lg mb-10 hover:cursor-pointer"
              onClick={addDishOrder}
            >
              Add dish
            </button>
          </div>
          <div className="flex justify-between gap-1 text-2xl">
            {/* ... submit/cancel buttons ... */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded-lg w-[50%] hover:cursor-pointer"
              disabled={loading}
            >
              {orderInfo?.dishes[0]?.order_items_id === 0
                ? loading
                  ? "Sending order..."
                  : "Send order"
                : loading
                ? "Updating order..."
                : "Update order"}
            </button>
            <button
              type="button"
              className="bg-orange-300 text-white px-4 py-1 rounded-lg w-[50%] hover:cursor-pointer"
              onClick={() => setOrderData(initialOrderData)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;
