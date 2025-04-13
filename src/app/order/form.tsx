"use client";
import { useState } from "react";

export default function OrderForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = () => {
    alert("Form Submitted!");
  };
  return (
    <div className="font-Raleway text-2xl text-center">
      <h2>Add New Order</h2>
      <form action={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <textarea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        ></textarea>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
