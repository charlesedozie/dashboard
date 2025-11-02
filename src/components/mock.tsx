"use client";

import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, SlidersHorizontal } from "lucide-react";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from "react";
import Link from 'next/link';
import { Data, ApiResponse, RowsResponse1, RowsResponse2, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData";
import CreateMock from "@/components/newMock";
import EditMock from "@/components/editMockQuestion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MultiSelectDropdown from "@/components/multiSelectURL";
import { usePathname } from "next/navigation";
import {getUserField, getUser} from "@/utils/curUser";
import { CircleUserRound } from "lucide-react";
import { useTheme } from "next-themes";


export default function MockCards() {
const params = useParams();
const pathname = usePathname(); // track route changes
const searchParams = useSearchParams();
const [mock, setMock] = useState<Data[]>([]);
const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const popup = searchParams.get("popup") ?? "defaultId";
const userRole = getUserField<string>("role");
const { theme } = useTheme();
const isDark = theme === "dark";

const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const q = searchParams.get("q") ?? "defaultTerm";
const deleteId = searchParams.get("deleteId");
const queryClient = useQueryClient();

const [subject, setSubject] = useState<Data[]>([]);
const [userNames, setUserNames] = useState<Data[]>([]);


const [totalItems, setTotalItems] = useState(0);
const [currentPage, setCurrentPage] = useState(1);

let searchTerms = "mock-exams";
if (action === 'search' && mod === 'search') { searchTerms = `mock-exams?title=${encodeURIComponent(q)}`; } 

const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse>>({
queryKey: ["mock-exams", q],
enabled: !deleteId, // 🚫 don’t fetch if deleteId exists
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>(searchTerms, {}, 100);
if (!response) {
throw new Error("No data returned from lessons endpoint");
}
return response;
},
staleTime: 20 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});


// ✅ Filter locally when deleteId exists
const filteredData = useMemo(() => {
if (!data?.data?.rows) return [];
if (!deleteId) return data.data.rows;
return data.data.rows.filter((row) => row.id !== deleteId);
}, [data, deleteId]);

// ✅ Update cache when deleteId exists (no API call)
useEffect(() => {
if (deleteId && data?.data?.rows) {
queryClient.setQueryData<ApiResponse<RowsResponse>>(["mock-exams", q], (old) => {
if (!old) return old;
return {
...old,
data: {
...old.data,
rows: old.data.rows.filter((row) => row.id !== deleteId),
},
};
});
}
}, [deleteId, data, queryClient, searchTerms]);

useEffect(() => {
// Only run when on the correct page
if (pathname === "/user-area/mock") {
refetch();
}
}, [pathname, searchParams, refetch]);

const { data: dataSubjects, isLoading: loadingSubjects, isFetching: fetchingSubjects } = useQuery<ApiResponse<RowsResponse1>>({
queryKey: ["subjects"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse1>>("subjects", {}, 1000);
if (!response) {
throw new Error("No data returned from subjects endpoint");
}
return response;
},
staleTime: 60 * 10 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});


useEffect(() => {
if (dataSubjects?.data?.length) {
const newArray = dataSubjects.data.map(item => ({
label: String(item.title ?? ''),
value: String(item.id ?? '')
}));
const sortedArray = newArray.sort((a, b) => a.label.localeCompare(b.label));
if(subject !== sortedArray){setSubject(sortedArray);}
} 
}, [dataSubjects]);

useEffect(() => { if (!deleteId) { refetch(); } }, [deleteId, refetch]);

useEffect(() => {
if (data?.data?.rows?.length) {
const sourceRows = data.data.rows.filter((row) => !deleteId || row.id !== deleteId);
const sorted = [...sourceRows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA;
});
if(mock !== sorted){setMock(sorted);}
}
}, [data, deleteId]);



const subjectIdsParam = searchParams.get("subjects");
const subjectIds = subjectIdsParam ? subjectIdsParam.split(",").map((id) => id.trim()) : [];

