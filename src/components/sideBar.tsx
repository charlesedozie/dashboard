"use client";

import Link from "next/link";
import Image from 'next/image';
import { usePathname } from "next/navigation";
import {getUserField} from "@/utils/curUser";
import {sidebarItems, sidebarFootItems} from '@/types';
import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";

export default function Sidebar() {
  const userRole = getUserField<string>("role");
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const logoSrc = isDark ? "/logowhite.webp" : "/gleenlogo1.webp";

  return (
    <aside
      className={`w-full md:w-[250px] flex flex-col justify-between p-4 
      ${isDark ? "bg-black text-white" : "bg-white text-black"} 
       transition-colors duration-300`}
    >
      {/* Top Section */}
      <div>
        <div className="mb-12">
          <Image
            src={logoSrc}
            alt="Gleen Logo"
            title="Gleen Logo"
            width={170}
            height={80}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Optional middle content */}
         
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
? isDark
  ? "bg-gray-800 text-white"
  : "def-bg text-white"
: isDark
? "hover:bg-gray-800 text-gray-300"
: "hover:bg-[#E1E5F0] text-black"
}`}
>
<Icon className="w-5 h-5" />
<span className="pl-3">{item.name}</span>
</Link>

)
);
})}   
</div>
</aside>
  );
}



export function SideBarFoot() {
const userRole = getUserField<string>("role");
const pathname = usePathname();
const { theme } = useTheme();
const isDark = theme === "dark";
return (
<div>
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
? isDark
  ? "bg-gray-800 text-white"
  : "def-bg text-white"
: isDark
? "hover:bg-gray-800 text-gray-300"
: "hover:bg-[#E1E5F0] text-black"
}`}
>
<Icon className="w-5 h-5" />
<span className="pl-3">{item.name}</span>
</Link>
)
);
})}

<Link 
href={`/logout`}
className={`flex hover:bg-[#E1E5F0] ${isDark ? "bg-black text-white" : "bg-white text-black"} items-center p-4 rounded-lg font-medium transition-colors `}
>
<LogOut className="w-5 h-5" />
<span className='pl-3'>Logout</span>
</Link>
</div>
</div>
</div>
);
}