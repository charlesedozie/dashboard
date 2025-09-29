"use client";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import FileUpload from "./fileUpload";
import { Timer } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import { InputField } from "@/types"; // your type file


interface SelectOption {
value: string;
label: string;
}

/*
interface InputField {
  name: string;
  label: string;
  type: 'text' | 'hidden' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'image' | 'radio' | 'html';
  placeholder?: string;
  required?: boolean;
  className?: string;
  defVal?: string | null;
  options?: SelectOption[];
  multiple?: boolean;
  accept?: string;
  handleImage?: (status: "success" | "error", response: string) => void;
  multipleAPI?: string;
}
*/

interface DynamicFormProps {
apiEndpoint: string;
fields: InputField[];
submitButtonText?: string;
className?: string;
onSuccess?: (data: any) => void; 
}

interface FormValues {
[key: string]: string | number | File;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
apiEndpoint,
fields,
submitButtonText = 'Submit',
className = 'space-y-4',
onSuccess,
}) => {
const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
const [resMsg, setResMsg] = useState<string | null>(null);
const [htmlValues, setHtmlValues] = useState<Record<string, string>>({});
const [resStatus, setResStatus] = useState(0);

// Log whenever either state changes
//useEffect(() => { console.log("submitError:", submitError); }, [submitError]);
//useEffect(() => { console.log("submitSuccess:", submitSuccess); }, [submitSuccess]);

const onSubmit: SubmitHandler<FormValues> = async (data) => {
setIsSubmitting(true);
setSubmitError(null);
setSubmitSuccess(null);

try {
	/*
const formData = new FormData();
Object.entries(data).forEach(([key, value]) => {
if (value instanceof File) {
formData.append(key, value);
} else {
formData.append(key, String(value));
}
});
*/

const bodyData: Record<string, any> = {};
// Handle normal fields
Object.entries(data).forEach(([key, value]) => {
  if (Array.isArray(value)) {
    bodyData[key] = value;
  } else if (value instanceof File) {
    // handle file uploads separately
  } else {
    if (value === 'bolTrue') bodyData[key] = true;
    else if (value === 'bolFalse') bodyData[key] = false;
    else bodyData[key] = value;
  } });

// ✅ Merge HTML editor values
Object.entries(htmlValues).forEach(([key, value]) => {
  bodyData[key] = value;
});

 // Main form submit
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',             // Specify JSON
'Authorization': `Bearer ${sessionStorage.getItem("token")}` // Add your token
},
body: JSON.stringify(bodyData), // Send plain object as JSON
});
//console.log(bodyData);
const result = await response.json();
//const obj = JSON.parse(result);
//console.log(result);
//const resText = JSON.stringify(result);
//console.log(resText);
if (!response.ok) {
//setSubmitError(resText);
setResStatus(2);
setResMsg(JSON.stringify(result));
throw new Error(`Failed to submit form: ${JSON.stringify(result)}`);
}

//console.log(result);
//setSubmitSuccess(errorText);

//console.log(result.status);
//console.log(result.message);
if(Number(result.status) === 500){
const obj = JSON.parse(result.error);
// Safely extract fields
const { error, message, statusCode } = obj.details || {};
setResStatus(2);
setResMsg(message);
}

