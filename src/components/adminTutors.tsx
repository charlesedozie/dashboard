"use client";

import { useState, useEffect } from "react";
import { Data, ApiResponse, UserStatus, RowsResponse1 } from "@/types";
import { fetchData } from "@/utils/fetchData";
import LoadingIndicator from "@/components/loadingIndicator";
import Delete from "@/components/deleteButton";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DropDownAPI from "./dropDownAPI";
import { useTheme } from "next-themes";
import { getUserField } from "@/utils/curUser";
import { AccessDenied } from "@/components/utils";

export default function Tutors() {
const [tutors, setTutors] = useState<RowsResponse1>([]);
const [currentPage, setCurrentPage] = useState(1);
const [deleteTutor, setDeleteTutor] = useState<any | null>(null); // Track tutor to delete
const userRole = getUserField<string>("role");

const { theme } = useTheme();
const isDark = theme === "dark";
const { data, isLoading } = useQuery<RowsResponse1>({
queryKey: ["tutors"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse1>>("user/all", {}, 100);
return response?.data ?? [];
},
staleTime: 30 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

// Sort tutors when data changes
useEffect(() => {
if (data?.length) {
  console.log('data', data)
const sorted = [...data].sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "", undefined, { sensitivity: "base" }));
if(tutors !== sorted){setTutors(sorted); console.log('sorted', sorted); }} 
}, [data]);

const filteredTutors = tutors;//.filter( (tutor) => tutor.role && !["USER", "SUPER_ADMIN"].includes(tutor.role.toUpperCase()) );

// Pagination
const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 5;
const totalPages = Math.ceil(filteredTutors.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const currentTutors = filteredTutors.slice(startIndex, endIndex);

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

// Handle delete success
const handleDeleteSuccess = (tutorId: string) => {
setTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
setDeleteTutor(null);
};

if (isLoading && !data) {
return (
<section>
<div className="flex items-center gap-4">
<LoadingIndicator size="sm" label="Loading..." variant="primary" />
</div>
</section>
);
}

const canView =
!!userRole && ["super_admin"].includes(userRole.toLowerCase());

if (!canView) {
return <AccessDenied />;
}

return (
<section>
<div className="w-full">
<div className="overflow-x-auto">
<table className="w-full border-collapse text-gray-500">
<thead className={`sticky top-0 z-10 ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<tr>
<th className="py-2 text-left text-sm">S/N</th>
<th className="py-2 text-left text-sm">Tutor / Admin</th>
<th className="py-2 text-left text-sm">Email</th>
<th className="py-2 text-left text-sm">Sex</th>
<th className="py-2 text-left text-sm">Status</th>
<th className="py-2 text-left text-sm">Subjects</th>
<th className="py-2 text-center text-sm">Actions</th>
</tr>
</thead>
<tbody>
{currentTutors && currentTutors.length > 0 ? (
currentTutors.map((tutor, index) => (
<tr key={tutor.id || index} className={`border-b p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<td className="py-3 text-sm align-top">{startIndex + index + 1}</td>
<td className="py-3 text-sm align-top">{tutor.fullName || "N/A"} ({tutor.role})</td>
<td className="py-3 text-sm align-top">{tutor.email || "N/A"}</td>
<td className="py-3 text-sm align-top capitalize">{tutor.gender || "N/A"}</td>
<td className="py-3 text-sm align-top">
<DropDownAPI
apiEndpoint={`user/${tutor.id}`}
options={UserStatus}
defaultState={(tutor.status)?.toUpperCase() || "ACTIVE"}
hiddenFields={{ userId: tutor.id }}
label=""
/>
</td>
<td className="py-3 text-sm align-top">
{tutor.subjects?.length ? (
<ul className="list-none text-sm p-0 m-0 flex flex-col items-start justify-start">
{tutor.subjects && tutor.subjects.length > 0 ? ( tutor.subjects.map((subject: { id?: string | number; title?: string } | string, idx: number) =>
typeof subject === "string" ? (
<li key={idx} className="py-1">
{subject}
</li>
) : (
<li key={subject.id ?? idx} className="py-1">
{subject.title}
</li>
))) : ( null )}
</ul>
) : (
<p>N/A</p>
)}
</td>
<td className="py-3 text-center text-sm align-top">
<div className="flex items-center justify-center gap-2">
<TrashIcon
onClick={() => setDeleteTutor(tutor)}
className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
/>
</div>
</td>
</tr>
))
) : ( null )}
</tbody>
</table>
</div>


{/* Pagination */}
<div className={`${isDark ? 'text-white' : "bg-white text-gray-600"} flex justify-between items-center mt-4 text-sm text-gray-600`}>
<div>
{startIndex + 1}-{Math.min(endIndex, tutors.length)} of {tutors.length}
</div>

{/* Bottom right: page navigation */}
<div className="flex items-center gap-2 my-5">
{/* First Page */}
<button
onClick={goFirst}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsLeft
size={22}
className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`}
/>
</button>

{/* Prev Page */}
<button
onClick={goPrev}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronLeft
size={22}
className={`text-gray-600 ${currentPage === 1 ? "" : "pointer"}`}
/>
</button>

<span>Page {currentPage} of {totalPages}</span>

{/* Next Page */}
<button
onClick={goNext}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronRight
size={22}
className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`}
/>
</button>

{/* Last Page */}
<button
onClick={goLast}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsRight
size={22}
className={`text-gray-600 ${currentPage === totalPages ? "" : "pointer"}`}
/>
</button>
</div>
</div>
</div>

{/* Delete modal */}
{deleteTutor && (
<Delete
apiUrl={`user/${deleteTutor.id}`}
title={`Delete Tutor: ${deleteTutor.fullName ?? deleteTutor.email}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteTutor}
onClose={() => setDeleteTutor(null)}
onSuccess={() => handleDeleteSuccess(deleteTutor.id)}
/>
)}
</section>
);
}