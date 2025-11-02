"use client";
import { updateInputValue } from "@/utils/updateInputValue";
import { useState, useEffect, DragEvent, ChangeEvent, useRef } from "react";
//import { FilePreview } from "@/utils/getFile";
import { useSearchParams } from "next/navigation";

interface FileUploadProps {
name: string;
label: string;
required?: boolean;
accept?: string;
register: any;
error?: string;
defVal?: string;
isImage?: boolean | string;
isText?: boolean;
onUploadComplete?: (status: "success" | "error", response: string) => void;
setValue: (field: string, value: any, options?: { shouldValidate?: boolean }) => void; 
}

interface Props {
  defVal?: string | null;
}

export default function FileUpload({
name,
label,
required,
accept,
register,
error,
defVal,
isImage = false,
isText = false,
onUploadComplete, 
setValue,
}: FileUploadProps) {
const [preview, setPreview] = useState<string | null>(null);
const [isDragging, setIsDragging] = useState(false);
const [uploadProgress, setUploadProgress] = useState<number | null>(null);
const [uploadResponse, setUploadResponse] = useState<string | null>(null);
const [uploadStatus, setUploadStatus] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement | null>(null);

const searchParams = useSearchParams();
const itemId = searchParams.get("itemId");

useEffect(() => { 
if (!itemId) return; // ✅ only run if itemId param exists
if (defVal && defVal !== preview) { setPreview(defVal); } 
}, [defVal, itemId]); 


// Upload using XMLHttpRequest
const uploadFile = async (file: File) => {
setUploadProgress(0);
setUploadResponse(null);

const formData = new FormData();
formData.append("file", file);

try {
const xhr = new XMLHttpRequest();
xhr.open("POST", process.env.NEXT_PUBLIC_FILE_API || "https://relay.nexoristech.com/temp/upload.php");

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
const responseObj = JSON.parse(xhr.responseText);
if (responseObj?.data?.fileName) { 
onUploadComplete?.("success", `${process.env.NEXT_PUBLIC_FILE_STORE}/${responseObj.data.fileName}` );
let newName = name.replace(/^file_/, '');
updateInputValue(newName, `${process.env.NEXT_PUBLIC_FILE_STORE}/${responseObj.data.fileName}`, setValue);
}

} else {
const errorMsg = `${xhr.statusText}`;
setUploadResponse(errorMsg); }
setUploadProgress(null); };

xhr.onerror = () => {
const errorMsg = "Upload failed: Network error";
setUploadResponse(errorMsg);
setUploadProgress(null);
};

xhr.send(formData);
} catch (err: any) {
const errorMsg = `Upload failed: ${err.message}`;
setUploadResponse(errorMsg);
onUploadComplete?.("error", errorMsg);
setUploadProgress(null);
}
};

useEffect(() => {
  if (!uploadStatus) return;

  const timer = setTimeout(() => {
    setUploadStatus(null);
    setUploadResponse(null);
  }, 3000); // ⏱️ clear after 3 seconds

  return () => clearTimeout(timer); // cleanup on re-render/unmount
}, [uploadStatus]);


useEffect(() => {
  if (!uploadResponse) return;

  try {
    const obj = JSON.parse(uploadResponse);
    if (obj?.data?.fileName) {
      const url = `${process.env.NEXT_PUBLIC_FILE_STORE}/${obj.data.fileName}`;
      onUploadComplete?.("success", url);
    }
    if (uploadStatus !== `${obj.status}: ${obj.message}`) {
      setUploadStatus(`${obj.status}: ${obj.message}`);
    }
  } catch (err) {
    console.error("Invalid JSON:", uploadResponse);
  }
}, [uploadResponse]);


// Handle file selection
const handleFile = (file: File) => {
if (isImage && file.type.startsWith("image/")) {
const reader = new FileReader();
reader.onload = (e) => setPreview(e.target?.result as string);
reader.readAsDataURL(file);
} else { setPreview(file.name); }
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
//onClick={() => document.getElementById(name)?.click()}
onClick={() => fileInputRef.current?.click()}
>{isText ? (
  label
) : preview ? (
  // 👇 Check if isImage is 'video' (case-insensitive) OR the preview URL has a video extension
  (typeof isImage == "string" && isImage.toLowerCase() == "video") ||
  /\.(mp4|webm|ogg)$/i.test(preview) ? (
    <video
      src={preview}
      controls
      className="mx-auto max-h-40 rounded-md"
    />
  ) : isImage ? (
    <img
      src={preview}
      alt="Preview"
      className="mx-auto max-h-40 object-cover rounded-md"
    />
  ) : (
    <p className="text-sm">{preview}</p>
  )
) : (
  <p className="text-gray-500">
    Drag & drop or click to upload{" "}
    {isImage === true
      ? "an image"
      : typeof isImage === "string" && isImage.toLowerCase() === "video"
      ? "a video"
      : "a file"}
  </p>
)}


<input
{...register(name, {
required: required ? `${label} is required` : false,
})}
type="file"
id={name}
accept={accept || (isImage ? "image/*,video/*" : undefined)}
className="hidden"
onChange={handleChange}
ref={fileInputRef}
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