if(Number(result.status) === 201){
// ✅ Now handle multipleAPI if defined
for (const field of fields) {
if (field.multipleAPI && data[field.name]) {
// Get userId from main form data
const userId = String(result.data.id || ""); // Ensure it's a string
// Split textarea content into array of strings by newline
//const items = String(data[field.name]).split("\n").map(s => s.trim()).filter(s => s !== "");
//console.log(items);
//console.log(`${process.env.NEXT_PUBLIC_API_BASE}/${field.multipleAPI}`);

console.log(userId);

// Split textarea content into subjectIds array
const cursubjectIds = String(data[field.name]).split("\n").map((s) => s.trim()).filter((s) => s !== "");

if (userId && cursubjectIds.length > 0) {
console.log('posting subjects');
//console.log(subjectIds.length);

const subjectIds = cursubjectIds[0]
  .split(",")          // split by comma
  .map((s) => s.trim()) // trim spaces (if any)
  .filter((s) => s !== ""); // remove empty items


//console.log(subjectIds);
//console.log(userId);
//console.log(`${process.env.NEXT_PUBLIC_API_BASE}/${field.multipleAPI}`);
//console.log(JSON.stringify({ userId, subjectIds }))


await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${field.multipleAPI}`, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
},
body: JSON.stringify({ userId, subjectIds }),
});
}}}




setResStatus(1);
setResMsg(result.message);
if (onSuccess) { 
onSuccess(result.data.id);
console.log('result');
console.log(result.data.id);
}
}
/*
console.log(result.error);
*/
// Parse string to JSON object
//const obj = JSON.parse(result.error);
// Safely extract fields
//const { error, message, statusCode } = obj.details || {};
//console.log(result.status);
//console.log(result.message);

/*
console.log(`error: ${error}`);       // "Bad Request"
console.log(`message: ${message}`);     // "Email is already taken"
console.log(`statusCode: ${statusCode}`);  // 400
console.log(result);

*/








//reset();
} catch (error) {
  // Handle different error types safely
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  setSubmitError(message);
}
 finally {
setIsSubmitting(false);
}
};

return (<section>
{Number(resStatus) === 2 ? <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-3">{resMsg}</div>
 : null}
{Number(resStatus) === 1 ? <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3">{resMsg}</div> 
: null}
<form onSubmit={handleSubmit(onSubmit)} className={className} encType="multipart/form-data">
{fields.map((field) => (
<div
  key={field.name}
  className={`flex flex-col ${field.type === "hidden" ? "hidden" : ""}`}
>
{field.type !== 'hidden' ?
<label htmlFor={field.name} className="mb-1 font-medium">
{field.label}
{field.required && <span className="text-red-500"> *</span>}
</label> : null}

{field.type === 'textarea' ? (
<textarea
  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
  id={field.name}
  placeholder={field.placeholder}
  rows={5}
  defaultValue={field.defVal ?? ""} // ✅ default value
  className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
/>

) : field.type === 'select' ? (
  <><select
  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
  id={field.name}
  multiple={field.multiple}
  defaultValue={
    field.multiple
      ? Array.isArray(field.defVal)
        ? field.defVal // Use array if provided
        : typeof field.defVal === 'string' && field.defVal
        ? field.defVal.split(',').map((s) => s.trim()) // Convert comma-separated string to array
        : [] // Fallback to empty array
      : field.defVal ?? '' // Single select: use defVal or empty string
  }
  className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
>
  {!field.multiple && (
    <option value="" disabled>
      {field.placeholder || 'Select an option'}
    </option>
  )}
  {field.options?.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select></>
) : field.type === 'hidden' ? (
<input
{...register(field.name, { required: field.required ? `${field.label} is required` : false })}
type={field.type}
id={field.name}
defaultValue={field.defVal ?? ""} 
/>
)
 : field.type === 'file' || field.type === 'image' ? (
<FileUpload
name={field.name}
label={field.label}
required={field.required}
accept={field.accept}
register={register}
error={errors[field.name]?.message as string}
isImage={field.type === "image"}
onUploadComplete={field.handleImage}
/>
) : field.type === 'html' ? (
<Editor
  apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY} // Free key from TinyMCE Cloud
  initialValue={
    Array.isArray(field.defVal)
      ? field.defVal.join(", ")
      : field.defVal ?? ""
  } // ✅ TinyMCE default
  init={{
    height: 400,
    menubar: true, // Show full menu bar for maximum free features
    plugins: [
      'advlist',        // Advanced lists
      'autolink',       // Auto links
      'lists',          // Bullet & numbered lists
      'link',           // Hyperlinks
      'image',          // Basic image insert
      'charmap',        // Special characters
      'preview',        // Preview content
      'anchor',         // Anchors/bookmarks
      'searchreplace',  // Search and replace
      'visualblocks',   // Show block elements
      'code',           // Source code editing
      'fullscreen',     // Fullscreen mode
      'insertdatetime', // Date/time insert
      'media',          // Audio/video embed
      'table',          // Tables
      'help',           // Help dialog
      'wordcount',      // Word count
      'emoticons',      // Emojis
      'directionality', // RTL/LTR text
      'quickbars',      // Quick toolbar when selecting text
      'autoresize',     // Auto-resizing editor height
    ],
    toolbar: `
      undo redo | blocks | bold italic underline strikethrough forecolor backcolor | 
      alignleft aligncenter alignright alignjustify | 
      bullist numlist outdent indent | table image media link emoticons charmap | 
      insertdatetime | removeformat code fullscreen preview | searchreplace help
    `,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    contextmenu: 'link image table', // Right-click menu
    branding: false // Hide "Powered by Tiny" logo
  }}
  onEditorChange={(content) => setHtmlValues((prev) => ({ ...prev, [field.name]: content }))}
 />

)
: field.type === 'radio' ? (
<div className="flex gap-4">
{field.options?.map((option) => (
<label key={option.value} className="flex items-center gap-2">
<input
type="radio"
value={option.value}
defaultChecked={field.defVal === option.value} // ✅ default checked
{...register(field.name, { required: field.required ? `${field.label} is required` : false })}
/>
{option.label}
</label>
))}
</div>
) : (<>

<div className="relative w-full">
<input
{...register(field.name, { required: field.required ? `${field.label} is required` : false })}
type={field.type}
id={field.name}
placeholder={field.placeholder}
defaultValue={field.defVal ?? ""} 
className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
/>{field.name === 'duration' ? <Timer className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> : null}
</div>
</>
)}

{errors[field.name] && <span className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</span>}
</div>
))}

<button type="submit" disabled={isSubmitting} className="mt-4 def-bg text-white rounded-xl py-3 px-[1%] sm:px-[2%] md:px-[4%] hover:bg-blue-600 pointer">
{isSubmitting ? 'Submitting...' : submitButtonText}
</button>
</form>
</section>
);
};

export default DynamicForm;
