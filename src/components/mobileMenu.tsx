"use client";
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from 'next/link';
import {sidebarItems, sidebarFootItems} from '@/types';
import {getUserField} from "@/utils/curUser";
//import Image from 'next/image';
import {
LayoutDashboard,
Users,
HelpCircle,
BookOpen,
Trophy, NotebookPen,
BookCheck, LogOut,
} from "lucide-react";

type MenuItem = {
label?: string | React.ReactNode;
href?: string;
icon?: ReactNode; // optional icon (e.g., from lucide-react)
};

interface DrawerProps {
title?: string;
menuItems: MenuItem[];
ctaLabel?: string;
onCtaClick?: () => void;
}
const generateId = () => crypto.randomUUID();
export default function Drawer() {
const [open, setOpen] = useState<boolean>(false);
const pathname = usePathname();
const isHome = pathname === "/"; // check if homepage
const userRole = getUserField<string>("role");

return (
<div>{/* Toggle Button */}
<button
onClick={() => setOpen(true)}
aria-label="Open menu"
className=
{`p-2 bg-transparent pointer rounded-xl transition ${
isHome
? "text-white"
: "text-black "
}`}
>
<Menu className="w-6 h-6 pointer" />
</button>

{/* Overlay */}
{open && (
<div
onClick={() => setOpen(false)}
className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
/>
)}

{/* Drawer */}
<motion.div
initial={{ x: "-100%" }}
animate={{ x: open ? "0%" : "-100%" }}
transition={{ type: "tween", duration: 0.3 }}
className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl p-2 z-50 flex flex-col"
>
{/* Header */}
<div className="flex items-center justify-between mb-4">
<h3 className="text-2xl font-bold text-gray-800">Navigation</h3>
<button
onClick={() => setOpen(false)}
className="p-2 rounded-full hover:bg-gray-100"
aria-label="Close menu"
>
<X className="w-6 h-6 text-gray-700 pointer" />
</button>
</div>

{/* Menu Items */}
<nav className="flex-1 overflow-y-auto px-3">

{sidebarItems.map((item) => {
const isActive = pathname.startsWith(`/user-area/${item.section}`);
const Icon = item.icon;
 const canView = item.section !== "admin-control" || (item.section === "admin-control" &&
 userRole && ["admin", "super_admin"].includes(userRole.toLowerCase()));
return ( canView && (
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
</Link>)
);
})}




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
<span className='pl-3'>{item.name}</span>
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
<section style={{marginBottom: '100px'}}></section>
</nav>
</motion.div>
</div>
);
}
