"use client";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import FileUpload from "./fileUpload";
import { Timer } from "lucide-react";

interface SelectOption {
value: string;
label: string;
}

interface InputField {
name: string;
label: string;
type: 'text' | 'hidden' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'image' | 'radio';
placeholder?: string;
required?: boolean;
className?: string;
defVal?: string | null;
options?: SelectOption[]; // For select/radio inputs
accept?: string; // For file/image inputs
handleImage?: (status: "success" | "error", response: string) => void; // Add this line
}

interface DynamicFormProps {
apiEndpoint: string;
fields: InputField[];
submitButtonText?: string;
className?: string;
}

interface FormValues {
[key: string]: string | number | File;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
apiEndpoint,
fields,
submitButtonText = 'Submit',
className = 'space-y-4',
}) => {
const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

// Log whenever either state changes
useEffect(() => {
console.log("submitError:", submitError);
}, [submitError]);

useEffect(() => {
console.log("submitSuccess:", submitSuccess);
}, [submitSuccess]);

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


// Prepare data to send
const bodyData: Record<string, any> = {};
Object.entries(data).forEach(([key, value]) => {
if (value instanceof File) {
// If you want to send files, you'll need FormData separately
// For traditional key:value JSON, skip files or handle separately
} 
else {
if (value === 'bolTrue') bodyData[key] = true;
else if (value === 'bolFalse') bodyData[key] = false;
else bodyData[key] = value;
}
});

console.log(apiEndpoint);
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',             // Specify JSON
'Authorization': `Bearer ${sessionStorage.getItem("token")}` // Add your token
},
body: JSON.stringify(bodyData), // Send plain object as JSON
});

const result = await response.json();
const errorText = JSON.stringify(result);
if (!response.ok) {
setSubmitError(errorText);
setSubmitError("errorText");
console.log(errorText);
throw new Error(`Failed to submit form: ${errorText}`);
}



console.log("errorText 1111");
setSubmitSuccess(errorText);
console.log(errorText);
//reset();
console.log(result);
} catch (error) {
  // Handle different error types safely
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  setSubmitError(message);
  console.log(message);
}
 finally {
setIsSubmitting(false);
}
};

return (<section>
{submitError ? <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-800 px-4 py-3">
  <strong className="font-semibold">Error!</strong> Something went wrong. Please try again.
</div>
 : null}
{submitSuccess ? <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-800 px-4 py-3">
  <strong className="font-semibold">Success!</strong> Your action was completed successfully.
</div> 
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
  className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
/>

) : field.type === 'select' ? (
<select
{...register(field.name, { required: field.required ? `${field.label} is required` : false })}
id={field.name}
defaultValue=""
className={`border rounded-md p-2 ${field.className || ''} ${errors[field.name] ? 'border-red-500' : 'border-gray-300'}`}
>
<option value="" disabled>{field.placeholder || 'Select an option'}</option>
{field.options?.map((option) => (
<option key={option.value} value={option.value}>{option.label}</option>
))}
</select>
) : field.type === 'hidden' ? (
<input
{...register(field.name, { required: field.required ? `${field.label} is required` : false })}
type={field.type}
id={field.name}
defaultValue={field.label}
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
) : field.type === 'radio' ? (
<div className="flex gap-4">
{field.options?.map((option) => (
<label key={option.value} className="flex items-center gap-2">
<input
type="radio"
value={option.value}
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

{submitSuccess && <p className="mt-2 text-green-500">{submitSuccess}</p>}
{submitError && <p className="mt-2 text-red-500">{submitError}</p>}
</form>
</section>
);
};

export default DynamicForm;
