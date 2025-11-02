"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import Link from 'next/link';
import { SquareCheckBig, Plus, TextAlignStart, Book } from "lucide-react";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { fetchData } from "@/utils/fetchData";
import FileUpload from "./fileUpload";
import { useForm } from "react-hook-form";
import { Subject, InputField, Data, ApiResponse, RowsResponse1, RowsResponse2, RowsResponse } from "@/types";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {AccessDenied} from "@/components/utils";
import ShowQuestion from "@/components/showQuestion";
import Delete from "@/components/deleteButton";
import { useTheme } from "next-themes";
import {getUserProperty, getUserField, getUser} from "@/utils/curUser";

type FormFields = {
key: string;
value: any;
};

export default function CreateMock() {
const router = useRouter();
const [loadingQS, setLoadingQS] = useState(false);
const [subjects, setSubjects] = useState<Subject[]>([]);
const [mockTypes, setMockTypes] = useState<Subject[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [avatar, setAvatar] = useState<string | null>('null');
const [active, setActive] = useState(0);
const [mockId, setMockId] = useState<string>("");
const refs = useRef<(HTMLButtonElement | null)[]>([null, null]);
const [viewState, setViewState] = useState(false);
const { register, handleSubmit, formState: { errors } } = useForm();
const [formField, setFormField] = useState<FormFields[] | null>(null);
const [curMock, setCurMock] = useState<RowsResponse2 | null>(null);
const [curQuestions, setCurQuestions] = useState<RowsResponse | null>(null);
const [questionAvatar, setQuestionAvatar] = useState<string | null>('null');
const [message, setMessage] = useState<string | null>(null);
const hasRefetched = useRef(false);

const [deleteItem, setDeleteItem] = useState<any | null>(null); 
const [deleteMock, setDeleteMock] = useState<any | null>(null); 
const [curItemTitle, setCurItemTitle] = useState(''); 
const searchParams = useSearchParams();
const pathname = usePathname();
const userRole = getUserField<string>("role");

// State variables
const [formData, setFormData] = useState({
textValue: "",
selectedValue: "MULTIPLE_CHOICE",
selectedAnswer: "",
});

const itemId = searchParams.get("itemId") ?? null;
const title = searchParams.get("title") ?? null;
const description = searchParams.get("description") ?? null;
const subjectIdURL = searchParams.get("subjectId") ?? null;
const action = searchParams.get("action");
const avatarOrCover = searchParams.get("avatarOrCover");
const mod = searchParams.get("mod");
const instructions = searchParams.get("instructions");
const duration = searchParams.get("duration");
const mockTypeId = searchParams.get("mockTypeId");
const { theme } = useTheme();
const isDark = theme === "dark";

const currentMockId = itemId || "";

interface Option {
title: string;
image: string | null;
}

interface QuizPayload {
mockExamId: string;
question: string;
type: string;
correctAnswer: string;
explanation: string;
userId: string;
status: 'PENDING' | 'APPROVED' | 'REJECTED';
file: string;
options: Option[];
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const shouldFetch = useMemo( () => action === "update" && mod === "mock" && itemId && uuidRegex.test(itemId), [action, mod, itemId] );


const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse>>({
queryKey: ["mocktypes"],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>("mock-types", {}, 100);
if (!response) {
throw new Error("No data returned from lessons endpoint");
}
return response;
},
staleTime: 60 * 5 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

const {
data: dataCurQuestions,
isLoading: loadingCurQuestions,
refetch: refetchCurQuestions,
} = useQuery({
queryKey: ["curQuestions", currentMockId], // 👈 include quizId here
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>(
`mock-questions?mockExamId=${currentMockId}`,
{},
100
);
if (response?.data) {
return response.data;
}
return null;
},
// enabled: !!(shouldFetch && currentQuizId), // 👈 only run when valid
// staleTime: 1000 * 5, // 5 seconds cache
});

// optional: to manually trigger refetch on route param changes
useEffect(() => {
if (shouldFetch && currentMockId) {
refetchCurQuestions();
}
}, [currentMockId, shouldFetch, refetchCurQuestions]);

useEffect(() => { if (dataCurQuestions) { 
setCurQuestions(dataCurQuestions); }}, [dataCurQuestions]);


//interface Props { data: Data; }
useEffect(() => {
if (data?.data?.rows?.length) {

const newArray = [...data.data.rows].map(item => ({
label: String(item.title ?? ""),
value: String(item.id ?? ""),
}));
const sortedArray = newArray.sort((a, b) =>
a.label.localeCompare(b.label)
);   
if(mockTypes !== sortedArray){setMockTypes(sortedArray);}

/*
const sorted = [...data.data.rows].sort((a, b) => {
const dateA = new Date(a.updatedAt || 0).getTime();
const dateB = new Date(b.updatedAt || 0).getTime();
return dateB - dateA; // ✅ Descending order
});
if(mockTypes !== sorted){setMockTypes(sorted);}
*/
} 
}, [data]);

const tabs = ["Mock Information", "Questions"];
// Sample options for the dropdown
const options = [
{ value: "MULTIPLE_CHOICE", label: "Multi choice", icon: Book },
{ value: "THEORY", label: "Theory", icon: Book },
];
const [selectedType, setSelectedType] = useState(options[0]);
const [open, setOpen] = useState(false);

const handleSelect = (option: any) => {
setSelectedType(option);
setOpen(false);
};

// Update only the image for a specific option
const handleImageChange = (index: number, newImage: string | null) => {
setTexts((prev) => {
const updated = [...prev];
updated[index] = { ...updated[index], image: newImage };
return updated;
});
};

// Handle textarea input change
const handleTextChangeTArea = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
setFormData({ ...formData, selectedAnswer: e.target.value });
};

/*
// Handle text input change
const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setFormData({ ...formData, textValue: e.target.value });
};
*/
function updateQuestionAvatar(status: string, msg: string): void {
if (status === "success") {
if(questionAvatar !== msg){setQuestionAvatar(msg)}
} else { console.error("Avatar update failed:", msg); }}

// Handle text input change
const handleTextChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
setFormData({ ...formData, textValue: e.target.value });
};

const handleDelete = (id: string, title: string) => {
setCurItemTitle(title);
setDeleteItem(id);
};

const handleDeleteSuccess = (id: string) => {
setCurQuestions((prev: any) => ({
...prev,
rows: prev.rows.filter((q: Data) => q.id !== id),
}));
};

useEffect(() => {
async function loadSubject() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("subjects");
const userSubjects = getUser()?.user.subjects || [];
if (data?.data) {
// Extract user subject IDs for easier comparison
const userSubjectIds = userSubjects.map((s: any) => String(s.id));
// Filter subjects to include only those in userSubjects
const filteredSubjects = data.data.filter((item: any) =>
userSubjectIds.includes(String(item.id))
);

const newArray = filteredSubjects.map(item => ({
label: String(item.title ?? ""),
value: String(item.id ?? ""),
}));
const sortedArray = newArray.sort((a, b) =>
a.label.localeCompare(b.label)
);
if(subjects !== sortedArray){setSubjects(sortedArray);}          
}
} catch (error) {
console.error("Error fetching data:", error);
}
}

loadSubject();
}, [pathname, searchParams]); // 👈 runs again when route or URL params change



