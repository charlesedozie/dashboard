"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CreateLesson from "@/components/newLesson";
import MultiSelectDropdown from "@/components/multiSelectURL";
import TitleFetcher, {UserName} from "@/components/getTitle";
import { Data, ApiResponse, RowsResponse1, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";


export default function LessonCards() {
const [lessons, setLessons] = useState<Data[]>([]);
const params = useParams();
const searchParams = useSearchParams();
const [subject, setSubject] = useState<Data[]>([]);
const [currentPage, setCurrentPage] = useState(1);
//const subjects = searchParams.get("subjects")?.split(",") || [];
const { data, isLoading, isFetching } = useQuery<ApiResponse<RowsResponse>>({
  queryKey: ["lessons"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse>>("lessons", {}, 100);
  console.log(response);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
  },
  staleTime: 1000 * 60, // 1 min - keeps cached data fresh for 1 min
});

//interface Props { data: Data; }
useEffect(() => {
if (data?.data?.rows && data.data.rows.length > 0) {
const sorted = [...data.data.rows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
setLessons(sorted);
} else {
setLessons([]); // ✅ Set empty array if no data returned
}
}, [data]);

useEffect(() => {
async function loadSubject() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("subjects");
if (data?.data) {
const newArray = data.data.map(item => ({
label: String(item.title ?? ''),
value: String(item.id ?? '')
}));
const sortedArray = newArray.sort((a, b) => a.label.localeCompare(b.label));
setSubject(sortedArray);
}} 
catch (error) { console.error("Error fetching data:", error); }}
loadSubject(); }, []);

//const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
//const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
//const popup = searchParams.get("popup") ?? "defaultId";


// Pagination
const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 5;
const totalPages = Math.ceil(lessons.length / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = startIndex + pageSize;
const currentLessons = lessons.slice(startIndex, endIndex);

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));



let content = (
<section>
<div className="flex w-full mt-10 mb-6">
<div className="flex-1 pr-5 text-2xl font-semibold my-2">Lessons</div>
<div className="flex items-center gap-4 font-semibold">
{/* Text + Icon side by side */}
<div className="p-6">
<MultiSelectDropdown options={subject} />
</div>

{/* Drop Down */}
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
</Link></div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
{currentLessons.map((lesson) => (
<div key={lesson.id} className="p-3 bg-white rounded-2xl">
<div className="flex w-full overflow-hidden">
{/* Left: Image */}
<div className="flex-shrink-0 px-3">
<Image
src={"/lesson.png"}
alt={"Lesson Logo"}
title={"Lesson Logo"}
width={60}
height={50}
/>
</div>

{/* Right: Content */}
<div className="flex-1">{lesson.subjectId}
<Link 
href={{
  pathname: "/user-area/lessons",
  query: { action: "update", mod: "lesson", itemId: lesson.id ?? "", subjectId: lesson.subjectId ?? "", title: lesson.title ?? "", description: lesson.description ?? "", avatar: lesson.avatar ?? "" },
}}
aria-label={`Go to edit Lesson Page`}
title={`Go to edit Lesson Page`}
className="def-link-style"
><h2 className="text-lg font-semibold">{lesson.title}</h2>
</Link>
<p className="text-gray-500 text-sm">
{lesson.lessonsCount} Lessons. {lesson.minutes} minutes
</p>
<section className="mt-4"><span
className="inline-block rounded-full px-3 py-1"
style={{ backgroundColor: "#FF85114A" }}>
<span
className="inline-block text-xs text-center px-2 py-1"
>
<TitleFetcher apiEndpoint={`subjects/${lesson.subjectId}`} placeholder="N/A" />
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
+10 more
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
<p className="text-gray-500 text-sm font-semibold"><UserName apiEndpoint={`user/${lesson.userId}`} placeholder="N/A" /></p>
</div>
</div>
</div>
))}
</div>




{/* Pagination */}
<div className="flex justify-between items-center mt-12 text-sm text-gray-600">
<div>
{startIndex + 1}-{Math.min(endIndex, lessons.length)} of {lessons.length}
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
return (content);
}
