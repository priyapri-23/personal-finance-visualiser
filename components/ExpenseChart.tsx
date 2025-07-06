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

type DailyData = {
  day: string;
  total: number;
};

export default function ExpenseChart({ refresh }: { refresh: boolean }) {
  const [data, setData] = useState<DailyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/transactions");
      const transactions: Transaction[] = await res.json();

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const dailyTotals: Record<string, number> = {};

      transactions.forEach((t) => {
        const date = new Date(t.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          const day = date.getDate().toString();
          dailyTotals[day] = (dailyTotals[day] || 0) + t.amount;
        }
      });

      const formattedData: DailyData[] = Array.from({ length: 31 }, (_, i) => {
        const day = (i + 1).toString();
        return {
          day,
          total: dailyTotals[day] || 0,
        };
      }).filter((d) => d.total > 0); // Only show days with expenses

      setData(formattedData);
    };

    fetchData();
  }, [refresh]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">
        📊 Daily Expense Overview (This Month)
      </h2>
      <div className="w-full h-72 bg-white rounded shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 60000]} />
            <Tooltip
              formatter={(value: number) => `₹${value}`}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Bar dataKey="total" fill="#86efac" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
