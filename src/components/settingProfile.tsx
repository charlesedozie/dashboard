"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import ItemUpdate from "./itemUpdate";
import SubTitle from "./subTitle";
import { ProfilePicture } from "./forms";  // Assuming this import is correct
import ChangePassword from "./changePassword";
import { Mail, Phone, FolderPen } from "lucide-react";
import { getUser } from "@/utils/curUser";

export default function App(options: FProps) {
//const handleEmailUpdate = (newEmail: string) => {
//console.log("Updated Email:", newEmail);
// Call your API endpoint here, e.g.
// await fetch("/api/update-email", { method: "POST", body: JSON.stringify({ email: newEmail }) });
//};


function isValidImageUrl(url?: string): boolean {
if (!url) return false;
// Check if it's an absolute or relative image URL
const imagePattern = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
try {
// ✅ Try constructing a URL (works for absolute URLs)
new URL(url);
return imagePattern.test(url);
} catch {
// ✅ Also allow relative URLs like "/uploads/avatar.jpg"
return imagePattern.test(url);
}}

console.log('getUser', getUser()?.user.fullName || '')
console.log('getUser', getUser()?.user.id || '')
console.log('getUser avatar', getUser()?.user.avatar || '/avatar.png')
return (
<section className='w-full'>
<SubTitle string1='Profile Settings' string2='Manage Personal Information' />
<section className='mt-7'>
<ProfilePicture currentImageUrl={
  isValidImageUrl(getUser()?.user?.avatar ?? '')
    ? getUser()?.user?.avatar ?? '/avatar.png'
    : '/avatar.png'
}
 />
</section>

<section className="mt-7 flex items-center gap-4 bg-white">
{/* Left: Icon + Label + Description + Current Email */}
<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4"><FolderPen className="def-color" size={30} />
<div><p className="block font-medium text-gray-800 mb-1">Name</p>
<p className="block font-medium text-gray-800 mb-1">
<span className="block text-xs text-gray-500">Your fullname that is displayed to the students.
</span></p>
</div></div>
<span className="text-gray-700 text-sm mt-1"></span>
</div>

{/* Right: Input + Button */}
<div className="flex items-center gap-2 flex-1 justify-end">
<ItemUpdate
apiEndpoint={`user/${getUser()?.user.id || ''}`}
hiddenFields={{}}
label=""
placeholder="Enter Your Name"
defaultValue={getUser()?.user.fullName || 'Enter Your Name'}
name='fullName'
btnValue='Update'
/>
</div>
</section>

<section className="mt-7 flex items-center gap-4 bg-white">
{/* Left: Icon + Label + Description + Current Email */}
<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4"><Mail className="def-color" size={30} />
<div><p className="block font-medium text-gray-800 mb-1">Email Address</p>
<p className="block font-medium text-gray-800 mb-1">
<span className="block text-xs text-gray-500">
Your primary email for notifications and login</span></p>
</div></div>
<span className="text-gray-700 text-sm mt-1"></span>
</div>

{/* Right: Input + Button */}
<div className="flex items-center gap-2 flex-1 justify-end">
<ItemUpdate
apiEndpoint={`user/${getUser()?.user.id || ''}`}
hiddenFields={{}}
label=""
placeholder="Enter Email Address"
defaultValue={getUser()?.user.email || 'Enter Email Address'}
name='email'
btnValue='Update'
/>
</div>
</section>

<section className="mt-7 flex items-center gap-4 bg-white"
>
{/* Left: Icon + Label + Description + Current Email */}
<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4"><Phone className="def-color" size={30} />
<div><p className="block font-medium text-gray-800 mb-1">
Phone Number
</p>
<p className="block font-medium text-gray-800 mb-1">
<span className="block text-xs text-gray-500">
Contact number for urgent communications
</span></p></div></div>
<span className="text-gray-700 text-sm mt-1"></span>
</div>

{/* Right: Input + Button */}
<div className="flex items-center gap-2 flex-1 justify-end">
<ItemUpdate
apiEndpoint={`user/${getUser()?.user.id || ''}`}
hiddenFields={{ role: "TUTOR" }}
label=""
placeholder="Enter Phone Number"
defaultValue={getUser()?.user.phone || 'Enter Phone Number'}
btnValue='Update'
name="phone"
/>
</div>
</section>

<section className='mt-7'>
<ChangePassword />
</section>
</section>
);
}