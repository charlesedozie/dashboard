"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import Link from 'next/link';
import { SquareCheckBig, Plus, TextAlignStart, Book } from "lucide-react";
import { fetchData } from "@/utils/fetchData";
import FileUpload from "./fileUpload";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Subject, Data, ApiResponse, InputField, RowsResponse2, RowsResponse } from "@/types";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {getUserField, getUser} from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";

type FormFields = {
key: string;
value: any;
};



export default function CreateQuiz() {
const searchParams = useSearchParams();
//const [subjects, setSubjects] = useState<Subject[]>([]);
//const [loading, setLoading] = useState(true);
const [loadingQS, setLoadingQS] = useState(false);
//const [error, setError] = useState<string | null>(null);
//const [avatarURL, setAvatarURL] = useState<string | null>('null');
//const [active, setActive] = useState(0);
const [quizId, setQuizId] = useState<string>("");
//const refs = useRef([]);
const refs = useRef<(HTMLButtonElement | null)[]>([null, null]);
//const [viewState, setViewState] = useState(false);
const { register, handleSubmit,  setValue,  formState: { errors } } = useForm();
const router = useRouter();
const [formField, setFormField] = useState<FormFields[] | null>(null);
const [curQuiz, setCurQuiz] = useState<RowsResponse2 | null>(null);
const [avatar, setAvatar] = useState<string | null>('null');
const [questionAvatar, setQuestionAvatar] = useState<string | null>('null');
const [message, setMessage] = useState<string | null>(null);
const [curQuestions, setCurQuestions] = useState<RowsResponse | null>(null);
const { theme } = useTheme();
const isDark = theme === "dark";

const itemId = searchParams.get("itemId") ?? '';
const question = searchParams.get("question") ?? null;
const type = searchParams.get("type") ?? null;
const avatarURL = searchParams.get("avatar") ?? null;
const action = searchParams.get("action");
const mod = searchParams.get("mod");
const returnURL = searchParams.get("returnURL") ?? null;
const answer = searchParams.get("answer");
const questionId = searchParams.get("questionId");
const quizIdURL = searchParams.get("quizId");
const pathname = usePathname();
const userRole = getUserField<string>("role");


const itemsCount = 4;

// State for radio selection and text values
const [selected, setSelected] = useState<number | null>(null);
const [texts, setTexts] = useState<{ title: string; image: string | null }[]>(
Array.from({ length: itemsCount }, (_, i) => ({
title: `Option ${i + 1}`,
image: null,
}))
);

const optionsParam = searchParams.get("options");

interface Option {
  title: string;
  image: string | null;
}


useEffect(() => {
    try {
      const parsed = optionsParam ? JSON.parse(optionsParam) : [];
      setQuestionAvatar(avatarURL || '')
      setFormData({ ...formData, textValue: question || '', selectedValue: type || '', selectedAnswer : answer || '',});
      // ✅ only update if different
      setTexts((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(parsed);
        return prevStr !== newStr ? parsed : prev;
      });
    } catch (error) {
      console.error("Invalid options param:", error);
    }
  }, [optionsParam]);



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

// Helper function to get the first non-null, non-undefined, non-empty string value
const coalesce = (val: string | null | undefined): string | null =>   val != null && val !== '' && val !== 'null' ? val : null;

// State variables
const [formData, setFormData] = useState({
textValue: "",
selectedValue: coalesce(type) ?? "",
selectedAnswer: "",
});

const options = [
{ value: "MULTIPLE_CHOICE", label: "Multi Choice", icon: Book },
{ value: "THEORY", label: "Theory", icon: Book },
];

// Handle textarea input change
const handleTextChangeTArea = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
setFormData({ ...formData, selectedAnswer: e.target.value });
};

// Handle text input change
const handleTextChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
setFormData({ ...formData, textValue: e.target.value });
};



// Handle dropdown select change
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
setFormData({ ...formData, selectedValue: e.target.value });
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const shouldFetch = useMemo( () => action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId), [action, mod, itemId] );
const [editable, setEditable] = useState<boolean[]>(Array(itemsCount).fill(false));

// Handle radio change
const handleRadioChange = (index: number) => { setSelected(index); };

const { data, isLoading } = useQuery<RowsResponse2 | null>({
queryKey: ["quizCur", quizId],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse2>>(`lessons/${itemId}`, {}, 100 );
if (response?.data) { return response.data; } return null; },
//enabled: !!( action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)),
enabled: !!shouldFetch,
//staleTime: 1000 * 5,
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


function updateQuestionAvatar(status: string, msg: string): void {
if (status === "success") {
if(questionAvatar !== msg){setQuestionAvatar(msg)}
} else { console.error("Avatar update failed:", msg); }}

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
    userId: getUser()?.user.id || '',
    question: formData.textValue,
    type: (formData.selectedValue).toUpperCase() ,
    correctAnswer: (formData.selectedValue == 'THEORY') ? formData.selectedAnswer : (selected !== null ? (texts[selected].title) : "") ,
    file: questionAvatar ?? '',
    explanation: "",
    status:'PENDING',
    quizId:quizIdURL || '',
    options: [],
  };


     // Merge texts array into the options before sending
      const payload: QuizPayload = {
        ...data,
        options: texts,
      };


  // ✅ Convert to form-urlencoded
/*
  const formBody = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formBody.append(key, value);
  });
*/

const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/quiz-questions/${coalesce(questionId) ?? coalesce(curQuiz?.id) ?? ""}`, {
      method: "PUT",
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
      setTimeout(() => setMessage(null), 2000); // ⏳ hide after 2s
   // return result;
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
<div className="p-2">
<div className="flex items-start space-x-4">
<Link href={`/user-area/${returnURL}`}>
<ArrowLeft className="w-5 h-5 text-gray-700" />
</Link>
<div>
<SubTitle string1={'Update Question'} />
</div>
</div>



<div className="p-4 py-8">
<div>
<div className="grid grid-cols-1 sm:grid-cols-[50%_23%_23%] gap-5">
<div>{/* Text Input */}
<label className='font-bold' htmlFor='quizQuestion'>Enter Question <span className="text-red-500"> *</span></label><br />     
<textarea
placeholder="Enter Question"
value={coalesce(formData.textValue) ?? coalesce(question) ?? ""}
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
value={coalesce(formData.selectedValue) ?? coalesce(type) ?? ""}
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
value={coalesce(formData.selectedAnswer) ?? coalesce(answer) ?? ""}
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
);
};