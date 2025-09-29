"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import ItemUpdate from "./itemUpdate";
import SubTitle from "./subTitle";
import { ProfilePicture, EmailUpdate } from "./forms";  // Assuming this import is correct
import ChangePassword from "./changePassword";
import { Mail, Phone, FolderPen } from "lucide-react";

export default function App(options: FProps) {
const handleEmailUpdate = (newEmail: string) => {
console.log("Updated Email:", newEmail);
// Call your API endpoint here, e.g.
// await fetch("/api/update-email", { method: "POST", body: JSON.stringify({ email: newEmail }) });
};

return (
<section className='w-full'>
<SubTitle string1='Profile Settings' string2='Manage Personal Information' />
<section className='mt-7'>
<ProfilePicture 
currentImageUrl="/default-avatar.png"
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
apiEndpoint="/api/submit-feedback"
hiddenFields={{ userId: "123", category: "general" }}
label=""
placeholder="Enter Your Name"
defaultValue=""
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
apiEndpoint="/api/submit-feedback"
hiddenFields={{ userId: "123", category: "general" }}
label=""
placeholder="Enter Email Address"
defaultValue=""
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
</span>
</p>

</div>
</div>
<span className="text-gray-700 text-sm mt-1"></span>
</div>

{/* Right: Input + Button */}
<div className="flex items-center gap-2 flex-1 justify-end">
<ItemUpdate
apiEndpoint="/api/submit-feedback"
hiddenFields={{ userId: "123", category: "general" }}
label=""
placeholder="Enter Phone Number"
defaultValue=""
/>
</div>
</section>

<section className='mt-7'>
<ChangePassword />
</section>
</section>
);
}