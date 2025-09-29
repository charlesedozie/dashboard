"use client";

import { useState, DragEvent, ChangeEvent } from "react";

interface FileUploadProps {
name: string;
label: string;
required?: boolean;
accept?: string;
register: any;
error?: string;
isImage?: boolean;
isText?: boolean;
onUploadComplete?: (status: "success" | "error", response: string) => void; // New prop
}

export default function FileUpload({
name,
label,
required,
accept,
register,
error,
isImage = false,
isText = false,
onUploadComplete, // Destructure new prop
}: FileUploadProps) {
const [preview, setPreview] = useState<string | null>(null);
const [isDragging, setIsDragging] = useState(false);
const [uploadProgress, setUploadProgress] = useState<number | null>(null);
const [uploadResponse, setUploadResponse] = useState<string | null>(null);
const [uploadStatus, setUploadStatus] = useState<string | null>(null);

// Upload using XMLHttpRequest
const uploadFile = async (file: File) => {
setUploadProgress(0);
setUploadResponse(null);

const formData = new FormData();
formData.append("file", file);

try {
const response = await fetch('/api/bonny', {
method: 'POST',
body: formData,
});
console.log(response);
if (response.ok) {
console.log('Upload successful!');
} else {
console.log('Upload failed.');
}
} catch (error) {
console.log('Error during upload.');
}


try {

if (!process.env.NEXT_PUBLIC_FILE_API) {
throw new Error("NEXT_PUBLIC_FILE_API environment variable is not defined");
}

const xhr = new XMLHttpRequest();
//xhr.open("POST", process.env.NEXT_PUBLIC_FILE_API);
xhr.open("POST", process.env.NEXT_PUBLIC_FILE_API as string);
// Track upload progress
xhr.upload.onprogress = (event) => {
if (event.lengthComputable) {
const progress = Math.round((event.loaded * 100) / event.total);
setUploadProgress(progress);
}
};

xhr.onload = () => {
if (xhr.status === 200) {
const successMsg = `${xhr.responseText}`;
setUploadResponse(successMsg);
} else {
const errorMsg = `${xhr.statusText}`;
setUploadResponse(errorMsg);
}
setUploadProgress(null);
};

xhr.onerror = () => {
const errorMsg = "Upload failed: Network error";
setUploadResponse(errorMsg);
setUploadProgress(null);
};

xhr.send(formData);
} catch (err: any) {
const errorMsg = `Upload failed: ${err.message}`;
setUploadResponse(errorMsg);
//onUploadComplete?.("error", errorMsg);
setUploadProgress(null);
}};

const obj = JSON.parse(uploadResponse ?? "{}");
//const obj = JSON.parse(uploadResponse);
const filename = JSON.parse(uploadResponse ?? "{}");
//console.log(obj?.data ?? "Default value");
//console.log(obj?.data?.fileName ?? "No file name available");

/*
if (obj?.data?.fileName) {
  onUploadComplete?.(`${process.env.NEXT_PUBLIC_FILE_STORE}/${obj.data.fileName}`);
}


if (obj?.data?.fileName) { onUploadComplete?.( "success",
    `${process.env.NEXT_PUBLIC_FILE_STORE}/${obj.data.fileName}`
  );
} else {
  onUploadComplete?.("error", "File name missing in server response");
}

*/
if(uploadResponse != null && uploadStatus != `${obj.status}: ${obj.message}`)
{setUploadStatus(`${obj.status}: ${obj.message}`);
//onUploadComplete?.(`${process.env.NEXT_PUBLIC_FILE_STORE}/${obj.data.fileName}`); 
//console.log(`${process.env.NEXT_PUBLIC_FILE_STORE}/${obj.data.fileName}`);
//console.log(obj);
}


// Handle file selection
const handleFile = (file: File) => {
if (isImage && file.type.startsWith("image/")) {
const reader = new FileReader();
reader.onload = (e) => setPreview(e.target?.result as string);
reader.readAsDataURL(file);
} else {
setPreview(file.name);
}

uploadFile(file); // Start upload immediately
};

// Drag & Drop
const handleDrop = (e: DragEvent<HTMLDivElement>) => {
e.preventDefault();
setIsDragging(false);
const file = e.dataTransfer.files?.[0];
if (file) handleFile(file);
};

// File dialog change
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (file) handleFile(file);
};

return (
<div className="flex flex-col">
{uploadResponse && (
<div className="mb-2 text-sm text-gray-700 bg-gray-100 p-2 rounded-md">
{uploadStatus == 'success: File uploaded successfully.' ? <div className="flex items-center p-4 mb-4 text-sm text-green-700 bg-green-100 border border-green-300 rounded-lg" role="alert">
  <span className="font-medium">Success!</span> File uploaded successfully.
</div> : null}

{uploadStatus?.toLowerCase().includes("error") ?
  <div className="flex items-center p-4 mb-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg" role="alert">
  <span className="font-medium">{uploadStatus}</span>
</div>
 : null}



</div>
)}

<div
className={`border-2 w-full border-dashed rounded-md p-4 text-center cursor-pointer transition ${
error ? "border-red-500" : isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
}`}
onDragOver={(e) => {
e.preventDefault();
setIsDragging(true);
}}
onDragLeave={() => setIsDragging(false)}
onDrop={handleDrop}
onClick={() => document.getElementById(name)?.click()}
>
{isText ? (
label
) : preview ? (
isImage ? (
<img src={preview} alt="Preview" className="mx-auto max-h-40 object-cover rounded-md" />
) : (
<p className="text-sm">{preview}</p>
)
) : (
<p className="text-gray-500">Drag & drop or click to upload {isImage ? "an image" : "a file"}</p>
)}

<input
{...register(name, {
required: required ? `${label} is required` : false,
})}
type="file"
id={name}
accept={accept || (isImage ? "image/*" : undefined)}
className="hidden"
onChange={handleChange}
/>
</div>

{uploadProgress !== null && (
<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
<div
className="bg-blue-600 h-2 rounded-full transition-all"
style={{ width: `${uploadProgress}%` }}
></div>
</div>
)}

{error && <span className="text-red-500 text-sm mt-1">{error}</span>}
</div>
);
}