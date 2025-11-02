"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Trash } from "lucide-react";
import { useTheme } from "next-themes";

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

// Generate 40 sample students
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
const { theme } = useTheme();
const isDark = theme === "dark";
  const pageSize = 10;
  const totalPages = Math.ceil(students.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentStudents = students.slice(startIndex, endIndex);

  const goFirst = () => setCurrentPage(1);
  const goLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section>
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-gray-500">
            <thead className={`sticky top-0 z-10 ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
              <tr>
                <th className="py-2 text-left text-sm">
                  S/N
                </th>
                <th className="py-2 text-left text-sm">
                  User
                </th>
                <th className="py-2 text-center text-sm">
                  Total XP
                </th>
                <th className="py-2 text-center text-sm">
                  Withdrawal Amount
                </th>
                <th className="py-2 text-center text-sm">
                  Info
                </th>
                <th className="py-2 text-center text-sm">
                  Payment Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id} className={`border-b p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
                <td className="py-2 align-middle">
                    {student.id}
                  </td>
				   <td className="py-2 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{student.name}</span>
                    </div>
                  </td>
				   <td className="py-2 text-center align-middle">
                    {student.lessons}
                  </td>
                  <td className="py-2 text-center align-middle">
                    {student.lessons}
                  </td>
				   <td className="text-center py-2 align-middle">
                  <button className={`bg-transparent border-0 border-b px-3 text-xs py-2 pointer 
          ${
            isDark
              ? "border-gray-600 text-white hover:bg-blue-700"
              : "border-gray-400 text-gray-700 hover:border-gray-600 focus:outline-none"
          }`}>
 View Info
</button>
</td>

<td className="text-center py-2">
<div className="flex justify-center space-x-4">
    <button className="bg-[#14265C] text-white py-1 text-xs  hover:bg-blue-800 pointer px-3 rounded-xl">
      Approve
    </button>
    <button className={`bg-transparent border-0 font-medium pointer px-4 py-1 hover:border-gray-600 focus:outline-none text-xs ${
            isDark
              ? "text-yellow-300"
              : "text-red-700"
          }`}>
      Reject
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`${isDark ? 'text-white' : "bg-white text-gray-600"} flex justify-between items-center my-10 text-sm text-gray-600`}>
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
              <ChevronsLeft size={22} className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`} />
            </button>
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={22} className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight size={22} className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`} />
            </button>
            <button
              onClick={goLast}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronsRight size={22} className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}