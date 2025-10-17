"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CreateLesson from "@/components/newLesson";
import MultiSelectDropdown from "@/components/multiSelectURL";
import { Data, ApiResponse, RowsResponse1, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import LoadingIndicator from "@/components/loadingIndicator";
import EditTopic from "@/components/editTopic";
import {getUserField} from "@/utils/curUser";



export default function LessonCards() {
//const queryClient = useQueryClient();
//const router = useRouter();
//const { query } = router;

const userRole = getUserField<string>("role");
console.log('userRole', userRole);
const pathname = usePathname(); // track route changes
const [lessons, setLessons] = useState<Data[]>([]);
const params = useParams();
const searchParams = useSearchParams();
const [subject, setSubject] = useState<Data[]>([]);
const [currentPage, setCurrentPage] = useState(1);
//const subjects = searchParams.get("subjects")?.split(",") || [];
const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse>>({
  queryKey: ["lessons"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse>>("lessons", {}, 100);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
},
staleTime: 30 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

useEffect(() => {
  // Only run when on the correct page
  if (pathname === "/user-area/lessons") {
    refetch();
  }
}, [pathname, searchParams, refetch]);
// 👇 This effect runs refetch() whenever the query string or pathname changes
//useEffect(() => { if (pathname === "/user-area/lessons") { refetch(); }}, [pathname, query, refetch]);


 //useEffect(() => { refetch(); }, [pathname, refetch]);

// Reset pagination to first page whenever route or query params change
useEffect(() => {
  setCurrentPage(1);
}, [searchParams, params]);


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

const { data: dataUseNames, isLoading: loadingUseNames, isFetching: fetchingUseNames } = useQuery<ApiResponse<RowsResponse>>({
  queryKey: ["UseNames"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse>>("user/all", {}, 100);
  if (!response) {
    throw new Error("No data returned from user/all endpoint");
  }
  return response;
  },
staleTime: 60 * 2 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

const subjectIdsParam = searchParams.get("subjects");
const subjectIds = subjectIdsParam ? subjectIdsParam.split(",").map((id) => id.trim()) : [];


function getUserFullName(userId: string, dataUseNames?: ApiResponse<RowsResponse>): string {
if (!userId || !dataUseNames?.data) return "Unknown";
const users = Array.isArray(dataUseNames.data) ? dataUseNames.data : [];
const user = users.find((u: any) => u.id === userId);
return user?.fullName || "Unknown";
}

function getSubjectName(subjectId: string, dataSubjects?: ApiResponse<RowsResponse1>): string {
if (!subjectId || !dataSubjects?.data) return "Unknown";
const users = Array.isArray(dataSubjects.data) ? dataSubjects.data : [];
const user = users.find((u: any) => u.id === subjectId);
return user?.title || "Unknown";
}



//interface Props { data: Data; }
useEffect(() => {
//if (data?.data?.rows && data.data.rows.length > 0) {
if (data?.data?.rows?.length) {
const sorted = [...data.data.rows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
if(lessons !== sorted){setLessons(sorted);}
} 
}, [data]);

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

//const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
//const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
//const popup = searchParams.get("popup") ?? "defaultId";

// Filter lessons by subjectIds if provided
const filteredLessons = subjectIds.length
  ? lessons.filter((lesson) => lesson.subjectId && subjectIds.includes(lesson.subjectId))
  : lessons;

// Pagination
const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 5;
const totalPages = Math.ceil(filteredLessons.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const currentLessons = filteredLessons.slice(startIndex, endIndex);

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

// ✅ helper to check role
function isRole(role?: string | null): boolean {
  if (!role) return false;
  return ["TUTOR"].includes(role.toUpperCase());
}

let content = (
<section>
<div className="flex w-full mt-10 mb-4">
<div className="flex-1 pr-5 text-2xl font-semibold my-2">Lessons</div>
<div className="flex items-center gap-4 font-semibold">
{/* Text + Icon side by side */}
<div className="hidden md:block">
<MultiSelectDropdown options={subject} redirectUrl="/user-area/lessons?action=list" />
</div>

{/* Drop Down */}
{isRole(userRole) && (
<Link
href="/user-area/lessons?action=create&mod=lesson" 
aria-label={`Go to New Lesson Page`}
title={`Go to New Lesson Page`}
className="def-link-style"
><div className="flex items-center space-x-2 cursor-pointer">
{/* Icon container */}


<div className="flex items-center justify-center w-12 h-12 def-bg text-white text-3xl rounded-2xl">
+ </div>
{/* Text next to icon */}
<span className="text-[#14265C] text-lg font-medium">Add Lesson</span>
</div>
</Link>)}</div>
</div>

<section className="mb-2 md:hidden">
<MultiSelectDropdown options={subject} redirectUrl="/user-area/lessons?action=list" />
</section>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
{currentLessons?.map((filteredLessons) => (
<div key={filteredLessons.id} className="p-3 bg-white rounded-2xl">
<div className="flex w-full overflow-hidden">
{/* Left: Image */}
<div className="flex-shrink-0 px-3">
<img src={filteredLessons.avatarOrCover ?? ""} alt={filteredLessons.title ?? ""}
title={filteredLessons.title ?? ""}
width={60}
height={50} />
</div>

{/* Right: Content */}
<div className="flex-1">
{isRole(userRole) && (
<Link 
href={{
  pathname: "/user-area/lessons",
  query: { action: "update", mod: "lesson", itemId: filteredLessons.id ?? "", subjectId: filteredLessons.subjectId ?? "", title: filteredLessons.title ?? "", description: filteredLessons.description ?? "", avatarOrCover: filteredLessons.avatarOrCover ?? "" },
}}
aria-label={`Go to edit Lesson Page`}
title={`Go to edit Lesson Page`}
className="def-link-style"
><h2 className="text-lg font-semibold">{filteredLessons.title}</h2>
</Link>)}

{!isRole(userRole) && (<h2 className="text-lg font-semibold">{filteredLessons.title}</h2>)}
<p className="text-gray-500 text-sm">
{filteredLessons.lessonsCount} Topics. {filteredLessons.minutes} minutes
</p>
<section className="mt-4"><span
className="inline-block rounded-full px-3 py-1"
style={{ backgroundColor: "#FF85114A" }}>
<span
className="inline-block text-xs text-center px-2 py-1"
>
{getSubjectName(filteredLessons.subjectId ?? "", dataSubjects)}
</span></span>
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
4+ more
</span>
</div>
</section>

{/* Tutor Info */}
<div className="flex w-full overflow-hidden mt-4">
<div className="flex-shrink-0 px-3">
<img
src="https://i.pravatar.cc/150?img=19"
alt="Tutor"
className="w-12 h-12 rounded-full bg-gray-900 border-2 border-white object-cover"
/>
</div>
<div className="flex-1">
<h2 className="text-sm text-gray-500 font-semibold">Tutor</h2>
<p className="text-gray-500 text-sm font-semibold">
{getUserFullName(filteredLessons.userId ?? "", dataUseNames)}

</p>
</div>
</div>
</div>
))}
</div>




{/* Pagination */}
<div className="flex justify-between items-center mt-12 text-sm text-gray-600">
<div>
{startIndex + 1}-{Math.min(endIndex, filteredLessons.length)} of {filteredLessons.length}
</div>

{/* Bottom right: page navigation */}
<div className="flex items-center gap-2">
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
</section>);

if ((action === 'create' || action === 'update') && mod === 'lesson') { content = <CreateLesson /> }
if (action === 'update' && mod === 'lesson-topic') { content = <EditTopic /> }
if(isLoading) return (<LoadingIndicator />)
return (content);
}
