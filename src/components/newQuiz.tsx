"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import Link from 'next/link';
import { SquareCheckBig, Plus, TextAlignStart, Book } from "lucide-react";
import { fetchData } from "@/utils/fetchData";
import FileUpload from "./fileUpload";
import { useQuery } from "@tanstack/react-query";
import Delete from "@/components/deleteButton";
import { useForm } from "react-hook-form";
import { Subject, Data, ApiResponse, InputField, RowsResponse2, RowsResponse } from "@/types";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {getUserField, getUser} from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import ShowQuestion from "@/components/showQuestion";
import { useTheme } from "next-themes";

type FormFields = {
key: string;
value: any;
};

interface TextItem {
title: string;
content?: string;
}

export default function CreateQuiz() {
const searchParams = useSearchParams();
const [subjects, setSubjects] = useState<Subject[]>([]);
const [loading, setLoading] = useState(true);
const [loadingQS, setLoadingQS] = useState(false);
const [error, setError] = useState<string | null>(null);
//const [avatarURL, setAvatarURL] = useState<string | null>('null');
const [active, setActive] = useState(0);
const [quizId, setQuizId] = useState<string>("");
const refs = useRef<(HTMLButtonElement | null)[]>([null, null]);
const [viewState, setViewState] = useState(false);
const { register, handleSubmit,  setValue,  formState: { errors } } = useForm();
const router = useRouter();
const [formField, setFormField] = useState<FormFields[] | null>(null);
const [curQuiz, setCurQuiz] = useState<RowsResponse2 | null>(null);
const [avatar, setAvatar] = useState<string | null>('null');
const [questionAvatar, setQuestionAvatar] = useState<string | null>('null');
const [message, setMessage] = useState<string | null>(null);
const [curQuestions, setCurQuestions] = useState<RowsResponse | null>(null);
const [deleteItem, setDeleteItem] = useState<any | null>(null); 
const [curItemTitle, setCurItemTitle] = useState(''); 
const itemId = searchParams.get("itemId") ?? '';
const title = searchParams.get("title") ?? null;
const description = searchParams.get("description") ?? null;
const subjectIdURL = searchParams.get("subjectId") ?? null;
const action = searchParams.get("action");
const avatarOrCover = searchParams.get("avatarOrCover");
const mod = searchParams.get("mod");
const instructions = searchParams.get("instructions");
const duration = searchParams.get("duration");
const pathname = usePathname();
const userRole = getUserField<string>("role");
const hasRefetched = useRef(false);
// optional: if itemId comes from route or URL params
const params = useSearchParams();
const currentQuizId = itemId || params.get("quizId") || "";
const [deleteQuiz, setDeleteQuiz] = useState<any | null>(null); 


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



const { theme } = useTheme();
const isDark = theme === "dark";

interface Option {
  title: string;
  image: string | null;
}

interface QuizPayload {
  quizId: string;
  question: string;
  type: string;
  correctAnswer: string;
  explanation: string;
  userId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  file: string;
  options: Option[];
}


// State variables
const [formData, setFormData] = useState({
textValue: "",
selectedValue: "MULTIPLE_CHOICE",
selectedAnswer: "",
});
const shouldShowQuestions = String(itemId ?? "").trim() !== "";
const tabs = ["Quiz Information", "Questions"];
// Sample options for the dropdown
const options = [
{ value: "MULTIPLE_CHOICE", label: "Multi Choice", icon: Book },
{ value: "THEORY", label: "Theory", icon: Book },
];
const [selectedType, setSelectedType] = useState(options[0]);
const [open, setOpen] = useState(false);

const handleSelect = (option: any) => {
setSelectedType(option);
setOpen(false);
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
// Handle text input change
const handleTextChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
setFormData({ ...formData, textValue: e.target.value });
};

useEffect(() => {
async function loadSubjects() {
try {
const data = await fetchData<ApiResponse<Data[]>>("subjects");
const userSubjects = getUser()?.user.subjects || [];
if (data?.data) {
// Extract user subject IDs for easier comparison
const userSubjectIds = userSubjects.map((s: any) => String(s.id));
// Filter subjects to include only those in userSubjects
const filteredSubjects = data.data.filter((item: any) =>
userSubjectIds.includes(String(item.id))
);

const getSubjects = filteredSubjects.map((item: any) => ({
value: item.id,
label: item.title,
}));
setSubjects(getSubjects);
}} 
catch (error) { console.error("Error fetching dashboard data:", error); }}
loadSubjects(); }, [pathname, searchParams]);

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

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const shouldFetch = useMemo( () => action === "update" && mod === "quiz" && itemId && uuidRegex.test(itemId), [action, mod, itemId] );










const {
    data: dataCurQuestions,
    isLoading: loadingCurQuestions,
    refetch: refetchCurQuestions,
  } = useQuery({
    queryKey: ["curQuestions", currentQuizId], // 👈 include quizId here
    queryFn: async () => {
      const response = await fetchData<ApiResponse<RowsResponse>>(
        `quiz-questions?quizId=${currentQuizId}`,
        {},
        100
      );
      if (response?.data) {
        return response.data;
      }
      return null;
    },
//staleTime: 10 * 1000, // 10 seconds
refetchOnMount: false,
refetchOnWindowFocus: false,
  });

  // optional: to manually trigger refetch on route param changes
  useEffect(() => {
    if (shouldFetch && currentQuizId) {
      refetchCurQuestions();
    }
  }, [currentQuizId, shouldFetch, refetchCurQuestions]);


useEffect(() => { if (dataCurQuestions) { 
setCurQuestions(dataCurQuestions); }}, [dataCurQuestions]);














const [editable, setEditable] = useState<boolean[]>(Array(itemsCount).fill(false));

// Handle radio change
const handleRadioChange = (index: number) => { setSelected(index); };

const { data, isLoading } = useQuery<RowsResponse2 | null>({
queryKey: ["quizCur", quizId],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse2>>(`lessons/${itemId}`, {}, 100 );
if (response?.data) { return response.data; } return null; },
enabled: !!shouldFetch,
});