useEffect(() => {
async function loadMock() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("movk-types");
if (data?.data) {
const newArray = data.data.map(item => ({
label: String(item.title ?? ""),
value: String(item.id ?? ""),
}));
const sortedArray = newArray.sort((a, b) =>
a.label.localeCompare(b.label)
);

if(mockTypes !== sortedArray){setMockTypes(sortedArray);}          
}
} catch (error) {
console.error("Error fetching data:", error);
}
}

loadMock();
}, [pathname, searchParams]); // 👈 runs again when route or URL params change

interface RadioTextInputsProps {
itemsCount?: number;
}

const handleUpdateClick = (action: string) => {
if (action === "addQuestion") {
alert("Adding a new question...");
// Put your "Add Question" code here
} else if (action === "editQuestion") {
alert("Editing the question...");
// Put your "Edit Question" code here
} else {
alert("Unknown action: " + action);
}
};

// Handle dropdown select change
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
setFormData({ ...formData, selectedValue: e.target.value });
};
const itemsCount = 4;

// State for radio selection and text values
const [selected, setSelected] = useState<number | null>(null);
const [texts, setTexts] = useState<{ title: string; image: string | null }[]>(
Array.from({ length: itemsCount }, (_, i) => ({
title: `Option ${i + 1}`,
image: null,
}))
);


