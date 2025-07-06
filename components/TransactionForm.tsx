"use client";

import { useState } from "react";

export default function TransactionForm({
  onTransactionAdded,
}: {
  onTransactionAdded: () => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !date) return;

    await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify({ description, amount, date }),
    });

    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);

    onTransactionAdded(); // ✅ trigger chart/list refresh
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-green-600 text-white p-2 px-4 rounded hover:bg-green-700"
      >
        Add Transaction
      </button>
    </form>
  );
}
