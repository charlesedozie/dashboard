"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PeriodChart() {
  const [period, setPeriod] = useState("2025");

  const periods = [
    { value: "2025", label: "Jan 2025 - Dec 2025" },
  ];

  // Static dataset for each year
  const yearlyData: Record<string, { month: string; value: number }[]> = {
    "2020": [
      { month: "Jan", value: 30 },
      { month: "Feb", value: 45 },
      { month: "Mar", value: 50 },
      { month: "Apr", value: 35 },
      { month: "May", value: 60 },
      { month: "Jun", value: 40 },
      { month: "Jul", value: 70 },
      { month: "Aug", value: 55 },
      { month: "Sep", value: 65 },
      { month: "Oct", value: 50 },
      { month: "Nov", value: 45 },
      { month: "Dec", value: 75 },
    ],
    "2021": [
      { month: "Jan", value: 40 },
      { month: "Feb", value: 35 },
      { month: "Mar", value: 60 },
      { month: "Apr", value: 45 },
      { month: "May", value: 70 },
      { month: "Jun", value: 55 },
      { month: "Jul", value: 80 },
      { month: "Aug", value: 65 },
      { month: "Sep", value: 60 },
      { month: "Oct", value: 70 },
      { month: "Nov", value: 50 },
      { month: "Dec", value: 85 },
    ],
    "2022": [
      { month: "Jan", value: 50 },
      { month: "Feb", value: 60 },
      { month: "Mar", value: 55 },
      { month: "Apr", value: 70 },
      { month: "May", value: 75 },
      { month: "Jun", value: 65 },
      { month: "Jul", value: 90 },
      { month: "Aug", value: 80 },
      { month: "Sep", value: 70 },
      { month: "Oct", value: 85 },
      { month: "Nov", value: 60 },
      { month: "Dec", value: 95 },
    ],
    "2023": [
      { month: "Jan", value: 55 },
      { month: "Feb", value: 65 },
      { month: "Mar", value: 75 },
      { month: "Apr", value: 60 },
      { month: "May", value: 85 },
      { month: "Jun", value: 70 },
      { month: "Jul", value: 95 },
      { month: "Aug", value: 85 },
      { month: "Sep", value: 80 },
      { month: "Oct", value: 90 },
      { month: "Nov", value: 75 },
      { month: "Dec", value: 100 },
    ],
    "2024": [
      { month: "Jan", value: 60 },
      { month: "Feb", value: 70 },
      { month: "Mar", value: 80 },
      { month: "Apr", value: 75 },
      { month: "May", value: 95 },
      { month: "Jun", value: 85 },
      { month: "Jul", value: 100 },
      { month: "Aug", value: 95 },
      { month: "Sep", value: 90 },
      { month: "Oct", value: 105 },
      { month: "Nov", value: 85 },
      { month: "Dec", value: 110 },
    ],
    "2025": [
      { month: "Jan", value: 70 },
      { month: "Feb", value: 80 },
      { month: "Mar", value: 85 },
      { month: "Apr", value: 95 },
      { month: "May", value: 100 },
      { month: "Jun", value: 90 },
      { month: "Jul", value: 110 },
      { month: "Aug", value: 105 },
      { month: "Sep", value: 95 },
      { month: "Oct", value: 115 },
      { month: "Nov", value: 100 },
      { month: "Dec", value: 120 },
    ],
  };

  const data = yearlyData[period];

  return (<>
  
<div>
{/* Left: takes the rest */}
<div className="g-gray text-sm">
Graphical data of number of students
</div>

{/* Right: only as wide as content */}
<div className="g-gray text-lg mt-3 mb-4">
 {/* Selector */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-2 shadow-sm w-fit">
        <Calendar className="w-5 h-5" />
        <span>Period:</span>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1 focus:outline-none"
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
</div>
</div>
	</>
  );
}
