"use client";

//import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import Tutors from "./adminTutors";
import AdminContent from "./adminContent";
import AdminMgt from "./adminMgt";
import { useState } from "react";
import {getUserField} from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";

interface Tab {
  name: string;
  content: React.ReactNode;
}

export default function App(options: FProps)  {
const [activeTab, setActiveTab] = useState("Tutor Management");
const userRole = getUserField<string>("role");
const tabs: Tab[] = [
{ name: "Tutor Management", content: <div><Tutors /></div> },
{ name: "Content Control", content: <div><AdminContent /></div> },
{ name: "Transaction Management", content: <div><AdminMgt /></div> },
];
const canView =
  !!userRole && ["admin", "super_admin"].includes(userRole.toLowerCase());

if (!canView) {
  return <AccessDenied />;
}

return (<section className='w-full'>
<div className="flex flex-wrap gap-4">
{/* Left div - fills remaining space */}
<div className="flex-1 min-w-[200px]">
<SubTitle string1='Admin Control' string2='Manage Tutors, Content, and Transactions in One Place' />
</div>

{/* Right div - only as wide as content */}
<div className="w-auto">
<Link
      href="/user-area/dboard?action=create&mod=tutor"
      className="flex items-center space-x-2 cursor-pointer"
    >
<div className="flex items-center space-x-2 cursor-pointer">
  {/* Icon container */}
  <div className="flex items-center justify-center w-12 h-12 def-bg text-white text-3xl rounded-2xl">
    +
  </div>
  
  {/* Text next to icon */}
  <span className="text-[#14265C] text-lg font-medium">Add Account</span>
</div>
</Link>
</div>
</div>




<div className="mt-3 bg-white">
      {/* Tab headers */}
      <div className="flex mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 text-sm font-medium transition pointer ${
              activeTab === tab.name
                ? "border-b-2 rounded-2xl border-[#14265C] text-[#14265C]"
                : "text-gray-500 border-b border-gray-200 hover:text-gray-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 text-sm text-gray-700">
        {tabs.find((tab) => tab.name === activeTab)?.content}
      </div>
    </div>
	
	
</section>
  );
}
