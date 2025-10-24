"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useTheme } from "next-themes";

type Student = {
  id: number;
  name: string;
  avatar: string;
  gender: "Male" | "Female";
  description: string;
  date: string;
  status: string;
};

export default function Complaints() {
  const statuses = ["All", "Open", "Unresolved", "Closed", "Resolved"] as const;
const { theme } = useTheme();
const isDark = theme === "dark";
  // Generate 40 sample students
  const students: Student[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `John Doe ${i + 1}`,
    description: `This is a sample support request number ${i}.`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    status: statuses[(i % 4) + 1], // skip "All"
    date: new Date(2025, 8, i).toLocaleDateString(),
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Filter students by status
  const filteredStudents =
    selectedStatus === "All"
      ? students
      : students.filter((s) => s.status === selectedStatus);

  const pageSize = 10;
  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const goFirst = () => setCurrentPage(1);
  const goLast = () => setCurrentPage(totalPages);
  const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Reset to page 1 when status changes
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  return (
    <section>
      <div className="p-4 rounded-lg shadow-md w-full">
        {/* === Status Filter === */}
        <div className="mb-4 flex text-sm justify-end items-center gap-2">
          <label htmlFor="status" className="text-gray-600 font-medium">
            Filter by Status:
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
             className={`text-sm border border-gray-300 rounded-md px-3 py-1 outline-none focus:ring-0 cursor-pointer transition-colors duration-300
        ${
          theme === "dark"
            ? "bg-gray-900 text-white border-gray-600 focus:ring-gray-500"
            : "bg-transparent text-gray-900"
        }`}
          >
            {statuses && statuses.length > 0 ? (
              statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))) : ( null )}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className={`sticky text-base top-0 z-10 text-sm ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
              <tr>
                <th className="py-2 px-4 text-left">
                  S/N
                </th>
                <th className="py-2 px-4 text-left">
                  Student
                </th>
                <th className="py-2 px-4 text-left">
                  Gender
                </th>
                <th className="py-2 px-4 text-left">
                  Description
                </th>
                <th className="py-2 px-4 text-left">
                  Status
                </th>
                <th className="py-2 px-4 text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentStudents && currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                <tr key={student.id} className={`border-b text-sm p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
                  <td className="py-3 px-4 align-middle">
                    {student.id}
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-sm">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm align-middle">
                    {student.gender}
                  </td>
                  <td className="py-3 px-4 text-sm align-middle">
                    {student.description}
                  </td>
                  <td className="py-3 px-4 text-sm align-middle">
                    <span
                      className={`block px-3 text-sm rounded-xl ${
                        student.status === "Resolved"
                          ? "font-semibold text-green-500"
                          : ""
                      } ${
                        student.status === "Closed"
                          ? "font-semibold text-gray-700"
                          : ""
                      } ${
                        student.status === "Unresolved"
                          ? "text-red-600 font-semibold"
                          : "text-amber-500 font-semibold"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm align-middle">
                    {student.date}
                  </td>
                </tr>
              ))) : ( null )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center my-16 text-sm text-gray-600">
          <div>
            {startIndex + 1}-{Math.min(endIndex, filteredStudents.length)} of{" "}
            {filteredStudents.length}
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
