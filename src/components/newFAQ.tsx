"use client";
import React, { useState, useRef, useEffect } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import Link from 'next/link';
import { SquareCheckBig, Plus, TextAlignStart, Book } from "lucide-react";
import { fetchData } from "@/utils/fetchData";
import FileUpload from "./fileUpload";
import { useForm } from "react-hook-form";
import { Subject, Data, ApiResponse, InputField } from "@/types";


export default function CreateQuiz() {
const [subjects, setSubjects] = useState<Subject[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [avatarURL, setAvatarURL] = useState<string | null>('null');
const [active, setActive] = useState(0);
const [quizId, setQuizId] = useState<string>("");
//const refs = useRef([]);
const refs = useRef<(HTMLButtonElement | null)[]>([null, null]);
const [viewState, setViewState] = useState(false);
const { register, handleSubmit, formState: { errors } } = useForm();
const onSubmit = (data: any) => { console.log(data); };

// State variables
const [formData, setFormData] = useState({
textValue: "",
selectedValue: "multi-choice",
selectedAnswer: "",
});

const tabs = ["Quiz Information", "Questions"];
// Sample options for the dropdown
const options = [
{ value: "multi-choice", label: "Multi choice", icon: Book },
{ value: "theory", label: "Theory", icon: Book },
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
if (data?.data) {
const getSubjects = data.data.map((item: any) => ({
value: item.id,
label: item.title,
}));
setSubjects(getSubjects);
}} 
catch (error) { console.error("Error fetching dashboard data:", error); }}
loadSubjects(); }, []);

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




// Handle text change
const handleTextChange1 = (index: number, value: string) => {
const updated = [...texts];
updated[index] = value;
setTexts(updated);
};

// Handle dropdown select change
const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
setFormData({ ...formData, selectedValue: e.target.value });
};
const itemsCount = 4;

// State for radio selection and text values
const [selected, setSelected] = useState<number | null>(null);
const [texts, setTexts] = useState<string[]>(
Array.from({ length: itemsCount }, (_, i) => `Option ${i + 1}`)
);

const [editable, setEditable] = useState<boolean[]>(Array(itemsCount).fill(false));

// Handle radio change
const handleRadioChange = (index: number) => {
setSelected(index);
};



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

const toggleSwitch = () => {
setViewState((prev) => !prev);
};

const formFields: InputField[] =  [
{
name: 'question',
label: 'Question',
type: 'text',
placeholder: 'Enter Question',
required: true,
className: 'w-full',
},
{
name: 'answer',
label: 'Answer',
type: 'textarea',
placeholder: 'Enter Answer',
required: true,
className: 'w-full',
},
];

return (
<div>
<SubTitle string1='New FAQ' />
<div className="mt-8 bg-white p-4">
<div>
<DynamicForm
apiEndpoint={`quizzes`}
fields={formFields}
submitButtonText="Save"
className="space-y-6"
/>
</div>
</div>
</div>
);
};