"use client";

import { useState } from "react";

type Transaction = {
  description: string;
  amount: number;
  date: string;
};

export default function TransactionForm({ onTransactionAdded }: { onTransactionAdded: () => void }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!description) newErrors.description = "Description is required.";
    if (!amount) newErrors.amount = "Amount is required.";
    if (!date) newErrors.date = "Date is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const transaction: Transaction = {
        description,
        amount: Number(amount),
        date,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (res.ok) {
        setDescription("");
        setAmount("");
        setDate(new Date().toISOString().split("T")[0]);
        setErrors({});
        onTransactionAdded(); // trigger refresh
      } else {
        console.error("Failed to add transaction:", await res.text());
      }
    } catch (err) {
      console.error("Error during add transaction:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold text-green-800">➕ Add Transaction</h2>

      <div>
        <input
          type="text"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>

      <div>
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
      </div>

      <div>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      <button type="submit" className="bg-green-600 text-white p-2 px-4 rounded hover:bg-green-700">
        Add Transaction
      </button>
    </form>
  );
}
