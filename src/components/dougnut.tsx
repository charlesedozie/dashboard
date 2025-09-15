"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

// Define a type for chart data
interface ChartData {
  name: string;
  value: number;
}

const COLORS = ["#000000", "#92BFFF", "#94E9B8", "#AEC7ED"];

// Custom Legend on the right with % values (no brackets, extra spacing)
const CustomLegend = ({ data }: { data: ChartData[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <ul className="flex flex-col gap-3 text-sm w-40">
      {data.map((entry, index) => (
        <li
          key={`legend-${index}`}
          className="flex items-center gap-2 justify-between"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-700 font-medium text-left">
              {entry.name}
            </span>
          </div>
          <span className="text-gray-700 font-medium text-right">
            {((entry.value / total) * 100).toFixed(0)}%
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function DoughnutChart() {	
const [jamb, setJAMB] = useState<number>(1);
const [waec, setWAEC] = useState<number>(0);
const [neco, setNECO] = useState<number>(0);
const [others, setOTHERS] = useState<number>(0);

const data: ChartData[] = [
  { name: "JAMB", value: jamb },
  { name: "WAEC", value: waec },
  { name: "NECO", value: neco },
  { name: "Others", value: others },
];
  return (
    <>
      <h3 className="text-xl font-semibold mb-4 text-start">
        Activities on Mock Exam
      </h3>
      <div className="flex items-center gap-3">
        {/* Smaller chart on the left */}
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Larger legend area on the right */}
        <CustomLegend data={data} />
      </div>
    </>
  );
}
