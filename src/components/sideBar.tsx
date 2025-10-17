"use client";

import Link from "next/link";
import Image from 'next/image';
import { usePathname } from "next/navigation";
//import { useState } from "react";
import {getUserField} from "@/utils/curUser";
import {sidebarItems, sidebarFootItems} from '@/types';
import { LogOut } from "lucide-react";


/*
import {
LayoutDashboard,
Users,
HelpCircle,
BookOpen,
Trophy, NotebookPen,
BookCheck, LogOut,
} from "lucide-react";
*/


export default function Sidebar() {
const userRole = getUserField<string>("role");
const pathname = usePathname();
return (
<aside className="">
<div className="flex flex-col">
{/* Top element */}
<div>


{/* Top element */}
<div className="mb-12">
<Image
src={'/gleenlogo1.webp'}
alt={'Gleen Logo'}
title={'Gleen Logo'}
width={170}
height={80}
style={{ objectFit: 'cover' }}
/>
</div>

<div className="mt-auto">
  {sidebarItems.map((item) => {
    const isActive = pathname.startsWith(`/user-area/${item.section}`);
    const Icon = item.icon;

    const canView =
      (item.section !== "admin-control" && item.section !== "students" && item.section !== "leaderboard") ||
      ((item.section === "admin-control" || item.section === "students" || item.section === "leaderboard") &&
        userRole &&
        ["admin", "super_admin"].includes(userRole.toLowerCase()));

    return (
      canView && (
        <Link
          key={item.section}
          href={`/user-area/${item.section}`}
          className={`flex items-center p-4 rounded-lg font-medium transition-colors ${
            isActive
              ? "def-bg text-white"
              : "g-black hover:bg-[#E1E5F0] p-4"
          }`}
        >
          <Icon className="w-5 h-5" />
          <div className="relative inline-block">
            <span className="pl-3">{item.name}</span>
          </div>
        </Link>
      )
    );
  })}
</div>
</div></div>
</aside>

);
}



export function SideBarFoot() {
const userRole = getUserField<string>("role");
const pathname = usePathname();
return (
<div className="">
<div className="flex flex-col">
{/* Top element */}


{/* Spacer pushes last element down */}
<div className="mt-auto">
{sidebarFootItems.map((item) => {
const isActive = pathname.startsWith(`/user-area/${item.section}`);
const Icon = item.icon;

 const canView = item.section !== "support" || (item.section === "support" &&
 userRole && ["admin", "super_admin"].includes(userRole.toLowerCase()));
return (  canView && (
<Link
key={item.section}
href={`/user-area/${item.section}`}
className={`flex items-center p-4 rounded-lg font-medium transition-colors ${
isActive
? "def-bg text-white"
: "g-black hover:bg-[#E1E5F0] p-4"
}`}
>
<Icon className="w-5 h-5" />
<div className="relative inline-block">
<span className='pl-3'>{item.name}</span>
</div>
</Link>)
);
})}


<Link 
href={`/logout`}
className={`flex hover:bg-[#E1E5F0] items-center p-4 rounded-lg font-medium transition-colors `}
>
<LogOut className="w-5 h-5" />
<span className='pl-3'>Logout</span>
</Link>
</div>
</div>
</div>
);
}