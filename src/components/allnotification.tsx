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

// Create 12 sample requests
const requests = Array.from({ length: 12 }, (_, i) => ({
id: i + 1,
title: "New Withdrawal Request",
description: "₦5,000 withdrawal requested by Student123",
time: "Just now",
}));

export default function App() {

return (
<section className='bg-white'>
<section><PageTitle string1='Notifications' /></section>

<section className='px-[1%] sm:px-[2%] md:px-[4%]'>
{requests?.map((request) => (		
<div key={request.id} className="flex justify-between p-2 mt-4 mb-10 bg-white rounded-lg shadow border border-gray-200">
{/* Left side: icon + text */}
<div className="flex flex-1 min-w-0 items-start gap-1">
{/* Icon container */}
<div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0">
<Wallet size={20} className="text-gray-700" />
</div>
{/* Text content */}

<div className="min-w-0">
<h3 className="font-bold text-lg truncate">
<Link
href="/user-area/dboard?action=details&mod=notification&itemId=sfsfs" 
aria-label={`Go to New Withdrawal Request Page`}
title={`Go to New Withdrawal Request Page`}
className="def-link-style"
>New Withdrawal Request</Link>
</h3>
<p className="text-sm text-gray-600 truncate">
₦5,000 withdrawal requested by Student123 
</p></div></div>

{/* Right side: only as wide as content */}
<div className="flex-shrink-0 text-sm text-gray-500 text-right whitespace-nowrap ml-4">
<span
className="inline-block w-2 h-2 rounded-full mr-2 bg-[#69BF6F]" />
Just now
</div>
</div>
))}







</section>
</section>
);
}
