"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

interface ChartData {
  name: string;
  value: number;
}

const COLORS_LIGHT = ["#2563eb", "#60a5fa", "#3b82f6", "#1d4ed8"];
const COLORS_DARK = ["#10b981", "#34d399", "#059669", "#064e3b"];

export default function MockExamChart({ summaryData }: { summaryData: ChartData[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const data1: ChartData[] = summaryData;

  return (<>
  
        <h3
          className={`text-lg font-semibold mb-2 ${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Activities on Mock Exam
        </h3>
    <div
      className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 transition-colors duration-500 ${
        isDark ? "text-gray-100" : "text-gray-900"
      }`}
    >
      {/* Chart Section */}
      <div className="flex-shrink-0">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data1}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data1.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#111827" : "#f9fafb",
                border: "1px solid",
                borderColor: isDark ? "#374151" : "#d1d5db",
                color: isDark ? "#f3f4f6" : "#111827",
              }}
              itemStyle={{
                color: isDark ? "#f3f4f6" : "#111827",
              }}
              labelStyle={{
                color: isDark ? "#e5e7eb" : "#111827",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Labels Section */}
      <div className="space-y-2">
        {data1.map((entry, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            ></span>
            <span className={isDark ? "text-gray-200" : "text-gray-800"}>
              {entry.name}: <strong>{entry.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div></>
  );
}
