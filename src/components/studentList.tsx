"use client";
import { Dot } from "lucide-react";
type Student = {
  sn: number;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Pending";
  avatar: string;
};

const students: Student[] = [
  { sn: 1, name: "John Doe", email: "john@example.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=1" },
  { sn: 2, name: "Jane Smith", email: "jane@example.com", status: "Pending", avatar: "https://i.pravatar.cc/150?img=2" },
  { sn: 3, name: "Alice Johnson", email: "alice@example.com", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=3" },
  { sn: 4, name: "Bob Williams", email: "bob@example.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=4" },
  { sn: 5, name: "Charlie Brown", email: "charlie@example.com", status: "Pending", avatar: "https://i.pravatar.cc/150?img=5" },
  { sn: 6, name: "Diana Prince", email: "diana@example.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=6" },
  { sn: 7, name: "Jane Smith", email: "jane@example.com", status: "Pending", avatar: "https://i.pravatar.cc/150?img=11" },
  { sn: 8, name: "Alice Johnson", email: "alice@example.com", status: "Inactive", avatar: "https://i.pravatar.cc/150?img=7" },
  { sn: 9, name: "Bob Williams", email: "bob@example.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=8" },
  { sn: 10, name: "Charlie Brown", email: "charlie@example.com", status: "Pending", avatar: "https://i.pravatar.cc/150?img=9" },
  { sn: 11, name: "Diana Prince", email: "diana@example.com", status: "Active", avatar: "https://i.pravatar.cc/150?img=10" },
];

export default function StudentTable() {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden w-full border-collapse">
      <div className="overflow-y-auto max-h-[300px]">
        <table className="w-full border-separate border-spacing-0">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 border-gray-300 text-[#535862] text-left text-sm border-b">S/N</th>
              <th className="py-2 px-4 border-gray-300 text-[#535862] text-left text-sm border-b">Name</th>
              <th className="py-2 px-4 border-gray-300 text-[#535862] text-left text-sm border-b">Email</th>
              <th className="py-2 px-4 border-gray-300 text-[#535862] text-left text-sm border-b">Status</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
