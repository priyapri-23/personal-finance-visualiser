"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

export default function ExpenseChart({ refresh }: { refresh: boolean }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((transactions) => {
        const monthlyTotals: { [key: string]: number } = {};

        transactions.forEach((txn: any) => {
          const date = new Date(txn.date);
          const month = date.toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });

          monthlyTotals[month] = (monthlyTotals[month] || 0) + parseFloat(txn.amount);
        });

        const formattedData = Object.entries(monthlyTotals).map(([month, amount]) => ({
          month,
          amount: parseFloat(amount.toFixed(2)),
        }));

        setData(formattedData);
      });
  }, [refresh]);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mt-8">
      <h2 className="text-xl font-bold mb-2 text-center text-green-800">
        📅 Monthly Expense Overview
      </h2>

      {/* ✅ Summary line display above chart */}
      <div className="text-sm text-center mb-4">
        <div className="font-medium text-gray-700 flex flex-wrap justify-center gap-4">
          {data.map((item) => (
            <div key={item.month} className="flex flex-col items-center">
              <span className="font-semibold">{item.month}</span>
              <span>₹{item.amount.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill="#86efac" /> 
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ✅ Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border shadow-sm px-3 py-2 rounded text-sm text-green-900">
        <p className="font-semibold">{label}</p>
        <p>{`₹${Number(payload[0].value).toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};
