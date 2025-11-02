'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, User, Settings } from 'lucide-react';
import Link from 'next/link';
//import Image from 'next/image';
import {
LayoutDashboard,
Users,
HelpCircle,
BookOpen,
Trophy,
BookCheck, LogOut,
} from "lucide-react";

const navItems = [
{ href: '/user-area/dboard', label: 'Dashboard', icon: Home },
{ href: '/user-area/lessons', label: 'Lessons', icon: BookOpen },
{ href: '/user-area/quizzes', label: 'Quiz', icon: BookCheck },
{ href: '/user-area/dboard?action=list&mod=settings', label: 'Settings', icon: Settings }
];

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

export default function MobileNav() {
const [isOpen, setIsOpen] = useState(false);
const pathname = usePathname();

return (
<>
{/* Top Navigation Toggle */}



{/* Dropdown Menu */}
{isOpen && (
<motion.div
initial={{ height: 0 }}
animate={{ height: 'auto' }}
exit={{ height: 0 }}
className="bg-white shadow-md md:hidden overflow-hidden"
>
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

</motion.div>
)}

{/* Bottom Navigation Bar */}
<div className="fixed bottom-0 left-0 w-full bg-white shadow-inner border-t border-gray-200 md:hidden z-50 def-bg text-white">
<div className="flex justify-around items-center py-2">
{navItems.map((item) => (
<Link key={item.href} href={item.href}>
<div className={`flex flex-col items-center ${pathname === item.href ? 'text-white font-semibold' : 'text-white hover:text-blue-600'}`}>
<item.icon className="w-6 h-6" />
<span className="text-xs mt-1">{item.label}</span>
</div>
</Link>
))}
</div>
</div>
</>
);
}