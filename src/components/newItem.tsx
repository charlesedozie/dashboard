"use client";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import FileUpload from "./fileUpload";
import { Timer } from "lucide-react";
import { Editor } from '@tinymce/tinymce-react';
import { InputField, FormValues} from "@/types"; // your type file
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
/*
interface SelectOption {
value: string;
label: string;
}


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
apiType: string;
fields: InputField[];
submitButtonText?: string;
className?: string;
onSuccess?: (data: any) => void; 
updateFormField?: (key: string, value: any) => void;
}


const DynamicForm: React.FC<DynamicFormProps> = ({
apiEndpoint,
apiType,
fields,
submitButtonText = 'Submit',
className = 'space-y-4',
onSuccess,
updateFormField,
}) => {
const { register, handleSubmit, formState: { errors }, setValue, control, getValues, reset } = useForm<FormValues>();
//const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {    updateFormField?.(e.target.name, e.target.value); };

const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
const [resMsg, setResMsg] = useState<string | null>(null);
const [htmlValues, setHtmlValues] = useState<Record<string, string>>({});
const [resStatus, setResStatus] = useState(0);
const { theme } = useTheme();
const isDark = theme === "dark";

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
method: apiType,
headers: {
'Content-Type': 'application/json',             // Specify JSON
'Authorization': `Bearer ${sessionStorage.getItem("token")}` // Add your token
},
body: JSON.stringify(bodyData), // Send plain object as JSON
});
const result = await response.json();
const resText = JSON.stringify(result);
if (!response.ok) {
//setSubmitError(resText);
setResStatus(2);
setResMsg(JSON.stringify(result));
throw new Error(`Failed to submit form: ${JSON.stringify(result)}`);
}


if(Number(result.status) === 500){
const obj = JSON.parse(result.error);
// Safely extract fields
const { error, message, statusCode } = obj.details || {};
setResStatus(2);
setResMsg(message);
return;
}

if(Number(result.status) === 201 || Number(result.status) === 200){
// ✅ Now handle multipleAPI if defined
for (const field of fields) {
if (field.multipleAPI && data[field.name]) {
// Get userId from main form data
const userId = String(result.data.id || ""); // Ensure it's a string
// Split textarea content into array of strings by newline;
// Split textarea content into subjectIds array
const cursubjectIds = String(data[field.name]).split("\n").map((s) => s.trim()).filter((s) => s !== "");

if (userId && cursubjectIds.length > 0) {
const subjectIds = cursubjectIds[0]
.split(",")          // split by comma
.map((s) => s.trim()) // trim spaces (if any)
.filter((s) => s !== ""); // remove empty items

await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${field.multipleAPI}`, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
},
body: JSON.stringify({ userId, subjectIds }),
});
}}}



reset();
setResStatus(1);
setResMsg(result.message);
if (onSuccess) { 
onSuccess(result.data);
}
}
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

useEffect(() => {
const defaults: Record<string, any> = {};
fields.forEach((field) => {
defaults[field.name] = field.defVal ?? "";
});
reset(defaults); // ✅ inject default values into RHF
}, [fields, reset]);

const pathname = usePathname();
return (<section>
{Number(resStatus) === 2 ? <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-3">{resMsg}</div>
: null}
{Number(resStatus) === 1 ? <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3">{resMsg}</div> 
: null}
<form onSubmit={handleSubmit(onSubmit)} className={className} encType="multipart/form-data">
{fields?.map((field) => {
const Wrapper: React.ElementType = field.type === "hidden" ? "span" : "div";

return (
<Wrapper
key={field.name}
className={field.type !== "hidden" ? "flex flex-col" : ""}
>
{field.type !== 'hidden' ?
<label htmlFor={field.name} className="mb-1 font-medium">
{field.label}
{field.required && <span className="text-red-500"> *</span>}
</label> : null}

{field.type === 'textarea' ? (
<textarea
{...register(field.name, { required: field.required ? `${field.label} is required` : false,
onChange: (e) => updateFormField?.(field.name, e.target.value), })}
id={field.name}
placeholder={field.placeholder}
rows={5}
defaultValue={field.defVal ?? ""} // ✅ default value
className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
/>

) : field.type === 'select' ? (
<Controller
name={field.name}
control={control}
defaultValue={
field.multiple
? Array.isArray(field.defVal)
? field.defVal
: typeof field.defVal === "string"
? field.defVal.split(",").map((s) => s.trim())
: []
: field.defVal ?? ""
}
rules={{
required: field.required ? `${field.label} is required` : false,
}}
render={({ field: { onChange, value } }) => (
<select
id={field.name}
multiple={field.multiple}
value={
field.multiple
? (value as string[]) ?? []
: (value as string | number | undefined) ?? ""
}
onChange={(e) => {
const newVal = e.target.value;
//onChange(newVal);
  if (typeof updateFormField === "function") {
updateFormField(field.name, newVal);
  }
onChange(field.multiple ? Array.from(e.target.selectedOptions).map((o) => o.value) : e.target.value
)}
}
className={`pointer border rounded-md p-2 w-full text-sm transition-colors duration-300
${field.className || ""} ${errors[field.name] ? "border-red-500" : isDark ? "bg-gray-800 border-gray-600 text-gray-100 focus:ring-gray-400" : "bg-white border-gray-300 text-gray-800 focus:ring-gray-300"
}`}
>
{!field.multiple && (
<option value="" className={`${isDark ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"}`}>
{field.placeholder || "Select an option"}
</option>
)}
{field.options?.map((option) => (
<option key={option.value} value={option.value} className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}>
{option.label}
</option>
))}
</select>
)}
/>

) : field.type === 'hidden' ? (
<input
{...register(field.name, { required: field.required ? `${field.label} is required` : false, })}
type={field.type}
id={field.name}
defaultValue={field.defVal ?? undefined}
/>
)
: field.type === 'file' || field.type === 'image' || field.type === 'video' ? (
<>
<FileUpload
name={`${field.name}`}
label={field.label}
required={field.required}
accept={field.accept}
register={register}
error={errors[`${field.name}`]?.message as string}
isImage={field.type === "image" ? true : field.type}
defVal={
typeof field.defVal === "string"
? field.defVal
: Array.isArray(field.defVal)
? field.defVal.join(", ")
: undefined
}
{...(field.handleImage ? { onUploadComplete: field.handleImage } : {})} 
setValue={setValue}
/></>
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
onEditorChange={(content) => {
setHtmlValues((prev) => ({ ...prev, [field.name]: content }));
//if (typeof updateFormField === "function") { updateFormField(field.name, content); }
}}
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
{...register(field.name, { required: field.required ? `${field.label} is required` : false,
onChange: (e) => {
  if (typeof updateFormField === "function") {
    updateFormField(field.name, e.target.value);
  }
  }, })}
/>
{option.label}
</label>
))}
</div>
) : (<>

<div className="relative w-full">
<input
{...register(field.name, { required: field.required ? `${field.label} is required` : false,
   ...(updateFormField
            ? {
                onChange: (e) => updateFormField(field.name, e.target.value),
              }
            : {}),  })}
type={field.type}
id={field.name}
placeholder={field.placeholder}
className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
/>{field.name === 'duration' ? <Timer className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> : null}
</div>
</>
)}

{errors[field.name] && <span className="text-red-500 text-sm mt-1">{errors[field.name]?.message}</span>}
</Wrapper>
);})}

<button type="submit" disabled={isSubmitting} className="mt-4 def-bg text-white rounded-xl py-3 px-[1%] sm:px-[2%] md:px-[4%] hover:bg-blue-600 pointer">
{isSubmitting ? 'Submitting...' : submitButtonText}
</button>
</form>
</section>
);
};

export default DynamicForm;
