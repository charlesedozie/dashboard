"use client";
import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ItemUpdate from "./itemUpdate";
import { Mail, Phone, FolderPen } from "lucide-react";

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
// console.log('new res', response.body)
console.log("Server Response:", result); // ✅ Log full response object
console.log("Server Status:", result.status); // ✅ Log full response object
console.log("Server Status:", result.message); // ✅ Log full response object
console.log("Server Status:", result.data.filePath); // ✅ Log full response object


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
className="flex items-center justify-between bg-white"
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
className="block text-xs text-gray-700 pointer"
/></section>
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
className="bg-[#C4E9FD] font-medium text-sm px-4 py-2 rounded-3xl pointer hover:bg-blue-200 disabled:opacity-50"
>
{isSubmitting ? "Updating" : "Update"}
</button>
</form>
);
}

/*
export function EmailUpdate({
currentEmail,
label,
tagLine,
onSubmitEmail,
inputType,
icon,
}: EmailUpdateFormProps) {
const [loading, setLoading] = useState(false);
const {
register,
handleSubmit,
formState: { errors },
} = useForm<FormValues>({
defaultValues: { email: currentEmail },
});




const onSubmit = async (data: FormValues) => {
setLoading(true);
if (data.email) {
await onSubmitEmail(data.email);
} else {
console.error("Email is missing!");
}
setLoading(false);
};




type IconMap = {
[key: string]: ReactElement; // ✅ Use ReactElement instead of JSX.Element
};

const icons: IconMap = {
mail: <Mail className="def-color" size={30} />,
phone: <Phone className="def-color" size={30} />,
name: <FolderPen className="def-color" size={30} />,
};

const IconToRender = icons[icon ?? ""] || icons.mail;

return (
<section
className="flex items-center gap-4 bg-white"
>

<div className="flex-1 flex flex-col gap-1">
<div className="flex gap-4">{IconToRender}
<div>{label ? <p className="block font-medium text-gray-800 mb-1">
{label}
</p> : null}
{label ? <p className="block font-medium text-gray-800 mb-1">
<span className="block text-xs text-gray-500">
{tagLine}
</span>
</p> : null}

</div>
</div>
<span className="text-gray-700 text-sm mt-1"></span>
</div>


<div className="flex items-center gap-2 flex-1 justify-end">

<ItemUpdate
apiEndpoint="/api/submit-feedback"
hiddenFields={{ userId: "123", category: "general" }}
label=""
placeholder="Type your feedback here"
defaultValue="This is prefilled text"
/>
</div>
</section>
);
}



*/