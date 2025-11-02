"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SubTitle from "./subTitle";
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Delete from "@/components/deleteButton";
import { Data, ApiResponse, RowsResponse1, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";

function FAQAccordion() {
const [openIndex, setOpenIndex] = useState<number | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [faqList, setFaqList] = useState<Data[]>([]);
const [deleteItem, setDeleteItem] = useState<any | null>(null); 
const [deleteTitle, setDeleteTitle] = useState(''); 
const { theme } = useTheme();
const isDark = theme === "dark";

const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse1>>({
queryKey: ["lessons"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse1>>("faqs", {}, 500);
if (!response) {
throw new Error("No data returned from lessons endpoint");
}
return response;
},
staleTime: 15 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

function cancelDelete(){if(deleteItem){setDeleteItem(null);}}
//interface Props { data: Data; }
useEffect(() => {
//if (data?.data?.rows && data.data.rows.length > 0) {
if (data?.data?.length) {
const sorted = [...data.data].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
if(faqList !== sorted){setFaqList(sorted);}
} 
}, [data]);



const totalPages = Math.ceil(faqList.length / Number(process.env.NEXT_PUBLIC_PAGE_SIZE));
const startIndex = (currentPage - 1) * Number(process.env.NEXT_PUBLIC_PAGE_SIZE);
const currentFAQs = (faqList).slice(startIndex, startIndex + Number(process.env.NEXT_PUBLIC_PAGE_SIZE));



const filteredLessons = faqList;

// Pagination
const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE);
const endIndex = startIndex + pageSize;


const toggleAccordion = (index: number) => {
setOpenIndex(openIndex === index ? null : index);
};

const goFirst = () => setCurrentPage(1);
const goLast = () => setCurrentPage(totalPages);
const goPrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
const goNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

const handleDelete = (id: string) => {
setFaqList((prev) => prev.filter((faq) => faq.id !== id));
// Adjust page if last item on the page was deleted
if ((startIndex >= faqList.length - 1) && currentPage > 1) {
setCurrentPage((prev) => prev - 1);
}
};

return (
<section>
{/* Header */}
<div className="flex w-full mb-6">
<div className="flex-1 pr-5">
<SubTitle
string1="FAQ"
string2="Upload your questions and answers here"
/>
</div>
<div className="flex items-center gap-4 font-semibold">
<Link
href="/user-area/support?action=create&mod=faq&sub=create"
aria-label="Go to New FAQ Page"
title="Go to New FAQ Page"
className="def-link-style"
>
<div className="flex items-center space-x-2 cursor-pointer">
<div className={`flex items-center justify-center w-12 h-12 rounded-2xl text-3xl transition-colors duration-300 ${theme === "dark" ? "bg-gray-700 text-white" : "def-bg text-white"}`}>
+
</div>
<span  className={`text-lg font-medium transition-colors duration-300 
          ${theme === "dark" ? "text-gray-100" : "text-[#14265C]"}`}>Add FAQ</span>
</div>
</Link>
</div>
</div>

{/* FAQ List */}
<div className="w-full space-y-2">
{currentFAQs && currentFAQs.length > 0 ? (
currentFAQs.map((faq, index) => (
<div key={faq.id} className={`border-b w-full p-3 rounded-2xl transition-colors ${
isDark ? "border-gray-600" : "border-gray-200"}`}>
<div className="flex justify-between items-center">
<button
className="flex-1 flex justify-between items-center px-4 py-3 text-left font-medium transition"
onClick={() => toggleAccordion(index)}
>
<span>{faq.question}</span>
<ChevronDownIcon
className={`h-5 w-5 transform transition-transform pointer duration-300 ${
openIndex === index ? "rotate-180" : ""
}`}
/>
</button>

{/* Always visible Edit & Delete buttons */}
<div className="flex gap-2 pr-4">
<Link
href={`/user-area/support?action=update&mod=faq&itemId=${faq.id}&question=${faq.question}&answer=${faq.answer}&returnURL=true`}
title="Edit FAQ"
className="text-blue-600 hover:text-blue-800"
>
<PencilIcon className="h-5 w-5" />
</Link>

<TrashIcon
onClick={() => {setDeleteItem(faq.id); setDeleteTitle(faq.question || '')}}
className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
/>
</div>
</div>

{/* Answer */}
{openIndex === index && (
<div className="px-4 py-3 mb-5">{faq.answer}</div>
)}
</div>
))) : ( null )}
</div>





{/* Pagination */}
<div className="flex justify-between items-center mt-12 text-sm text-gray-600">
<div>
{startIndex + 1}-{Math.min(endIndex, filteredLessons.length)} of {totalPages}
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



{/* Delete lesson */}
{deleteItem && (
<Delete
apiUrl={`faqs/${deleteItem}`}
title={`Delete FAQ: ${deleteTitle}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteItem}
//returnURL='/user-area/lessons'
onClose={() => setDeleteItem(null)}
onCancel={cancelDelete}
onSuccess={() => handleDelete(deleteItem)}
/>
)}
</section>
);
}

export default FAQAccordion;
