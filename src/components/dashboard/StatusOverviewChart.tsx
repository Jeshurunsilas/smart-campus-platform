"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface StatusOverviewChartProps {
  data?: Array<{ name: string; value: number; color: string }>;
}

const DEFAULT_DATA = [
  { name: "In Progress", value: 2, color: "#F59E0B" },
  { name: "Under Review", value: 1, color: "#6366F1" },
  { name: "Assigned", value: 1, color: "#3B82F6" },
  { name: "Resolved / Closed", value: 3, color: "#10B981" },
];

export function StatusOverviewChart({ data = DEFAULT_DATA }: StatusOverviewChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-xs text-slate-600 font-medium">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
