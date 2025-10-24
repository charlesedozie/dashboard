"use client";

import { useState, useEffect } from "react";
import { Data, ApiResponse, RowsResponse2, RowsResponse1, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTheme } from "next-themes";


type Student = {
sn: number;
name: string;
email: string;
status: "Active" | "Inactive";
avatar: string;
};

export default function StudentTable() {
const [studentList, setStudentList] = useState<Data[]>([]);
const { theme } = useTheme();
const isDark = theme === "dark";
const { data, isLoading, isFetching } = useQuery<ApiResponse<RowsResponse1>>({
queryKey: ["StudentNames"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse1>>("user/all", {});
if (!response) {
throw new Error("No data returned from user/all endpoint");
}
return response;
},
// staleTime: 1000 * 60, // 1 min - keeps cached data fresh for 1 min
staleTime: 60 * 10 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

const totalUsers = studentList?.filter((student) => student.role?.toLowerCase() === "user").length || 0;

useEffect(() => {
if (data?.data?.length) {
const sorted = [...data.data].sort((a, b) =>
(a.fullName || "").localeCompare(b.fullName || "", undefined, { sensitivity: "base" })
);
if(studentList !== sorted){setStudentList(sorted);}
} 
}, [data]);

return (<>
<div className="flex items-center justify-between mb-3">
<div className="text-left">
<p>Students <span className="inline-block px-3 py-1 text-sm rounded-full" style={{ backgroundColor:"#FF85114A" }}>{totalUsers} students</span></p>
</div>
<div className="text-right font-semibold">
<p><Link
href="/user-area/students" 
aria-label={`Go to Students Page`}
title={`Go to Students Page`}
className="def-link-style px-4 py-1 hover:bg-gray-100 transition"
>View all</Link></p>
</div>
</div>

{/* Right: only as wide as content */}
<div className="flex items-center gap-4 font-semibold"></div>

<div className="border border-gray-200 rounded-lg overflow-hidden w-full border-collapse">
<div className="overflow-y-auto max-h-[300px]">
<table className="w-full border-separate border-spacing-0">
<thead className={`sticky top-0 z-10 ${isDark ? "bg-black text-white" : "bg-gray-50 text-[#535862]"}`}>
<tr>
<th className="py-2 px-4 border-gray-300 text-left text-sm border-b">S/N</th>
<th className="py-2 px-4 border-gray-300 text-left text-sm border-b">Name</th>
<th className="py-2 px-4 border-gray-300 text-left text-sm border-b">Email</th>
<th className="py-2 px-4 border-gray-300 text-left text-sm border-b">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{studentList
  ?.filter((student) => student.role === "USER") // ✅ only include users with role "USER"
  .map((student, index) => (
<tr key={student.id} className={`sticky top-0 z-10 ${isDark ? "hover:bg-gray-500" : "hover:bg-gray-100"} transition-colors`}>
{/* SN */}
<td className="py-2 px-4 text-left align-middle text-sm border-b border-gray-200">
{index+1}
</td>

{/* Avatar + name: use min-w-0 so truncate works */}
<td className="py-2 px-4 text-left align-middle border-b border-gray-200 min-w-0">
<div className="flex items-center gap-3">
<img
src={student.avatar}
alt={student.fullName}
className="w-10 h-10 rounded-full object-cover flex-shrink-0"
/>
<span className="truncate text-sm">{student.fullName}</span>
</div>
</td>

{/* Email */}
<td className="py-2 px-4 text-left align-middle text-sm border-b border-gray-200">
{student.email}
</td>

{/* Status pill with small fixed dot (no padding inside the dot) */}
<td className="py-2 px-4 text-left align-middle text-sm border-b border-gray-200">
<span
className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
  student.status?.toLowerCase() === "active"
    ? "bg-green-200 text-green-900"
    : student.status?.toLowerCase() === "inactive"
    ? "bg-gray-200 text-gray-700"
    : "bg-yellow-500"
}`}

>
{/* small dot — use fixed w/h and margin, no internal padding */}
<span
className={`inline-block w-2 h-2 rounded-full capitalize mr-2 ${
student.status?.toLowerCase() === "active"
? "bg-green-500"
: student.status?.toLowerCase() === "inactive"
? "bg-gray-500"
: "bg-yellow-300"
}`}
/>{(student.status ?? "")
  .charAt(0)
  .toUpperCase() + (student.status ?? "")
  .slice(1)
  .toLowerCase()}
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</>
);
}