function handleSetval(){  }
// Update only the title for a specific option
const handleTitleChange = (index: number, newTitle: string) => {
setTexts((prev) => {
const updated = [...prev];
updated[index] = { ...updated[index], title: newTitle };
return updated;
});
};


const [editable, setEditable] = useState<boolean[]>(Array(itemsCount).fill(false));
// Handle radio change
const handleRadioChange = (index: number) => {
setSelected(index);
};

const getFormFieldValue = (fields: FormFields[] | null, key: string): any => {
if (!fields) return null;
const found = fields.find((item) => item.key === key);
return found ? found.value : null;
};

const coalesce = (val: string | null | undefined): string | null =>   val != null && val !== '' && val !== 'null' ? val : null;

// ✅ Update or add key-value pair
const updateFormField = (key: string, value: any) => {
setFormField((prev) => {
if (!prev) return [{ key, value }];
// Check if key exists
const existingIndex = prev.findIndex((item) => item.key === key);
if (existingIndex !== -1) {
// ✅ Update value
const updated = [...prev]; updated[existingIndex] = { key, value }; return updated;
} else {
// ✅ Add new key-value pair
return [...prev, { key, value }]; }});};

// Toggle edit mode on double click
const handleDoubleClick = (index: number) => {
const updated = [...editable];
updated[index] = true;
setEditable(updated);
};

// Blur to disable edit mode
const handleBlur = (index: number) => {
const updated = [...editable];
updated[index] = false;
setEditable(updated);
};

function returnHome(){
router.push(`/user-area/mock`);
}

const toggleSwitch = () => {
setViewState((prev) => !prev);
};



