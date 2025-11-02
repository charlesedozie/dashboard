"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types'; 
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import ActionDropdown from "./dropDown";
import PageTitle from "./subTitle";
import { UserPlus } from "lucide-react";
import { Wallet } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";


// Create 12 sample requests
const requests = Array.from({ length: 12 }, (_, i) => ({
id: i + 1,
title: "New Withdrawal Request",
description: "₦5,000 withdrawal requested by Student123",
time: "Just now",
}));

export default function App() {
const { theme } = useTheme();
const isDark = theme === "dark";
return (
<section>
<section><PageTitle string1='Notifications' /></section>
<section className='px-[1%] sm:px-[2%] md:px-[4%]'>
{requests?.map((request) => (		
<div key={request.id} className="flex justify-between p-2 mt-4 mb-10 rounded-lg shadow border border-gray-200">
{/* Left side: icon + text */}
<div className="flex flex-1 min-w-0 items-start gap-1">
{/* Icon container */}
<div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0">
<Wallet size={20} className={`${isDark ? "text-white" : "text-gray-600"} transition-colors duration-300`} />
</div>
{/* Text content */}

<div className="min-w-0">
<h3 className="font-bold text-lg truncate">New Withdrawal Request
</h3>
<p className={`${isDark ? "text-white" : "text-gray-600"} text-sm truncate transition-colors duration-300`}>
₦5,000 withdrawal requested by Student123 
</p></div></div>

{/* Right side: only as wide as content */}
<div className={`flex-shrink-0 text-sm ${isDark ? "text-white" : "text-gray-500"} text-right whitespace-nowrap ml-4`}>
<span className={`bg-[#69BF6F] inline-block w-2 h-2 rounded-full mr-2 `} />
Just now
</div>
</div>
))}







</section>
</section>
);
}
