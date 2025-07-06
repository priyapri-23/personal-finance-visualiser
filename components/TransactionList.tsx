import { useState, useEffect } from "react";

export default function TransactionList({ refresh, onTransactionDeleted }: { refresh: boolean, onTransactionDeleted: () => void }) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data.reverse()));
  }, [refresh]);

  const deleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });

    onTransactionDeleted(); // ✅ triggers chart + list update
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🧾 Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((txn) => (
          <li
            key={txn._id}
            className="flex justify-between items-center p-3 bg-white border rounded shadow-sm"
          >
            <div>
              <p className="font-medium">{txn.description}</p>
              <p className="text-sm text-black-500">{txn.date}</p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-black-700 font-semibold">₹{txn.amount}</span>
              <button
                onClick={() => deleteTransaction(txn._id)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
