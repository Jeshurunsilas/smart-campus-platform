"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DEMO_MONTHLY_TRENDS } from "@/lib/demo-data";

export function TrendsBarChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={DEMO_MONTHLY_TRENDS}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs text-slate-600 font-medium capitalize">
                {value}
              </span>
            )}
          />
          <Bar dataKey="submitted" fill="#0D9488" radius={[4, 4, 0, 0]} name="Submitted" />
          <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
          <Bar dataKey="overdue" fill="#EF4444" radius={[4, 4, 0, 0]} name="Overdue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
