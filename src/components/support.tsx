"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types'; 
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import LinkList from "./linkList";
import SupportComplaint from "./supportComplaint";
import SupportFAQ from "./supportFAQ";
import DefaultView from "./supportComplaint";
import SubTitle from "./subTitle";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";


const links = [
{ label: "Complaints", href: "/user-area/support" },
{ label: "FAQ", href: "/user-area/support?action=list&mod=support&sub=faq" },
];

const sampleFAQs = Array.from({ length: 30 }, (_, i) => ({
  question: `Question ${i + 1}`,
  answer: `This is the answer for question ${i + 1}.`,
}));

export default function Support(options: FProps)  {
const searchParams = useSearchParams();
const sub = searchParams.get("sub");

// Map each sub value to a component
const componentsMap: Record<string, React.ReactNode> = {
//const componentsMap: Record<string, JSX.Element> = {
complaint: <SupportComplaint />,
faq: <SupportFAQ faqs={sampleFAQs} itemsPerPage={10} />,
};

// Pick the right component or fall back to default
const RenderedComponent = useMemo(() => {
return componentsMap[sub ?? ""] || <DefaultView />;
}, [sub]);


return (<section className='w-full'><section className='mb-10'>
<SubTitle string1='Support' />
</section>
<div className="grid grid-cols-1 sm:grid-cols-[25%_72%] gap-6">
<div className="bg-white p-2">
<section className='font-semibold mb-4'>Support Menu</section>
<section><LinkList items={links} /></section>
</div>
<div className="bg-white p-2">
{RenderedComponent}
</div>
</div>

</section>
);
}
