"use client";

import User from "@/components/user";
import Link from "next/link";
import {SearchForm} from "@/components/utils";
import { Bell, Settings } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import UserProfilePopup from "./notification";


const user = {
name: "Charles Okonkwo",
email: "charles@example.com",
avatar: "https://i.pravatar.cc/150?img=3",
role: "Full Stack Developer",
};

export default function App() {
const [open, setOpen] = useState(false);
const [totalMsg, setTotalMsg] = useState<number>(3);
const pathname = usePathname();
console.log(sessionStorage.getItem("token") || 'No atho')

const userNotification = {
name: "John DNot",
email: "john@example.com",
role: "Admin",
avatar: "https://i.pravatar.cc/150?img=3"
};

return (
<div className="flex items-center justify-between">
{/* Left: Search bar */}
<div className="flex-1 pr-5">
<div className="hidden lg:block">
<SearchForm />
</div>
</div>

{/* Right: Actions */}
<div className="flex items-center gap-6">						
{pathname === "/user-area/dboard" && (
<Link
href="/user-area/dboard?action=create&mod=tutor" 
aria-label={`Go to New Author Page`}
title={`Go to New Author Page`}
className="inline-block px-4 py-1 text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition"
>
+ New Tutor
</Link>
)}

<Link
href="/user-area/dboard?action=list&mod=settings" 
aria-label={`Go to Settings Page`}
title={`Go to Settings Page`}
className="inline-block py-1"
>
<Settings className="cursor-pointer" />
</Link>




<div className="relative inline-block">
{/* Your main element, e.g., an icon */}
<button
onClick={() => setOpen(true)}
className="bg-transparent border-0 shadow-none p-0 m-0 text-inherit focus:outline-none hover:no-underline pointer"
>
<Bell className="cursor-pointer" />
</button>

{/* Badge only if totalMsg > 0 */}
{totalMsg > 0 && (
<span
className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
>
{totalMsg}
</span>
)}
</div>


<UserProfilePopup isOpen={open} onClose={() => setOpen(false)} />
<User />
</div>
</div>
);
}
