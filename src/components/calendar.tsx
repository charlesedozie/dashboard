"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from 'next/link';

export default function Calendar(){

return (
<section>
<div className="flex w-full mt-10 mb-6">
<div className="flex-1 pr-5 text-2xl font-semibold my-2">Calendar</div>
<div className="flex items-center gap-4 font-semibold">
{/* Text + Icon side by side */}
<Link
href="/user-area/dboard?action=create&mod=calendar" 
aria-label={`Go to create event Page`}
title={`Go to create event Page`}
className="def-link-style"
><div className="flex items-center space-x-2 cursor-pointer">
{/* Icon container */}
<div className="flex items-center justify-center w-12 h-12 def-bg text-white text-3xl rounded-2xl">
+ </div>
{/* Text next to icon */}
<span className="text-[#14265C] text-lg font-medium">Add Event</span>
</div>
</Link>
</div>
</div>


<div className="bg-white p-4 rounded-lg shadow-md w-full">
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead className="bg-gray-50 sticky top-0 z-10">
<tr>
<th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
S/N
</th>
<th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
Date 
</th>
<th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
Event title
</th>
<th className="py-2 px-4 text-gray-600 text-left text-sm border-b border-gray-200">
Event type
</th>
</tr>
</thead>
</table>
</div>
</div>




</section>
);
}