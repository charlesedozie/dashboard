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
name: 'subjectId',
label: 'Quiz Subject',
type: 'select',
required: true,
className: 'w-full',
options: subjects,
},
{
name: 'title',
label: 'Quiz Title',
type: 'text',
placeholder: 'Enter topic',
required: true,
className: 'w-full',
},
{
name: 'description',
label: 'Quiz Description',
type: 'textarea',
placeholder: 'Enter Description',
required: true,
className: 'w-full',
},{
name: 'instructions',
label: 'Quiz Instructions',
type: 'text',
placeholder: 'Enter Instruction',
required: true,
className: 'w-full',
},{
name: 'duration',
label: 'Quiz Duration',
type: 'text',
placeholder: '20 minutes',
required: true,
className: 'w-full',
},
{
name: 'avatarURL',
label: 'Upload Quiz Image',
type: 'image',
required: true,
className: 'w-full',
defVal:avatarURL,
handleImage:setAvatarURL
},
{
name: 'avatar',
label: '',
type: 'hidden',
required: false,
className: '',
defVal:avatarURL,
handleImage:setAvatarURL
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

return (
<div className="p-4">{avatarURL}
<SubTitle string1='New Quiz' />
<div className="mt-8">
<div
role="tablist"
aria-label="Example Tabs"
className="flex items-center justify-between"
>
{/* Left group */}
<div className="flex">
{[0, 1].map((i) => (
<button
key={tabs[i]}
ref={(el) => {
    refs.current[i] = el; // Assign to refs but don't return anything
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
))}
</div>
</div>
</div>









<div className="grid grid-cols-1 sm:grid-cols-[78%_20%] gap-5">
<div className="bg-white p-4 py-8">
<div role="tabpanel" aria-hidden={active !== 0} className={active === 0 ? "" : "hidden"}>
<DynamicForm
apiEndpoint={`quizzes`}
fields={formFields}
submitButtonText="Next"
className="space-y-6"
/>
</div>


<div role="tabpanel" aria-hidden={active !== 1} className={active === 1 ? "" : "hidden"}>
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
<div><span className="text-red-500"> *</span>
<FileUpload
name="uploadFile"
label="Insert Image"
register={register}  // Pass register correctly
error={errors.myFile?.message as string | undefined}

isImage={true}
isText={true}
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

{formData.selectedValue === 'theory' ? 
<section className='my-8'>
<textarea
  placeholder="Theory answer"
  value={formData.selectedAnswer}
  onChange={handleTextChangeTArea}
  rows={3}
  className="w-full px-3 py-2 border-b rounded-md focus:outline-none focus:ring focus:border-blue-500"
/>
</section> : null}
{formData.selectedValue === 'multi-choice' ? <section className='my-8'>
{texts.map((text, index) => (
<section key={index} className='flex justify-between mb-5 border-b pb-2 font-bold'>
<section>
<div className="flex items-center space-x-2">
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
value={text}
readOnly={!editable[index]}
onDoubleClick={() => handleDoubleClick(index)}
onBlur={() => handleBlur(index)}
onChange={(e) => handleTextChange1(index, e.target.value)}
className={`flex-1 px-3 py-1`}
/>
</div>
</section>
<section>
<FileUpload
name="uploadFile"
label="Insert Image"
register={register}  // Pass register correctly
error={errors.myFile?.message as string | undefined}

isImage={true}
isText={true}
/>
</section>
</section>
))}
</section> : null}
<section className='font-bold def-color'>Answer: {formData.selectedAnswer}</section>

{selected !== null && formData.textValue != null && formData.textValue != '' ? <button type="button" className="mt-4 def-bg text-white rounded-xl py-3 px-[2%] sm:px-[2%] md:px-[8%] hover:bg-blue-600 pointer">Upload</button> : null}


{/* Display Values */}
<div className="mt-4 text-sm text-gray-700">
<p>Quiz question: {formData.textValue}</p>
<p>Selected Option: {selected !== null ? texts[selected] : "None"}</p>
<p>All Options: {JSON.stringify(texts)}</p>
<p>Selected answer: {formData.selectedAnswer}</p>
</div>
</div>
</div>

<div className="bg-white p-4">
<button disabled 
onClick={() => handleUpdateClick("addQuestion")}
className="flex items-center mb-3 gap-2 px-4 py-2 rounded-lg"
>
<div className="flex text-sm items-center space-x-2 cursor-pointer border-2 border-gray-400 rounded-full">
<Plus size={19} className="text-gray-400" />
</div>
{/* Text next to icon */}
<span className="text-gray-400 text-base font-bold">Add Question</span>
</button>


{selected !== null && formData.selectedValue === 'multi-choice' && (
<button
onClick={() =>
setFormData({
...formData,
selectedAnswer: selected !== null ? texts[selected] : ""
})
}
className="flex items-center gap-2 px-4 py-2 rounded-lg"
>
<SquareCheckBig className="text-gray-400 w-5 h-5" />
<span className="text-gray-400 text-base font-bold">Select answer</span>
</button>
)}




</div>
</div>
</div>
);
};