"use client";

import Link from "next/link";
import Image from 'next/image';
import { usePathname } from "next/navigation";
import {
LayoutDashboard,
Users,
HelpCircle,
BookOpen,
Trophy,
BookCheck, LogOut,
} from "lucide-react";

const sidebarItems = [
{ name: "Dashboard", section: "dboard", icon: LayoutDashboard },
{ name: "Students", section: "students", icon: Users },
{ name: "Quizzes", section: "quizzes", icon: BookCheck },
{ name: "Lessons", section: "lessons", icon: BookOpen },
{ name: "Leaderboard", section: "leaderboard", icon: Trophy },
];

const sidebarFootItems = [
{ name: "Support", section: "support", icon: HelpCircle },
];



export default function Sidebar() {
const pathname = usePathname();

return (
<div className="">
<div className="flex flex-col">
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

{/* Middle element */}
<div>
<div className="mt-auto">
{sidebarItems.map((item) => {
const isActive = pathname.startsWith(`/user-area/${item.section}`);
const Icon = item.icon;
return (
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
<span className='pl-3'>{item.name}</span>
</Link>
);
})}
</div>
</div>
</div>
</div>
);
}



export function SideBarFoot() {
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
return (
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
<span className='pl-3'>{item.name}</span>
</Link>
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