const handleSubmitQuestion = async () => {
try {
setLoadingQS(true);
setMessage(null);

const data: QuizPayload = {
mockExamId: itemId || '',
userId: getUser()?.user.id || '',
question: formData.textValue,
type: (formData.selectedValue).toUpperCase() ,
correctAnswer: (formData.selectedValue == 'THEORY') ? formData.selectedAnswer : (selected !== null ? (texts[selected].title) : "") ,
file: questionAvatar ?? '',
explanation: "",
status:'PENDING',
options: [],
};


// Merge texts array into the options before sending
const payload: QuizPayload = {
...data,
options: texts,
};

// ✅ Convert to form-urlencoded
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/mock-questions`, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
},
body: JSON.stringify(payload), // ✅ send full object as JSON
});


if (!response.ok) {
const errText = await response.text();
console.error("🟥 API Error Details:", {
status: response.status,
statusText: response.statusText,
body: errText,
});
setMessage(`❌ Error: ${response.status} ${response.statusText} || "Unknown error"}`);
throw new Error(`API Error: ${response.status} ${response.statusText}`);
}
const result = await response.json();

if (response.ok) {
// return result;
if (!hasRefetched.current) {await refetchCurQuestions();
setTimeout(() => (hasRefetched.current = false), 4000);
}

setTimeout(() => (resetQuizQuestion()), 1000);
}

} catch (error: any) {
console.error("Submit error:", error);
setMessage(`❌ Request failed: ${error.message}`);
} finally {
setLoadingQS(false);
}
};


// ✅ Reset quiz question form
const resetQuizQuestion = () => {
// Reset text fields
setFormData({
textValue: "",
selectedValue: "MULTIPLE_CHOICE",
selectedAnswer: "",
});

// Reset selected radio option
setSelected(null);

// Reset question image
setQuestionAvatar(null);

// Reset multiple-choice options
setTexts(
Array.from({ length: itemsCount }, (_, i) => ({
title: `Option ${i + 1}`,
image: null,
}))
);

// Optional: reset editable states
setEditable(Array(itemsCount).fill(false));

// Optional: clear success/error message
setMessage(null);
};


function updateAvatar(status: string, msg: string): void {
if (status === "success") {
if(avatar !== msg){setAvatar(msg)}
} else { console.error("Avatar update failed:", msg); }}

const formFields: InputField[] =  [
{
name: 'mockTypeId',
label: 'Type of Mock Exam',
type: 'select',
required: true,
className: 'w-full',
options: mockTypes,
defVal: coalesce(getFormFieldValue(formField, "mockTypeId") ) ?? coalesce(curMock?.mockTypeId) ?? coalesce(mockTypeId) ?? "",
},
{
name: 'subjectId',
label: 'Mock Subject',
type: 'select',
required: true,
className: 'w-full',
options: subjects,
defVal:coalesce(getFormFieldValue(formField, "subjectId") ) ?? coalesce(curMock?.subjectId) ?? coalesce(subjectIdURL) ?? "",
},
{
name: 'title',
label: 'Mock Title',
type: 'text',
placeholder: 'Enter title',
required: true,
className: 'w-full',
defVal:coalesce(getFormFieldValue(formField, "title") ) ?? coalesce(curMock?.title) ?? coalesce(title) ?? "",
},
{
name: 'description',
label: 'Mock Description',
type: 'textarea',
placeholder: 'Enter Description',
required: true,
className: 'w-full',
defVal:coalesce(getFormFieldValue(formField, "description") ) ?? coalesce(curMock?.description) ?? coalesce(description) ?? "",
},{
name: 'instructions',
label: 'Mock Instructions',
type: 'text',
placeholder: 'Enter Instruction',
required: true,
className: 'w-full',
defVal:coalesce(getFormFieldValue(formField, "instructions") ) ?? coalesce(curMock?.instructions) ?? coalesce(instructions) ?? "",
},{
name: 'duration',
label: 'Mock Duration (Minutes)',
type: 'number',
placeholder: '20',
required: true,
className: 'w-full',
defVal:coalesce(getFormFieldValue(formField, "duration") ) ?? coalesce(curMock?.duration) ?? coalesce(duration) ?? "",
},
{
name: 'avatar',
label: 'Upload Mock Image',
type: 'image',
required: true,
className: 'w-full',
defVal: coalesce(avatar) ?? coalesce(getFormFieldValue(formField, "avatar")) ?? coalesce(curMock?.avatar) ?? coalesce(avatarOrCover) ?? "",
handleImage:updateAvatar,
}
,
{
name: 'userId',
label: getUserProperty("id") ?? "",
type: 'hidden',
required: false,
className: 'w-full',
defVal: getUserProperty("id"),
},
];

const shouldShowQuestions = String(itemId ?? "").trim() !== "";
const canView = !!userRole && ["tutor"].includes(userRole.toLowerCase());
if (!canView) { return <AccessDenied />; }
return (
<div className="p-4">
<div className="flex justify-between items-center w-full">
<div><SubTitle string1={itemId ? 'Update Mock Exam' : 'New Mock Exam'} /></div>
<div>
{itemId && action === 'update' ? <TrashIcon
onClick={() => setDeleteMock(itemId)}
className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
/> : null}</div>
</div>






<div className="mt-8">
<div
role="tablist"
aria-label="Example Tabs"
className="flex items-center justify-between"
>
{/* Left group */}<div className="flex">
{[0, 1].map((i) => {
// Hide button when i === 1 and showQuestion is false
if (i === 1 && !shouldShowQuestions) return null;

return (
<button
key={tabs[i]}
ref={(el) => {
refs.current[i] = el;
}}
role="tab"
aria-selected={active === i}
tabIndex={active === i ? 0 : -1}
onClick={() => setActive(i)}
className={`px-6 py-4 text-base font-medium ${
active === i
? "text-white bg-[#14265C] pointer"
: "text-gray-900 bg-[#78B3FF33] pointer"
}`}
>
{tabs[i]}
</button>
);
})}
</div>
</div>
</div>









<div>
<div className="p-4 py-8">
<div role="tabpanel" aria-hidden={active !== 0} className={active === 0 ? "" : "hidden"}>
<DynamicForm 
apiType={itemId ? `PUT` : `POST`}
key={`mock${pathname}`} 
apiEndpoint={itemId ? `mock-exams/${itemId}` : `mock-exams`}
fields={formFields}
submitButtonText={action === "update" ? "Update Mock Information" : "Save"}
className="space-y-6"
updateFormField={updateFormField}
onSuccess={(data) => { returnHome(); }}
/>
</div>


<div role="tabpanel" aria-hidden={active !== 1} className={active === 1 ? "" : "hidden"}>










{shouldShowQuestions && (
<div className="w-full p-3 mb-6">
<div className="overflow-x-auto">
<table className="w-full border-collapse text-gray-500">
<thead className={`sticky top-0 z-10 ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<tr>
<th className="py-2 text-left text-sm">S/N</th>
<th className="py-2 text-left text-sm">Question</th>
<th className="py-2 text-left text-sm">Answer</th>
<th className="py-2 text-left text-sm">Type</th>
<th className="py-2 text-center text-sm">Actions</th>
</tr></thead>


<tbody>
{curQuestions?.rows?.map((tutor, index) => (
<tr key={tutor.id || index} className={`border-b p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<td className="py-3 text-sm align-top">{index + 1}</td>
<td className="py-3 text-sm align-top">{tutor.question || "N/A"}</td>
<td className="py-3 text-sm align-top">{tutor.correctAnswer || "N/A" }</td>
<td className="py-3 text-sm align-top">{tutor.type || "N/A"}</td>
<td className="py-3 text-center text-sm align-top">
<div className="flex items-center justify-center gap-2">
<ShowQuestion
triggerIcon={<EyeIcon className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />}
question={tutor.question || ''}
answer={tutor.correctAnswer || ''}
type={`${tutor.type}` || "N/A"}
avatar={tutor.file || ''}
options={tutor.options || []}
/>
<Link 
href={{
pathname: "/user-area/mock",
query: { action: "update", mod: "question", mockId:itemId, itemId:tutor.id, questionId:tutor.id, question: tutor.question ?? "", answer: tutor.correctAnswer ?? "", type: tutor.type ?? "", avatar: tutor.file ?? "", options: JSON.stringify(tutor.options) ?? "", returnURL: `mock?action=update&mod=mock&itemId=${itemId}&subjectId=${subjectIdURL}&title=${title}&description=${description}&avatarOrCover=${avatarOrCover}&instructions=${instructions}&duration=${duration}&mockTypeId=${mockTypeId}` },
}}
aria-label={`Go to edit Page`}
title={`Go to edit Page`}
className="def-link-style"
><PencilIcon
className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
</Link>
<TrashIcon 
onClick={() => { handleDelete(tutor.id || '', tutor.question || '')}}
className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
/>
</div>
</td>
</tr>
))}
</tbody>



</table>
</div>
</div>
)}

















<div className="grid grid-cols-1 sm:grid-cols-[50%_23%_23%] gap-5">
<div>{/* Text Input */}
<label className='font-bold' htmlFor='quizQuestion'>Enter Question <span className="text-red-500"> *</span></label><br />     
<textarea
placeholder="Enter Question"
value={formData.textValue}
onChange={handleTextChange}
rows={2}
className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
/>
</div>


<div className="flex flex-col items-center justify-center space-y-3">
{(questionAvatar && questionAvatar !== null && questionAvatar !== 'null') && (
<img
src={questionAvatar}
alt="Question Cover Image"
className="w-30 h-30 rounded object-cover"
/>
)}

<FileUpload
name="uploadQuestionCover"
label="Insert Image"
isImage={true}
isText={true}
register={register} // Pass register correctly
error={errors.myFile?.message as string | undefined}
setValue={handleSetval}
onUploadComplete={updateQuestionAvatar}
/>
</div>
<div>
{/* Dropdown Select */}
<label className='font-bold' htmlFor='quizQuestion'>Question Type</label> <span className="text-red-500"> *</span><br />
<select
value={formData.selectedValue}
onChange={handleSelectChange}
className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
>
{options.map((option) => (
<option key={option.value} value={option.value}>
{option.label}
</option>
))}
</select>
</div>
</div>

{formData.selectedValue === 'THEORY' ? 
<section className='my-8'>
<textarea
placeholder="Theory answer"
value={formData.selectedAnswer}
onChange={handleTextChangeTArea}
rows={3}
className="w-full px-3 py-2 border-b rounded-md focus:outline-none focus:ring focus:border-blue-500"
/>
</section> : null}
{formData.selectedValue === 'MULTIPLE_CHOICE' ? <section className='my-8'>





{texts.map((opt, index) => (
<section
key={index}
className="flex justify-between mb-5 pb-2 font-bold items-center"
>
{/* Left side: radio + text */}
<section className="flex-1 flex items-center space-x-3">
{/* Radio Button */}
<input
type="radio"
name="options"
checked={selected === index}
onChange={() => handleRadioChange(index)}
className="w-4 h-4 text-blue-600 focus:ring-blue-500"
/>

{/* Text Input */}
<input
type="text"
value={opt.title}
readOnly={!editable[index]}
onDoubleClick={() => handleDoubleClick(index)}
onBlur={() => handleBlur(index)}
onChange={(e) => handleTitleChange(index, e.target.value)}
className="flex-1 px-3 py-1 border-b border-gray-300 focus:outline-none focus:border-blue-500"
/>
</section>

{/* Right side: image upload */}
<section className="flex items-center space-x-3">
<FileUpload
name={`optionImage${index}`}
label="Insert Image"
isImage={true}
isText={true}
register={register}  // Pass register correctly
error={errors.myFile?.message as string | undefined}
// Add a custom callback when upload succeeds
setValue={handleSetval}
onUploadComplete={(status, url) => {
if (status === "success") {
handleImageChange(index, url); // updates your local state array
} else {
console.error("Upload failed:", url);
}
}}
/>

{/* Show thumbnail if uploaded */}
{opt.image && (
<img
src={opt.image}
alt={`Option ${index + 1}`}
className="w-10 h-10 rounded object-cover"
/>
)}
</section>
</section>
))}
</section> : null}

{(selected !== null && formData.textValue != null && formData.textValue != '' && formData.selectedValue == 'MULTIPLE_CHOICE') || (formData.selectedValue == 'THEORY' && formData.selectedAnswer != null && formData.selectedAnswer != '') ? <button 
onClick={handleSubmitQuestion}
disabled={loadingQS}
className={`text-white transition mt-4 rounded-xl py-3 px-[2%] sm:px-[2%] md:px-[8%] ${
loadingQS ? "bg-gray-400 cursor-not-allowed" : "def-bg pointer"
}`} type="button">{loadingQS ? "Uploading..." : "Upload"}</button> : null}

{message && (
<p
className={`text-sm ${
message.startsWith("✅") ? "text-green-600" : "text-red-600"
}`}
>
{message}
</p>
)}
</div>
</div>
</div>


{/* Delete Mock */}
{deleteMock && (
<Delete
apiUrl={`mock-exams/${itemId}`}
title={`Delete Mock: ${getFormFieldValue(formField, "title") ?? title ?? ""}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteMock}
returnURL={`/user-area/mock?deleteId=${itemId}`}
onClose={() => setDeleteMock(null)}
//onSuccess={() => handleDeleteSuccess(deleteItem.id)}
/>
)}

{/* Delete Question */}
{deleteItem && (
<Delete
apiUrl={`mock-questions/${deleteItem}`}
title={`Delete Mock Question: ${curItemTitle ?? ""}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteItem}
onClose={() => setDeleteItem(null)}
onSuccess={() => handleDeleteSuccess(deleteItem)}
/>
)}
</div>
);
};