useEffect(() => { if (data) { setCurQuiz(data);  }}, [data]);
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

//const toggleSwitch = () => { setViewState((prev) => !prev); };
const getFormFieldValue = (fields: FormFields[] | null, key: string): any => {
if (!fields) return null;
const found = fields.find((item) => item.key === key);
return found ? found.value : null;
};

function updateAvatar(status: string, msg: string): void {
if (status === "success") {
if(avatar !== msg){setAvatar(msg)}
} else { console.error("Avatar update failed:", msg); }}

function updateQuestionAvatar(status: string, msg: string): void {
if (status === "success") {
if(questionAvatar !== msg){setQuestionAvatar(msg)}
} else { console.error("Avatar update failed:", msg); }}

// Helper function to get the first non-null, non-undefined, non-empty string value
const coalesce = (val: string | null | undefined): string | null =>   val != null && val !== '' && val !== 'null' ? val : null;

const formFields: InputField[] =  [
{
name: 'subjectId',
label: 'Quiz Subject',
type: 'select',
required: true,
className: 'w-full',
options: subjects,
defVal: coalesce(getFormFieldValue(formField, "subjectId")) ?? coalesce(curQuiz?.subjectId) ?? coalesce(subjectIdURL) ?? "",
},
{
name: 'title',
label: 'Quiz Title',
type: 'text',
placeholder: 'Enter topic',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(formField, "title")) ?? coalesce(curQuiz?.title) ?? coalesce(title) ?? "",
},
{
name: 'description',
label: 'Quiz Description',
type: 'textarea',
placeholder: 'Enter Description',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(formField, "description")) ?? coalesce(curQuiz?.description) ?? coalesce(description) ??"",
},{
name: 'instructions',
label: 'Quiz Instructions',
type: 'text',
placeholder: 'Enter Instruction',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(formField, "instructions")) ?? coalesce(curQuiz?.instructions) ?? coalesce(instructions) ?? "",
},{
name: 'duration',
label: 'Quiz Duration (Minutes)',
type: 'number',
placeholder: '20',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(formField, "duration")) ?? coalesce(curQuiz?.duration) ?? coalesce(duration) ?? "",
},
{
name: 'avatar',
label: 'Upload Quiz Image',
type: 'image',
required: true,
className: '',
defVal:  coalesce(avatar) ?? coalesce(avatarOrCover) ?? coalesce(curQuiz?.avatar) ?? coalesce(getFormFieldValue(formField, "avatar")) ?? "",
handleImage:updateAvatar,
},
];

