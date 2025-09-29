"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";

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
  const pageSize = 10;
  const totalPages = Math.ceil(students.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentStudents = students.slice(startIndex, endIndex);

  const goFirst = () => setCurrentPage(1);
  const goLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (<section>
  <div className="flex w-full">
{/* Left: takes the rest */}
<div className="flex-1 pr-5 text-2xl font-semibold my-2">
LeaderBoard
</div>
</div>
<div className="bg-white p-4 rounded-lg shadow-md w-full">
	 


      <div className="overflow-x-auto">
        <table className="border border-gray-200 w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">S/N</th>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">Student</th>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">Gender</th>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">Email Address</th>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">XP</th>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">Quizzes</th>
              <th className="py-2 px-4 g-gray text-left text-sm border-b border-b-gray-200">Lessons</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Pagination */}
    </div></section>
  );
}
