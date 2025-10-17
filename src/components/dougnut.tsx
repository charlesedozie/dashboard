"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Data, ApiResponse, RowsResponse2, RowsResponse1, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";

// Define a type for chart data
interface ChartData {
  name?: string;
  value?: number;
}

const COLORS = ["#000000", "#92BFFF", "#94E9B8", "#AEC7ED"];

// Custom Legend on the right with % values (no brackets, extra spacing)
const CustomLegend = ({ data }: { data: ChartData[] }) => {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  return (
    <ul className="flex flex-col gap-3 text-sm w-40">
      {data?.map((entry, index) => (
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
            {(((entry.value || 0) / total) * 100).toFixed(0)}%
          </span>
        </li>
      ))}
    </ul>
  );
};

export default function DoughnutChart() {	
const [jamb, setJAMB] = useState<number>(0);
const [waec, setWAEC] = useState<number>(0);
const [neco, setNECO] = useState<number>(0);
const [others, setOTHERS] = useState<number>(0);
const [mock, setMock] = useState<Data[]>([]);
const [mockTypes, setMockTypes] = useState<Data[]>([]);
const [summaryData, setSummaryData] = useState<ChartData[]>([]);

const { data, isLoading, isFetching } = useQuery<ApiResponse<RowsResponse>>({
queryKey: ["MockExams"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>("mock-exams", {});
console.log('raw mock', response)
if (!response) {
throw new Error("No data returned from user/all endpoint");
}
return response;
},
staleTime: 15 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

const { data: dataMockTypes, isLoading: loadingMockTypes, isFetching: fetchingMockTypes } = useQuery<ApiResponse<RowsResponse>>({
queryKey: ["MockTypes"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>("mock-types", {});
console.log('raw type', response)
if (!response) {
throw new Error("No data returned from user/all endpoint");
}
return response;
},
staleTime: 60 * 60 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

//const totalUsers = studentList?.filter( (student) => student.role?.toLowerCase() === "user" ).length || 0;

useEffect(() => {
if (dataMockTypes?.data?.rows?.length) {
const sorted = [...dataMockTypes.data.rows]
if(mockTypes !== sorted){setMockTypes(sorted);}
} 
}, [dataMockTypes]);

useEffect(() => {
if (data?.data?.rows?.length) {
const sorted = [...data.data.rows]
if(mock !== sorted){setMock(sorted);}
} 
}, [data]);


useEffect(() => {
if (mock.length > 0 && mockTypes.length > 0) {
const result = mockTypes.map((type) => {
const count = mock.filter((item) => item.mockTypeId === type.id).length;

return {
name: type?.title?.toUpperCase(),
value: count,
};
});

setSummaryData(result);
}
}, [mock, mockTypes]); // ✅ update whenever either changes


console.log('mock exams', mock)
console.log('mock types', mockTypes)
console.log('summaryData', summaryData)
const data1: ChartData[] = summaryData;
  return (
    <>
      <h3 className="text-xl font-semibold mb-4 text-start">
        Activities on Mock Exam
      </h3>
      <div className="flex items-center gap-3">
        {/* Smaller chart on the left */}
        <PieChart width={220} height={220}>
          <Pie
            data={data1}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data1?.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Larger legend area on the right */}
        <CustomLegend data={data1} />
      </div>
    </>
  );
}
