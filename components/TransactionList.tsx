"use client";

import { useEffect, useState } from "react";

type Transaction = {
  _id: string;
  description: string;
  amount: number;
  date: string;
};

export default function TransactionList({
  refresh,
  onTransactionDeleted,
}: {
  refresh: boolean;
  onTransactionDeleted: () => void;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data: Transaction[] = await res.json();
      setTransactions(data);
    };
    fetchTransactions();
  }, [refresh]);

  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions?id=${id}`, {
      method: "DELETE",
    });
    onTransactionDeleted();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">📋 Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((t) => (
          <li
            key={t._id}
            className="flex justify-between items-center border p-3 rounded bg-white shadow"
          >
            <div>
              <p className="font-medium">{t.description}</p>
              <p className="text-sm text-gray-500">
                ₹{t.amount} • {new Date(t.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => deleteTransaction(t._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
