"use client";

import User from "@/components/user";
import Link from "next/link";
import {SearchForm} from "@/components/utils";
import { useState, useEffect } from "react";
import { Bell, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import UserProfilePopup from "./notification";
import {getUserField, getUser} from "@/utils/curUser";
import { Data, ApiResponse, RowsResponse1, RowsResponse , RowsResponse2} from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";

export default function App() {
const [open, setOpen] = useState(false);
const [totalMsg, setTotalMsg] = useState<number>(0);
const pathname = usePathname();
const userRole = getUserField<string>("role");
const { theme } = useTheme();
const isDark = theme === "dark";

console.log('token', sessionStorage.getItem("token"))
//console.log('getUser', getUser())
//console.log('username', sessionStorage.getItem("username"))
//console.log(userRole) pr=9w&2D2

const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse1>>({
  queryKey: ["notification-settings"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse1>>(`notification-settings/user/${getUser()?.user.id}`, {}, 10);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
},
staleTime: 1000 * 60 * 10, // 1 min - keeps cached data fresh for 1 min
refetchOnMount: true,
//refetchOnWindowFocus: true,
});
useEffect(() => {

  if (
  !data?.data || // null or undefined
  (typeof data.data === "object" && Object.keys(data.data).length === 0) // empty object
) {  iniNotification(); } 
}, [data]);

    const iniNotification = async () => {
       const payload = {
          userNotification: false,
          emailNotification: false,
          appNotification: false,
          pushNotification: false,
          soundNotification: false,
          userId: getUser()?.user.id,
        };

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/notification-settings`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (!response.ok) {
          console.error(result?.error || 'Failed to update password. Please try again.');
        } else {
        //  console.log('Password updated successfully');
        }
      } catch (err) {
        console.error('Error:', err);
      } 
    };

 
    

// ✅ helper to check role
function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return ["SUPER_ADMIN"].includes(role.toUpperCase());
}


  // Define routes where SearchForm should appear
  const searchRoutes = [
    "/user-area/students",
    "/user-area/quizzes",
    "/user-area/mock",
    "/user-area/lessons",
    "/user-area/support",
    "/user-area/leaderboard",
    "/user-area/admin-control",
  ];

  
return (
<section className={`p-5 ${isDark ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
<div className={`mb-5 p-4 pl-[1%] sm:pl-[2%] md:pl-[3%] flex items-center justify-between ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
{/* Left: Search bar */}
<div className="flex-1 pr-5">
<div className="hidden lg:block">
{searchRoutes.includes(pathname) && <SearchForm />}
</div>
</div>

{/* Right: Actions */}
<div className="flex items-center gap-6">						
{pathname === "/user-area/dboard" && isAdminRole(userRole) && (
<Link
href="/user-area/dboard?action=create&mod=tutor"
aria-label="Create New User"
title="Create New User"
className="inline-block px-4 py-1 text-orange-500 border border-orange-200 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition"
>
+ New Account
</Link>
)}

<Link
href="/user-area/dboard?action=list&mod=settings" 
aria-label={`Go to Settings Page`}
title={`Go to Settings Page`}
className="inline-block py-1"
><Settings className="cursor-pointer" /></Link>


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
className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
>
{totalMsg}
</span>
)}
</div>
<UserProfilePopup isOpen={open} onClose={() => setOpen(false)} />
<User />
</div>
</div></section>
);
}
