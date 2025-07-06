"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

type Transaction = {
  _id: string;
  description: string;
  amount: number | string;
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
        const amount = typeof t.amount === "string" ? parseFloat(t.amount) : t.amount;
        monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
      });

      const formattedData: ChartData[] = Object.entries(monthlyTotals).map(
        ([month, total]) => ({ month, total })
      );

      setData(formattedData);
    };

    fetchData();
  }, [refresh]);

  // Custom label renderer
  const renderLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text x={x} y={y - 5} fill="#333" fontSize={12} textAnchor="middle">
        ₹{value.toLocaleString("en-IN")}
      </text>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-green-800 mb-2">
        📊 Monthly Expense Overview
      </h2>
      <div className="w-full h-72 bg-white rounded shadow p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 60000]} tickFormatter={(val) => `₹${val}`} />
            <Bar dataKey="total" fill="#86efac">
              <LabelList content={renderLabel} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
