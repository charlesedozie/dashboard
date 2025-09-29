"use client";
import React, { useState } from "react";
import UserProfilePopup from "./profile";
import Image from "next/image";

const user = {
  name: "Charles Okonkwo",
  email: "charles@example.com",
  avatar: "https://i.pravatar.cc/150?img=3",
  role: "Full Stack Developer",
  fullname: "Full Stack Developer",
};

export default function Page() {
  const [open, setOpen] = useState(false);

  return (<>
  
<div className="relative flex items-center gap-4 bg-white">
{/* Avatar */}
<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
{user?.avatar ? (
<img
src={user.avatar}
alt={user.fullname}
width={40}
height={40}
className="rounded-full object-cover"
/>
) : (
<span className="text-sm font-medium text-gray-600">
<img
src="https://i.pravatar.cc/150?img=5"
alt='John Doe'
className="w-10 h-10 rounded-full object-cover"
/>
</span>
)}
</div>

{/* Full name */}
<div className="flex-1 font-medium"><button
onClick={() => setOpen(true)}
className="bg-transparent border-0 shadow-none p-0 m-0 text-inherit focus:outline-none hover:no-underline pointer"
>
{sessionStorage.getItem("username") ? sessionStorage.getItem("username") : 
'John Doe'
}
</button>
</div>
</div>
<UserProfilePopup user={user} isOpen={open} onClose={() => setOpen(false)} />
</>
  );
}
