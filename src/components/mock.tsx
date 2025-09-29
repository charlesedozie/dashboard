"use client";

import Image from "next/image";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, SlidersHorizontal } from "lucide-react";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Data, ApiResponse, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData";
import CreateMock from "@/components/newMock";

export default function LessonCards() {
const params = useParams();
const searchParams = useSearchParams();

const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const popup = searchParams.get("popup") ?? "defaultId";

const [quizzes, setQuizzes] = useState<Data[]>([]);
const [totalItems, setTotalItems] = useState(0);
const itemsPerPage = 4;
const [currentPage, setCurrentPage] = useState(1);
const old_totalItems = 40;
const old_itemsPerPage = 12;

// Generate dummy data
let old_lessons = Array.from({ length: old_totalItems }, (_, i) => ({
id: i + 1,
title: `Metals ${i + 1}`,
lessonsCount: 12,
minutes: 20,
subject: "Mathematics",
tutor: "Cynthia Morgan",
}));



/*
useEffect(() => {
async function getQuiz() {
try {
const data = await fetchData<ApiResponse<Data[]>>("quizzes");
if (data?.data) { //console.log(data.data);
}
} catch (error) { console.error("Error fetching dashboard data:", error); }}
getQuiz();
}, []);

*/
// Calculate the total number of pages
const totalPages = Math.ceil(totalItems / itemsPerPage);
// Paginate data
const startIndex = (currentPage - 1) * itemsPerPage;
const currentItems = quizzes.slice(startIndex, startIndex + itemsPerPage);

// Navigation handlers
const handlePrev = () => {
if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

const handleNext = () => {
if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
const endIndex = startIndex + itemsPerPage;

let content = (
<section className='mt-5'>
<div className="flex w-full mt-10 mb-6">
<div className="flex-1 pr-5 text-2xl font-semibold my-2">Mock Exams</div>
<div className="flex items-center gap-4 font-semibold">
{/* Text + Icon side by side */}
<div className="flex items-center gap-2 mr-10">
</div>

<Link
href="/user-area/mock?action=create&mod=mock" 
aria-label={`Go to New Mock Page`}
title={`Go to New Mock Page`}
className="def-link-style"
><div className="flex items-center space-x-2 cursor-pointer">
{/* Icon container */}
<div className="flex items-center justify-center w-12 h-12 def-bg text-white text-3xl rounded-2xl">
+ </div>
{/* Text next to icon */}
<span className="text-[#14265C] text-lg font-medium">New Mock Exam</span>
</div>
</Link></div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">



{old_lessons.map((lesson) => (
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
<div className="flex-1">
<h2 className="text-lg font-semibold">{lesson.title}</h2>
<p className="text-gray-500 text-sm">
{lesson.lessonsCount} Lessons. {lesson.minutes} minutes
</p>
<section className="mt-4">
<span
className="inline-block px-3 py-1 text-sm rounded-full"
style={{ backgroundColor: "#FF85114A" }}
>
{lesson.subject}
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
<img
src="https://i.pravatar.cc/150?img=19"
alt="Tutor"
className="w-12 h-12 rounded-full bg-gray-900 border-2 border-white object-cover"
/>
</div>
<div className="flex-1">
<h2 className="text-sm text-gray-500 font-semibold">Tutor</h2>
<p className="text-gray-500 text-sm">{lesson.tutor}</p>
</div>
</div>
</div>
))}






{currentItems.map((quizz) => (
<div key={quizz.id} className="p-3 bg-white rounded-2xl">
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
<div className="flex-1">
<h2 className="text-lg font-semibold">{quizz?.title || "No label available"}</h2>
<p className="text-gray-500 text-sm">{quizz?.minutes || "No minutes available"}</p>
<section className="mt-4">
<span
className="inline-block px-3 py-1 text-sm rounded-full"
style={{ backgroundColor: "#FF85114A" }}
>{quizz?.subject || "No subject available"}
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
<img
src="https://i.pravatar.cc/150?img=19"
alt="Tutor"
className="w-12 h-12 rounded-full bg-gray-900 border-2 border-white object-cover"
/>
</div>
<div className="flex-1">
<h2 className="text-sm text-gray-500 font-semibold">Tutor</h2>
<p className="text-gray-500 text-sm">{quizz?.title || "No tutor available"}</p>
</div>
</div>
</div>
))}
</div>


{/* Pagination */}
<div className="flex justify-between items-center my-10 text-sm text-gray-600">
<div>
{startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
{quizzes.length}
</div>
<div className="flex items-center gap-2">
<button
onClick={goFirst}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsLeft size={22} className="text-gray-600 pointer" />
</button>
<button
onClick={goPrev}
disabled={currentPage === 1}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronLeft size={22} className="text-gray-600 pointer" />
</button>
<span>
Page {currentPage} of {totalPages}
</span>
<button
onClick={goNext}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronRight size={22} className="text-gray-600 pointer" />
</button>
<button
onClick={goLast}
disabled={currentPage === totalPages}
className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
>
<ChevronsRight size={22} className="text-gray-600 pointer" />
</button>
</div>
</div>
</section>);


if (action === 'create' && mod === 'mock') { content = <CreateMock />; }
return (content);
}