const topicFields: InputField[] = [
{
name: 'avatarOrCover',
label: 'Insert image',
type: 'image',
required: false,
className: 'w-200',
},
];


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

function returnHome(){
router.push(`/user-area/quizzes`);
}


// Update only the title for a specific option
const handleTitleChange = (index: number, newTitle: string) => {
setTexts((prev) => {
const updated = [...prev];
updated[index] = { ...updated[index], title: newTitle };
return updated;
});
};

// Update only the image for a specific option
const handleImageChange = (index: number, newImage: string | null) => {
setTexts((prev) => {
const updated = [...prev];
updated[index] = { ...updated[index], image: newImage };
return updated;
});
};

function handleSetval(){  }
const handleSubmitQuestion = async () => {
  try {
    setLoadingQS(true);
    setMessage(null);

  const data: QuizPayload = {
    quizId: itemId,
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


const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/quiz-questions`, {
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
      setMessage("✅ Submitted successfully!");
      
   // return result;
   if (!hasRefetched.current) {await refetchCurQuestions();
    setTimeout(() => (hasRefetched.current = false), 4000);
    setTimeout(() => (setMessage(null)), 2000);
    setTimeout(() => (resetQuizQuestion()), 1000);
   }
    }
    
  } catch (error: any) {
    console.error("Submit error:", error);
    setMessage(`❌ Request failed: ${error.message}`);
  } finally {
    setLoadingQS(false);
  }
};


const canView = !!userRole && ["tutor"].includes(userRole.toLowerCase());
if (!canView) { return <AccessDenied />; }
return (
<div className="p-4">
<div className="flex justify-between items-center w-full">
<div><SubTitle string1={itemId ? 'Update Quiz' : 'New Quiz'} /></div>
<div>
{itemId && action === 'update' ? <TrashIcon
onClick={() => setDeleteQuiz(itemId)}
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
}`}>{tabs[i]}</button>);})}</div></div></div>


<div className="p-4 py-8">
<div role="tabpanel" aria-hidden={active !== 0} className={active === 0 ? "" : "hidden"}>
<DynamicForm 
apiType={itemId ? `PUT` : `POST`}
key={pathname} 
apiEndpoint={itemId ? `quizzes/${itemId}` : `quizzes`}
fields={formFields}
submitButtonText={action === "update" ? "Update Quiz Information" : "Save"}
className="space-y-6"
updateFormField={updateFormField}
onSuccess={(data) => { returnHome(); }}
/></div>
<div role="tabpanel" aria-hidden={active !== 1} className={active === 1 ? "" : "hidden"}>

{shouldShowQuestions && (
<div className="w-full p-3 mb-6">
<div className="overflow-x-auto">
<table className="w-full border-collapse">
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
pathname: "/user-area/quizzes",
query: { action: "update", mod: "question", quizId:itemId, itemId:tutor.id, questionId:tutor.id, question: tutor.question ?? "", answer: tutor.correctAnswer ?? "", type: tutor.type ?? "", avatar: tutor.file ?? "", options: JSON.stringify(tutor.options) ?? "", returnURL: `quizzes?action=update&mod=quiz&itemId=${itemId}&subjectId=${subjectIdURL}&title=${title}&description=${description}&avatarOrCover=${avatarOrCover}&instructions=${instructions}&duration=${duration}` },
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

{/* Delete Mock */}
{deleteQuiz && (
<Delete
apiUrl={`quizzes/${itemId}`}
title={`Delete Quiz: ${getFormFieldValue(formField, "title") ?? title ?? ""}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteQuiz}
returnURL={`/user-area/quizzes?deleteId=${itemId}`}
onClose={() => setDeleteQuiz(null)}
//onSuccess={() => handleDeleteSuccess(deleteItem.id)}
/>
)}

{/* Delete Question */}
{deleteItem && (
<Delete
apiUrl={`quiz-questions/${deleteItem}`}
title={`Delete Quiz Question: ${curItemTitle ?? ""}`}
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