"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import DataExporter, { TableHeader } from "@/components/dataExporter";
import { getUserField } from "@/utils/curUser";
import { AccessDenied } from "@/components/utils";
import { useTheme } from "next-themes";
import { useParams, useSearchParams } from 'next/navigation';
import {SearchPage} from "@/components/utils";

type Student = {
id: number;
name: string;
avatar: string;
gender: "Male" | "Female";
lessons: number;
quizzes: number;
mockExams: number;
totalRewards: number;
rewardRequest: number;
};

// Generate sample data
const students: Student[] = Array.from({ length: 40 }, (_, i) => ({
id: i + 1,
name: `John Doe ${i + 1}`,
avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
gender: i % 2 === 0 ? "Male" : "Female",
lessons: Math.floor(Math.random() * 20),
quizzes: Math.floor(Math.random() * 10),
mockExams: Math.floor(Math.random() * 5),
totalRewards: Math.floor(Math.random() * 1000),
rewardRequest: Math.floor(Math.random() * 500),
}));

export default function StudentTable() {
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;
const totalPages = Math.ceil(students.length / pageSize);
const userRole = getUserField<string>("role");
const { theme } = useTheme();
const isDark = theme === "dark";
const params = useParams();
const searchParams = useSearchParams();

const [data] = useState(students);
const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const q = searchParams.get("q") ?? "defaultTerm";

const headers: TableHeader[] = [
{ label: "SN", key: "id" },
{ label: "Student", key: "name" },
{ label: "Gender", key: "gender" },
{ label: "Lessons", key: "lessons" },
{ label: "Quizzes", key: "quizzes" },
{ label: "Mock Exams", key: "mockExams" },
{ label: "Rewards", key: "totalRewards" },
{ label: "Requests", key: "rewardRequest" },
];

const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const currentStudents = students.slice(startIndex, endIndex);

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
const canView =
!!userRole && ["admin", "super_admin"].includes(userRole.toLowerCase());

if (!canView) {
return <AccessDenied />;
}

let content = (
<section>{(action === 'search' && mod === 'search' && q !== "defaultTerm") ? <section>Search results: {q}</section> : null}
<div className="flex w-full mt-2 mb-7">
<div className="flex-1 pr-5 text-2xl font-semibold mb-2">
Students{" "}
<span
className="inline-block px-3 py-1 text-sm rounded-full"
style={{ backgroundColor: "#FF85114A" }}
>
1000 students
</span>
</div>
<div className="flex items-center gap-4 font-semibold">
{/* Data Exporter */}
<div className={`${isDark ? "text-white" : "text-black"}`}>
<DataExporter
data={data}
headers={headers}
fileName="user-data"
className={`mt-4 ${isDark ? "dark" : ""}`}
/>
</div>
</div>
</div>

<div
className={`p-4 rounded-lg shadow-md w-full transition-colors ${
isDark ? "bg-gray-900 text-white" : "bg-white text-black"
}`}
>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead
className={`sticky top-0 z-10 ${
isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-[#535862]"
}`}
>
<tr>
{headers.map((h) => (
<th
key={h.key}
className="py-2 px-4 text-left border-b border-gray-300"
>
{h.label}
</th>
))}
<th className="py-2 px-4 border-b border-gray-300">&nbsp;</th>
</tr>
</thead>
<tbody className="text-sm">
{currentStudents.map((student) => (
<tr
key={student.id}
className={`transition-colors ${
isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
}`}
>
<td className="py-3 px-4 border-b border-gray-200">
{student.id}
</td>
<td className="py-3 px-4 border-b border-gray-200">
<div className="flex items-center gap-3">
<img
src={student.avatar}
alt={student.name}
className="w-10 h-10 rounded-full object-cover"
/>
<span>{student.name}</span>
</div>
</td>
<td className="py-3 px-4 border-b border-gray-200">
{student.gender}
</td>
<td className="py-3 px-4 border-b border-gray-200 text-center">
{student.lessons}
</td>
<td className="py-3 px-4 border-b border-gray-200 text-center">
{student.quizzes}
</td>
<td className="py-3 px-4 border-b border-gray-200 text-center">
{student.mockExams}
</td>
<td className="py-3 px-4 border-b border-gray-200 font-bold">
{student.totalRewards} XP
</td>
<td className="py-3 px-4 border-b border-gray-200 font-bold">
{student.rewardRequest} XP
</td>
<td className="py-3 px-4 border-b border-gray-200">
<div className="flex gap-2">
<span className="bg-green-500 w-6 h-6 flex items-center justify-center rounded-lg font-bold">
✓
</span>
<span className="bg-red-500 w-6 h-6 flex items-center justify-center rounded-lg font-bold">
✕
</span>
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>

{/* Pagination */}
<div
className={`flex justify-between items-center mb-6 mt-12 text-sm ${
isDark ? "text-gray-400" : "text-gray-600"
}`}
>
<div>
{startIndex + 1}-{Math.min(endIndex, students.length)} of{" "}
{students.length}
</div>
<div className="flex items-center gap-2">
<button
onClick={goFirst}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsLeft size={22} />
</button>
<button
onClick={goPrev}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronLeft size={22} />
</button>
<span>
Page {currentPage} of {totalPages}
</span>
<button
onClick={goNext}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronRight size={22} />
</button>
<button
onClick={goLast}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsRight size={22} />
</button>
</div>
</div>
</div>
</section>
);

return ( content  );

}
