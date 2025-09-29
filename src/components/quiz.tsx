"use client";

import Image from "next/image";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, SlidersHorizontal } from "lucide-react";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Subject, Data, ApiResponse, RowsResponse1 } from "@/types";
import { fetchData } from "@/utils/fetchData";
import CreateQuiz from "@/components/newQuiz";

export default function LessonCards() {
const params = useParams();
const searchParams = useSearchParams();

const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const popup = searchParams.get("popup") ?? "defaultId";

const [quizzes, setQuizzes] = useState<Subject[]>([]);
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


useEffect(() => {
async function loadQuizzes() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("quizzes");
if (data?.data) {
//const getQuizz = (data?.data?.rows ?? []).map((item: any) => ({ value: item.id, label: item.title, }));
// Sort in descending order (newest to oldest)
const sortedDesc = [...data?.data ?? []].sort((a, b) => 
  new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime()
);
//setQuizzes(sortedDesc);
setTotalItems(data.data.length);

/*
const getQuizz = data.data.map((item: any) => ({
id: item.id,
title: item.title,
}));
setQuizzes(getQuizz);
*/
}} 
catch (error) { console.error("Error fetching dashboard data:", error); }}
loadQuizzes(); }, []);

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
let content = (<section>
<div className="flex w-full mt-10 mb-6">
<div className="flex-1 pr-5 text-2xl font-semibold my-2">Quizzes</div>
<div className="flex items-center gap-4 font-semibold">
<Link
href="/user-area/quizzes?action=create&mod=quiz" 
aria-label={`Go to New Quiz Page`}
title={`Go to New Quiz Page`}
className="def-link-style"
><div className="flex items-center space-x-2 cursor-pointer">
{/* Icon container */}
<div className="flex items-center justify-center w-12 h-12 def-bg text-white text-3xl rounded-2xl">
+ </div>
{/* Text next to icon */}
<span className="text-[#14265C] text-lg font-medium">New Quiz</span>
</div>
</Link>
</div>
</div></section>);
if (action === 'create' && mod === 'quiz') { content = <CreateQuiz />; }

return (content);
}
