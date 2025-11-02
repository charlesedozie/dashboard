"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import {getUserField} from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";
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

export default function LeaderBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(students.length / pageSize);
const userRole = getUserField<string>("role");
const { theme } = useTheme();
const isDark = theme === "dark";

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

  return (<section>
  <div className="flex w-full mt-2 mb-7">
{/* Left: takes the rest */}
<div className="flex-1 pr-5 text-2xl font-semibold mb-2">
LeaderBoard
</div>
</div>

<div className={`p-4 rounded-lg shadow-md w-full transition-colors ${
isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead className={`sticky top-0 z-10 ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-[#535862]"}`}>
            <tr>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">S/N</th>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">Student</th>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">Gender</th>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">Email Address</th>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">XP</th>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">Quizzes</th>
              <th className="py-2 px-4 text-left text-sm border-b border-b-gray-200">Lessons</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id} className={`sticky top-0 z-10 ${isDark ? "hover:bg-gray-500" : "hover:bg-gray-100"} transition-colors`}>
                <td className="py-3 px-4 border-b border-b-gray-200">{student.id}</td>
                <td className="py-3 px-4 border-b border-b-gray-200 flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{student.name}</span>
                </td>
                <td className="py-3 px-4 border-b border-b-gray-200">{student.gender}</td>
                <td className="py-3 px-4 border-b border-b-gray-200">{student.lessons}</td>
                <td className="py-3 px-4 border-b border-b-gray-200">{student.quizzes}</td>
                <td className="py-3 px-4 border-b border-b-gray-200">{student.mockExams}</td>
                <td className="py-3 px-4 border-b border-b-gray-200">{student.totalRewards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`${isDark ? null : "bg-white text-gray-600"} flex justify-between items-center mt-12 text-sm`}>
        {/* Bottom left: showing 1-10 of total */}
        <div>
          {startIndex + 1}-{Math.min(endIndex, students.length)} of {students.length}
        </div>

        {/* Bottom right: page navigation */}
        <div className="flex items-center gap-2">
          <button onClick={goFirst} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-50">
            <ChevronsLeft size={22} className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`} />
          </button>
          <button onClick={goPrev} disabled={currentPage === 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-50">
            <ChevronLeft size={22} className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`} />
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button onClick={goNext} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 disabled:opacity-50">
            <ChevronRight size={22} className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`} />
          </button>
          <button onClick={goLast} disabled={currentPage === totalPages} className="p-1 rounded hover:bg-gray-200 disabled:opacity-50">
            <ChevronsRight size={22} className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`} />
          </button>
        </div>
      </div>
    </div></section>
  );
}
