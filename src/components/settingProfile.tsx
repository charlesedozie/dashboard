"use client";

import { FProps } from '@/types';
import ItemUpdate from "./itemUpdate";
import SubTitle from "./subTitle";
import { ProfilePicture } from "./forms";  // Assuming this import is correct
import ChangePassword from "./changePassword";
import { Mail, Phone, FolderPen } from "lucide-react";
import { getUser } from "@/utils/curUser";
import { useTheme } from "next-themes";

export default function App(options: FProps) {

const { theme } = useTheme();
const isDark = theme === "dark";
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

return (
<section className='w-full'>
<SubTitle string1='Profile Settings' string2='Manage Personal Information' />
<section className='mt-7 mb-5'>
<ProfilePicture currentImageUrl={
  isValidImageUrl(getUser()?.user?.avatar ?? '')
    ? getUser()?.user?.avatar ?? '/avatar.png' : '/avatar.png'} />
</section>

<section className="flex flex-col sm:flex-row md:justify-between items-center sm:items-start gap-4 mb-5">
<div className="text-left w-full sm:w-auto">
<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4">
<FolderPen className={`${isDark ? "text-white" : "def-color"}`} size={30} />
<div><p className="block font-medium mb-1">Name</p>
<p className="block font-medium mb-1">
<span className={`${isDark ? "block text-xs text-gray-300" : "block text-xs text-gray-500"} transition-colors duration-300`}>Your fullname that is displayed to the students.</span></p></div>
</div></div></div>

<div className="w-full sm:w-auto">
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



<section className="flex flex-col sm:flex-row md:justify-between items-center sm:items-start gap-4 mb-5">
<div className="text-left w-full sm:w-auto">
<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4">
<Mail className={`${isDark ? "text-white" : "def-color"}`} size={30} />
<div><p className="block font-medium mb-1">Email Address</p>
<p className="block font-medium mb-1">
<span className={`${isDark ? "block text-xs text-gray-300" : "block text-xs text-gray-500"} transition-colors duration-300`}>Your primary email for notifications and login</span></p></div>
</div></div></div>

<div className="w-full sm:w-auto">
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

<section className="flex flex-col sm:flex-row md:justify-between items-center sm:items-start gap-4 mb-3">
<div className="text-left w-full sm:w-auto">
<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4">
<Phone className={`${isDark ? "text-white" : "def-color"}`} size={30} />
<div><p className="block font-medium mb-1">
Phone Number
</p>
<p className="block font-medium mb-1">
<span className={`${isDark ? "block text-xs text-gray-300" : "block text-xs text-gray-500"} transition-colors duration-300`}>
Contact number for urgent communications
</span></p></div></div>
</div>
</div>

<div className="w-full sm:w-auto">
<ItemUpdate
apiEndpoint={`user/${getUser()?.user.id || ''}`}
hiddenFields={{ }}
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