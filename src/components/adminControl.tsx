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
            <thead className="bg-gray-50 font-normal sticky top-0 z-10 text-gray-500">
              <tr>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  S/N
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Tutor
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Subject
                </th>
                <th className="py-2 text-left text-sm border-b border-gray-200">
                  Topic
                </th>
                <th className="py-2 text-center text-sm border-b border-gray-200">
                  Review
                </th>
                <th className="py-2 text-center text-sm border-b border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                <td className="py-2 border-b border-gray-200 align-middle">
                    {student.id}
                  </td>
				   <td className="py-2 border-b border-gray-200 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{student.name}</span>
                    </div>
                  </td>
				   <td className="py-2 border-b border-gray-200 align-middle">
                    {student.gender}
                  </td>
                  <td className="py-2 border-b border-gray-200 align-middle">
                    {student.lessons}
                  </td>
				   <td className="text-center py-2 border-b border-gray-200 align-middle">
                  <button className="bg-transparent border-0 border-b border-gray-400 text-gray-700 px-4 py-2 hover:border-gray-600 pointer focus:outline-none">
 View Course
</button>
</td>

<td className="text-center py-2 border-b border-gray-200">
<div className="flex justify-center space-x-4">
    <button className="bg-[#14265C] text-white py-2 hover:bg-blue-800 pointer px-5 rounded-xl">
      Approve
    </button>
    <button className="bg-transparent border-0 font-medium pointer text-red-700 px-4 py-2 hover:border-gray-600 focus:outline-none">
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
       
      </div>
    </section>
  );
}