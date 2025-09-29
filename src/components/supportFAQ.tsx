"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types'; 
import SubTitle from "./subTitle";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  itemsPerPage?: number;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqs,
  itemsPerPage = 10,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFAQs = faqs.slice(startIndex, startIndex + itemsPerPage);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (<section>  
<div className="flex w-full mb-6">
<div className="flex-1 pr-5"><SubTitle string1='FAQ' string2='Upload your questions and answers here' /></div>
<div className="flex items-center gap-4 font-semibold">

<Link
href="/user-area/support?action=create&mod=faq&sub=create" 
aria-label={`Go to New Lesson Page`}
title={`Go to New Lesson Page`}
className="def-link-style"
><div className="flex items-center space-x-2 cursor-pointer">
{/* Icon container */}


<div className="flex items-center justify-center w-12 h-12 def-bg text-white text-3xl rounded-2xl">
+ </div>
{/* Text next to icon */}
<span className="text-[#14265C] text-lg font-medium">Add FAQ</span>
</div>
</Link></div>
</div>


  

    <div className="w-full space-y-2">
      {currentFAQs.map((faq, index) => (
        <div key={index} className="border-b border-gray-200 w-full">
          <button
            className="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-gray-50 transition"
            onClick={() => toggleAccordion(index)}
          >
            <span className='pointer'>{faq.question}</span>
            <ChevronDownIcon
              className={`h-5 w-5 pointer transform transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            />
          </button>

          {openIndex === index && (
            <div className="px-4 py-3 text-gray-700 mb-5 bg-transparent">
              {faq.answer}
            </div>
          )}
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div></section>
  );
};

export default FAQAccordion;