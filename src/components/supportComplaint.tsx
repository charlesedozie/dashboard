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

  return (
    <section>
      <div className="flex w-full mt-10 mb-7">
        <div className="flex-1 pr-5 text-2xl font-semibold my-2">
          Students{" "}
          <span
            className="inline-block px-3 py-1 text-sm rounded-full"
            style={{ backgroundColor: "#FF85114A" }}
          >
            1000 students
          </span>
        </div>
        <div className="flex items-center gap-4 font-semibold">
          <button className="def-bg pointer text-white px-8 py-2 rounded-lg">
            Export Data
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md w-full">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  S/N
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Student
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Gender
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Lessons
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Quizzes
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Mock Exams
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Total Rewards
                </th>
                <th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
                  Reward Request
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200 align-middle">
                    {student.id}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle">
                    {student.gender}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle">
                    {student.lessons}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle">
                    {student.quizzes}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle">
                    {student.mockExams}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle font-bold">
                    {student.totalRewards} XP
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 align-middle font-bold">
                    <div className="flex items-center gap-2">
                      <span>{student.rewardRequest} XP</span>
                      <span className="bg-green-500 px-2 rounded-lg font-bold">
                        ✓
                      </span>
                      <span className="bg-red-500 px-2 rounded-lg font-bold">
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
        <div className="flex justify-between items-center my-10 text-sm text-gray-600">
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
              <ChevronsLeft size={22} className="text-gray-600" />
            </button>
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft size={22} className="text-gray-600" />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight size={22} className="text-gray-600" />
            </button>
            <button
              onClick={goLast}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronsRight size={22} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}