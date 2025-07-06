"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Transaction = {
  _id: string;
  description: string;
  amount: number;
  date: string;
};

type ChartData = {
  month: string;
  total: number;
};

export default function ExpenseChart({ refresh }: { refresh: boolean }) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const transactions: Transaction[] = await res.json();

      const monthlyTotals: Record<string, number> = {};

      transactions.forEach((t) => {
        const date = new Date(t.date);
        const month = `${date.toLocaleString("default", {
          month: "short",
        })}-${date.getFullYear()}`;
        monthlyTotals[month] = (monthlyTotals[month] || 0) + t.amount;
      });

      const formattedData: ChartData[] = Object.entries(monthlyTotals).map(
        ([month, total]) => ({
          month,
          total,
        })
      );

      setData(formattedData);
    };

    fetchData();
  }, [refresh]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">
        📊 Monthly Expense Overview
      </h2>
      <div className="w-full h-72 bg-white rounded shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#86efac" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
