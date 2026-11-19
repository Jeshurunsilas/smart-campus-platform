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
import { DEMO_DEPARTMENT_SCORECARDS } from "@/lib/demo-data";

export function DepartmentPerformanceChart() {
  const chartData = DEMO_DEPARTMENT_SCORECARDS.map((d) => ({
    name: d.department_name.split(" ")[0], // e.g. "Facilities", "IT", "Electrical"
    completionRate: d.completion_rate_percentage,
    avgHours: d.avg_resolution_hours,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value, name) => [
              name === "Completion Rate (%)" ? `${value}%` : `${value} hrs`,
              name,
            ]}
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
              <span className="text-xs text-slate-600 font-medium">{value}</span>
            )}
          />
          <Bar
            dataKey="completionRate"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Completion Rate (%)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
