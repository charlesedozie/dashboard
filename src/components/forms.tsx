"use client";
import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
//import ItemUpdate from "./itemUpdate";
//import { Mail, Phone, FolderPen } from "lucide-react";
import { useTheme } from "next-themes";

type FormValues = {
profilePicture?: FileList;
email?: string;
};

interface ProfilePictureFormProps {
currentImageUrl: string;
uid?: string;
}

interface EmailUpdateFormProps {
currentEmail: string;
currentValue?: string;
label?: string;
icon?: string;
tagLine?: string;
inputType?: string;
onSubmitEmail: (email: string) => Promise<void> | void;
}

export function ProfilePicture({
currentImageUrl,
uid = "default-uid",
}: ProfilePictureFormProps) {
const [preview, setPreview] = useState<string>(currentImageUrl);
const [uploadStat, setUploadStat] = useState('');

const { theme } = useTheme();
const isDark = theme === "dark";
let userDetails = JSON.parse(sessionStorage.getItem("user") || "{}");
const {
register,
handleSubmit,
formState: { errors, isSubmitting },
} = useForm<FormValues>();


const onSubmit = async (data: FormValues) => {
if (!data.profilePicture || data.profilePicture.length === 0) return;

const formData = new FormData();
formData.append("file", data.profilePicture[0]);
try {
const response = await fetch(process.env.NEXT_PUBLIC_FILE_API || "https://relay.nexoristech.com/temp/upload.php", {
method: "POST",
body: formData,
});

const result = await response.json(); // ✅ Parse JSON response



if (!response.ok) throw new Error("Upload failed");
const payload = {
avatar: `${process.env.NEXT_PUBLIC_FILE_STORE}/${(result.data.filePath).replace("uploads/", "")}`,
};
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/${userDetails.user.id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
},
body: JSON.stringify(payload),
});




setUploadStat(`<div class="p-4 mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
<span class="font-medium text-xs">Profile picture updated! Might take effect at the next login</span>
</div>`);
// ✅ Hide message after 10 seconds
setTimeout(() => setUploadStat(""), 10000);
} catch (err) {
console.error(err);
setUploadStat(`<div class="p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
<span class="font-medium text-xs">Error uploading profile picture.!</span>
</div>`);
// ✅ Hide message after 10 seconds
setTimeout(() => setUploadStat(""), 10000);
}
};

return (
<form
onSubmit={handleSubmit(onSubmit)}
className="flex items-center justify-between"
>
{/* Left side: Current profile picture & upload */}
<div className="flex flex-col items-start gap-2">
<div className="flex items-center gap-4">
<div><img
src={preview}
alt="Current Profile"
className="w-20 h-20 rounded-full object-cover border border-gray-300"
/></div>

<div>
<p>Profile Picture </p>
<section className='g-orange text-xs'>JPG, GIF or PNG. 1MB max.</section>
<section>
<input
type="file"
accept="image/*"
{...register("profilePicture", {
required: "Please select a profile picture",
})}
onChange={(e) => {
if (e.target.files?.[0]) {
setPreview(URL.createObjectURL(e.target.files[0]));
}
}}
className={`block text-xs pointer ${isDark ? "text-gray-200" : "text-gray-700"} h-full transition-colors duration-300`}/></section>
</div>
</div>

{/* Error message below upload input */}
<section dangerouslySetInnerHTML={{ __html: uploadStat }} />
{errors.profilePicture && (
<p className="text-red-500 text-sm mt-1">
{errors.profilePicture.message}
</p>
)}
</div>

{/* Right side: Submit button */}
<button
type="submit"
disabled={isSubmitting}
className={`${isDark ? "bg-[#C4E9FD] font-medium text-sm px-4 py-2 rounded-3xl pointer hover:bg-blue-200 disabled:opacity-50  text-gray-900" : "bg-[#C4E9FD] font-medium text-sm px-4 py-2 rounded-3xl pointer hover:bg-blue-200 disabled:opacity-50"} transition-colors`}>
{isSubmitting ? "Updating" : "Update"}
</button>
</form>
);
}
