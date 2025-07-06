"use client";

import { useState } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpenseChart from "@/components/ExpenseChart";

export default function Home() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev); // ✅ toggle to re-render

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center text-green-800">
        💸 Personal Finance Visualiser
      </h1>

      <TransactionForm onTransactionAdded={triggerRefresh} />
      <TransactionList refresh={refresh} onTransactionDeleted={triggerRefresh} />
      <ExpenseChart refresh={refresh} />
    </main>
  );
}