function getSubjectName(subjectId: string, dataSubjects?: ApiResponse<RowsResponse1>): string {
if (!subjectId || !dataSubjects?.data) return "Unknown";
const users = Array.isArray(dataSubjects.data) ? dataSubjects.data : [];
const user = users.find((u: any) => u.id === subjectId);
return user?.title || "Unknown";
}
// Filter lessons by subjectIds if provided
const filteredMock = subjectIds.length
? mock.filter((lesson) => lesson.subjectId && subjectIds.includes(lesson.subjectId))
: mock;

// Pagination
const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 5;
const totalPages = Math.ceil(filteredMock.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
//const currentMock = filteredMock.slice(startIndex, endIndex);

// Calculate the total number of pages
const currentItems = filteredMock.slice(startIndex, startIndex + pageSize);
const { data: dataUseNames, isLoading: loadingUseNames, isFetching: fetchingUseNames } = useQuery<ApiResponse<RowsResponse>>({
queryKey: ["UseNames"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>("user/all", {}, 1000);
if (!response) {
throw new Error("No data returned from user/all endpoint");
}  return response;  },
staleTime: 60 * 3 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

//useEffect(() => { if (dataUseNames) { setUserNames(dataUseNames);  }}, [dataUseNames]);
useEffect(() => {
if (dataUseNames?.data?.rows) {
setUserNames(dataUseNames.data.rows);
}
}, [dataUseNames]);

function getUserFullName(userId: string, users?: any[]): string {
if (!userId || !users?.length) return "Unknown";
const user = users.find((u) => String(u.id).trim() === String(userId).trim());
if (!user) { return "Unknown"; }
return user.fullName || user.username || "Unnamed";
}


// ✅ helper to check role
function isRole(role?: string | null): boolean {
if (!role) return false;
return ["TUTOR"].includes(role.toUpperCase());
}
// Navigation handlers
const handlePrev = () => {
if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

const handleNext = () => {
if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};

function getUserAvatar(userId: string, users?: any[]): string {
if (!userId || !users?.length) return "Unknown";
const user = users.find((u) => String(u.id).trim() === String(userId).trim());
if (!user) { return "Unknown"; }
return user.avatar || user.username || "Unnamed";
}

function isValidImageUrl(url?: string): boolean {
if (!url) return false;
// Check if it's an absolute or relative image URL
const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
try {
// ✅ Try constructing a URL (works for absolute URLs)
new URL(url);
return imagePattern.test(url);
} catch {
// ✅ Also allow relative URLs like "/uploads/avatar.jpg"
return imagePattern.test(url);
}}

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

let content = (
<section  className={`${isDark ? "bg-black text-white" : "bg-white text-black"}`}>{(action === 'search' && mod === 'search' && q !== "defaultTerm") ? <section>Search results: {q}</section> : null}
<div className="flex w-full mt-2 mb-4">
<div className="flex-1 pr-5 text-2xl font-semibold mb-2">Mock Exams</div>
<div className="flex items-center gap-4 font-semibold">
{/* Text + Icon side by side */}
<div className="hidden md:block">
<MultiSelectDropdown options={subject} redirectUrl="/user-area/mock?action=list" />
</div>

{isRole(userRole) && (
<Link
href="/user-area/mock?action=create&mod=mock" 
aria-label={`Go to New Mock Page`}
title={`Go to New Mock Page`}
className="def-link-style"
><div className="flex items-center space-x-2 cursor-pointer">
{/* Icon container */}
<div className={`flex items-center justify-center w-12 h-12 rounded-2xl text-3xl transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 text-white" : "def-bg text-white"}`}>
+ </div>
{/* Text next to icon */}
<span className={`text-lg font-medium transition-colors duration-300 
          ${theme === "dark" ? "text-gray-100" : "text-[#14265C]"}`}>New Mock Exam</span>
</div>
</Link>
)}</div>
</div>

<section className="mb-2 md:hidden">
<MultiSelectDropdown options={subject} redirectUrl="/user-area/mock?action=list" />
</section>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
{currentItems?.filter( (lesson) => lesson.userId === getUser()?.user.id || getUser()?.user.role === "SUPER_ADMIN" || getUser()?.user.role === "ADMIN").map((quizz) => (
<div key={quizz.id} className={`p-3 rounded-2xl transition-colors ${
isDark ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
<div className="flex w-full overflow-hidden">
{/* Left: Image */}
<div className="flex-shrink-0 px-3">
<img src={quizz.avatar ?? ""} alt={quizz.title ?? ""}
title={quizz.title ?? ""}
width={60}
height={50} />
</div>

{/* Right: Content */}
<div className="flex-1">
{isRole(userRole) && ( <Link 
href={{
pathname: "/user-area/mock",
query: { action: "update", mod: "mock", itemId: quizz.id ?? "", subjectId: quizz.subjectId ?? "", title: quizz.title ?? "", description: quizz.description ?? "", avatarOrCover: quizz.avatar ?? "", instructions: quizz.instructions ?? "", mockTypeId:quizz.mockTypeId ?? "",  duration: quizz.duration ?? ""},
}}
aria-label={`Go to edit Page`}
title={`Go to edit Page`}
className="def-link-style"
><h2 className="text-lg font-semibold">{quizz?.title || "No title available"}</h2>
</Link>)}

{!isRole(userRole) && ( <h2 className="text-lg font-semibold">{quizz?.title || "No title available"}</h2>)}

<p className={`text-sm ${isDark ? "text-white" : "text-gray-500"}`}>
{quizz?.duration 
? `${quizz.duration} minutes` 
: "No minutes available"} 
</p>
<section className="mt-4">
<span
className="inline-block px-3 py-1 text-sm rounded-full"
style={{ backgroundColor: "#FF85114A" }}
>{getSubjectName(quizz?.subjectId ?? "", dataSubjects)}
</span>
</section>
</div>
</div>

{/* Stacked Avatars */}
<section className="mt-6">
<div className="flex items-center">
<div className="flex items-center">
<img
src="https://i.pravatar.cc/150?img=22"
alt="Thumb 1"
className="w-10 h-10 rounded-full border-2 border-white object-cover"
/>
<img
src="https://i.pravatar.cc/150?img=10"
alt="Thumb 2"
className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-4"
/>
<img
src="https://i.pravatar.cc/150?img=9"
alt="Thumb 3"
className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-4"
/>
<img
src="https://i.pravatar.cc/150?img=8"
alt="Thumb 4"
className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-4"
/>
</div>
<span className="ml-3 text-green-700 text-sm font-medium">
+10 more
</span>
</div>
</section>

{/* Tutor Info */}
<div className="flex w-full overflow-hidden mt-4">
<div className="flex-shrink-0 px-3">

{isValidImageUrl(getUserAvatar(quizz.userId ?? "", userNames))
? <img src={getUserAvatar(quizz.userId ?? "", userNames)} alt={getUserFullName(quizz.userId ?? "", userNames)} className="w-12 h-12 rounded-full bg-gray-900 border-2 border-white object-cover"
/>
: <CircleUserRound 
className="w-10 h-10 rounded-full object-cover" />}
</div>
<div className="flex-1">
<h2 className="text-sm text-gray-500 font-semibold">Tutor</h2>
<p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-500"}`}>
{getUser()?.user.role === 'TUTOR' ? getUser()?.user.fullName : getUserFullName(quizz.userId ?? "", userNames)}</p>
</div>
</div>
</div>
))}
</div>


{/* Pagination */}
<div className={`${isDark ? "bg-black text-white" : "bg-white text-gray-600"} flex justify-between items-center mt-12 text-sm`}>
<div>
{startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
{mock.length}
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
</section>);


if ((action === 'create'  || action === 'update') && mod === 'mock') { content = <CreateMock />; }
if (action === 'update' && mod === 'question') { content = <EditMock />; }
return (content);
}
