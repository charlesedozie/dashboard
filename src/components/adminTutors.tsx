"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Trash } from "lucide-react";

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
const students: Student[] = Array.from({ length: 0 }, (_, i) => ({
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
  const pageSize = 0;
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
      <div className="bg-white w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-gray-500">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  S/N
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Tutor
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Email
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Sex
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Status
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Subjects
                </th>
                <th className="py-2 text-center text-sm border-b border-gray-200">
                  Remove
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Pagination */}
       
      </div>
    </section>
  );
}