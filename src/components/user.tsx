"use client";
import React, { useState } from "react";
import UserProfilePopup from "./profile";
import Image from "next/image";
import {getUser} from "@/utils/curUser";
import {Data} from "@/types";

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
<div className="relative flex items-center gap-4">
{/* Avatar */}
<div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
{getUser()?.user.avatar ? (
<img
src={getUser()?.user.avatar || ''}
alt={getUser()?.user.fullName || getUser()?.user.username}
width={40}
height={40}
className="rounded-full object-cover pointer"
onClick={() => setOpen(true)}
title={getUser()?.user.fullName || getUser()?.user.username}
/>
) : (
<span className="text-sm font-medium text-gray-600">
<Image
src="/avatar.png"
alt={getUser()?.user.fullName || getUser()?.user.username || ''}
className="w-10 h-10 rounded-full object-cover pointer"
width={48}
height={48}
onClick={() => setOpen(true)}
title={getUser()?.user.fullName || getUser()?.user.username}
/>
</span>
)}
</div>
</div>
<UserProfilePopup isOpen={open} onClose={() => setOpen(false)} />
</>
  );
}
