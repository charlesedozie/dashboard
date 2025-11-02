"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import { InputField, Data, ApiResponse, RowsResponse1, RowsResponse2, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useSearchParams, usePathname } from "next/navigation";
import { getUserProperty, getUser } from "@/utils/curUser";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Delete from "@/components/deleteButton";
import { Copy } from "lucide-react";
import Link from "next/link";
import { TrashIcon, PencilIcon, EyeIcon, EyeDropperIcon } from "@heroicons/react/24/outline";
import {getUserField} from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";
import { useTheme } from "next-themes";
import { ArrowLeft } from "lucide-react";


//const generateId = () => crypto.randomUUID();

type FormFields = {
  key: string;
  value: any;
};

type FilesImages = {
  id: string;
  name: string;
  url?: string;
};

export default function NewLesson() {
const searchParams = useSearchParams();
const [showAlert, setShowAlert] = useState(false);
const [filesImages, setFilesImages] = useState<FilesImages[]>([]);
//const subjectParam = searchParams.get("subjectId") ?? null;
const pathname = usePathname();
const [active, setActive] = useState(0);
const refs = useRef<(HTMLButtonElement | null)[]>([]);
const [viewState, setViewState] = useState<string | null>('null');
//const [lessonAPI, setLessonAPI] = useState('lessons');
const [showVideoOption, setShowVideoOption] = useState(false);
const [avatar, setAvatar] = useState<string | null>('null');
const [videoCaption, setVideoCaption] = useState<string | null>(null);
const [video, setVideo] = useState<string | null>(null);
const [formField, setFormField] = useState<FormFields[] | null>(null);
const [topicField, setTopicField] = useState<FormFields[] | null>(null);
const [videoField, setVideoField] = useState<FormFields[] | null>(null);
const [subject, setSubject] = useState<Data[]>([]);
const [lessonId, setLessonId] = useState<Data | null>(null);
//const [subjectId, setSubjectId] = useState<string | null>(subjectParam);
const [deleteItem, setDeleteItem] = useState<any | null>(null); 
const [deleteTopic, setDeleteTopic] = useState<any | null>(null); 
const [curLesson, setCurLesson] = useState<RowsResponse2 | null>(null);
const [curTopic, setCurTopic] = useState<RowsResponse2 | null>(null);
const userRole = getUserField<string>("role");

const { theme } = useTheme();
const isDark = theme === "dark";

const itemId = searchParams.get("itemId") ?? null;
const topicId = searchParams.get("topicId") ?? null;
const topictitle = searchParams.get("topictitle") ?? null;
const topicdescription = searchParams.get("topicdescription") ?? null;
const returnURL = searchParams.get("returnURL") ?? null;
const action = searchParams.get("action");
const type = searchParams.get("type");
const topicduration = searchParams.get("topicduration");
const mod = searchParams.get("mod");
const urlVideo = searchParams.get("video");
const urlCaption = searchParams.get("caption");
const avatarOrCover = searchParams.get("avatarOrCover");
const router = useRouter();

const handleCopy = async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
      setShowAlert(true); // ✅ show alert
      setTimeout(() => setShowAlert(false), 2000); // ⏳ hide after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };



// Handle delete success
const handleDeleteSuccess = (tutorId: string) => { 
//setTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
//setDeleteTutor(null);
};

// ✅ regex for UUID v4
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const shouldFetch = useMemo( () => action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId), [action, mod, itemId] );


function updateAvatar(status: string, msg: string): void {
if (status === "success") {
if(avatar !== msg){setAvatar(msg)}
} else { console.error("Avatar update failed:", msg); }}

function updateVideo(status: string, msg: string): void {
if (status === "success") {
if(video !== msg){setVideo(msg)}
} else { console.error("Avatar update failed:", msg); }}

function updateVideoCaption(status: string, msg: string): void {
if (status === "success") {
if(videoCaption !== msg){setVideoCaption(msg)}
} else { console.error("Avatar update failed:", msg); }}


function updateFileImage(status: string, msg: string): void { handleAddByName(msg);}
const normalize = (v: string ) => String(v ?? "").trim().toLowerCase();

const handleAddByName = (name: string) => {
setFilesImages(prev => { const normalizedName = normalize(name);
// prevent duplicate names
if (prev.some(i => normalize(i.name) === normalizedName)) {
return prev; }
const newItem = { id: String(Date.now()), name }; // or use uuid()
return [...prev, newItem]; }); };

const removeFileImage = (id: string) => {
setFilesImages(prevItems => {
const normalizedId = String(id).trim().toLowerCase();
const exists = prevItems.some( item => String(item.id).trim().toLowerCase() === normalizedId );
if (!exists) { return prevItems; }

if (prevItems.length < 2) { return []; }
let newItems = prevItems.filter(
item => String(item.id).trim().toLowerCase() !== normalizedId
);

if (filesImages.length > 0 && filesImages.length < 2) {
setFilesImages([]);
return [];
}
return newItems;
});
};

const { data:curTopicData, isLoading:curTopicIsLoading, refetch:refetchCurTopic } = useQuery<RowsResponse2 | null>({
queryKey: ["lesson-topics", itemId],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse2>>(`lesson-topics/${topicId}`, {}, 1000 );
if (response?.data) { return response.data; } return null; },
//enabled: !!( action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)),
enabled: !!topicId,
//staleTime: 1000 * 10,
});

useEffect(() => { if (curTopicData) { setCurTopic(curTopicData); }}, [curTopicData]);
/*
  // Optional: force refetch when URL param changes manually
  useEffect(() => {
    if (itemId) {
      refetchCurTopic();
    }
  }, [itemId, refetchCurTopic]);




useEffect(() => {
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)) { 
//if(lessonAPI !== `lessons/${itemId}`){setLessonAPI(`lessons/${itemId}`);}

if ((lessonId?.id ?? "") !== (itemId ?? "")) {
  setLessonId({ ...(lessonId ?? {}), id: itemId } as Data);
}} 
//else if (action === "create" && mod === "lesson") { setLessonAPI("lessons"); }
}, [searchParams]);
*/

const shouldShowTopics = String(lessonId ?? "").trim() !== "";


const getDocDisplayName = (url: string): string => {
// 1️⃣ Get the last part of the URL (the filename)
const fileName = url.split("/").pop() || "";
// 2️⃣ Split by triple underscore and get the last part
const parts = fileName.split("___");
const displayName = parts[parts.length - 1];
return displayName;
};

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

// ✅ Update or add key-value pair
const updateVideoField = (key: string, value: any) => {
setVideoField((prev) => {
if (!prev) return [{ key, value }];
// Check if key exists
const existingIndex = prev.findIndex((item) => item.key === key);
if (existingIndex !== -1) {
// ✅ Update value
const updated = [...prev]; updated[existingIndex] = { key, value }; return updated;
} else {
// ✅ Add new key-value pair
return [...prev, { key, value }]; }});};

// ✅ Update or add key-value pair
const updateTopicField = (key: string, value: any) => {
setTopicField((prev) => {
if (!prev) return [{ key, value }];
// Check if key exists
const existingIndex = prev.findIndex((item) => item.key === key);
if (existingIndex !== -1) {
// ✅ Update value
const updated = [...prev]; updated[existingIndex] = { key, value }; return updated;
} else {
// ✅ Add new key-value pair
return [...prev, { key, value }]; }});};

const getFormFieldValue = (fields: FormFields[] | null, key: string): any => {
if (!fields) return null;
const found = fields.find((item) => item.key === key);
return found ? found.value : null;
};

// Helper function to get the first non-null, non-undefined, non-empty string value
const coalesce = (val: string | null | undefined): string | null =>   val != null && val !== '' && val !== 'null' ? val : null;

console.log(coalesce(JSON.stringify(filesImages)) ?? coalesce(getFormFieldValue(topicField, "subtitle")) ?? coalesce(curTopic?.subtitle) ?? "")

const topicFields: InputField[] =  [ 
{
name: 'title',
label: 'Topic Title',
type: 'text',
placeholder: 'Enter title',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(topicField, "title")) ?? coalesce(curTopic?.title) ?? coalesce(topictitle) ?? "",
},
{
name: 'duration',
label: 'Topic Duration',
type: 'number',
placeholder: 'Enter duration',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(topicField, "duration")) ?? coalesce(curTopic?.duration) ?? coalesce(topicduration) ?? "",
},
{
name: 'subtitle',
label: '',
type: 'hidden',
placeholder: '',
required: false,
className: 'w-full',
defVal: coalesce(JSON.stringify(filesImages)) ?? coalesce(getFormFieldValue(topicField, "subtitle")) ?? coalesce(curTopic?.subtitle) ?? "",
},
{
name: 'description',
label: 'Add Topic Description',
type: 'textarea',
placeholder: 'Enter topic Description',
required: true,
className: 'w-full',
defVal:  coalesce(getFormFieldValue(topicField, "description")) ?? coalesce(curTopic?.description) ?? coalesce(topicdescription) ?? "",
},
{
name: 'mainContent',
label: 'Add Topic Content',
type: 'html',
placeholder: 'Enter topic content',
required: true,
className: 'w-full',
defVal:  coalesce(getFormFieldValue(topicField, "mainContent")) ?? coalesce(curTopic?.mainContent) ?? "",
},
{
name: 'fileType',
label: String(type?.toLocaleLowerCase() == 'video' ? 'VIDEO' : 'DOCUMENT'),
type: 'hidden',
required: true,
className: 'w-full',
defVal: String(type?.toLocaleLowerCase() == 'video' ? 'VIDEO' : 'DOCUMENT'),
},
{
name: 'userId',
label: getUserProperty("id") ?? "",
type: 'hidden',
required: true,
className: 'w-full',
defVal: getUserProperty("id"),
},
];

const topicVideos: InputField[] =  [ 
{
name: 'title',
label: 'Topic Title',
type: 'text',
placeholder: 'Enter title',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(videoField, "title")) ?? coalesce(topictitle) ?? "",
},
{
name: 'duration',
label: 'Topic Duration',
type: 'number',
placeholder: 'Enter duration',
required: true,
className: 'w-full',
defVal: coalesce(getFormFieldValue(videoField, "duration")) ?? coalesce(topicduration) ?? "",
},
{
name: 'videoCaptionUrl',
label: 'Attach Video Caption',
type: 'textarea',
required: false,
className: 'w-full',
defVal: coalesce(getFormFieldValue(videoField, "videoCaptionUrl")) ?? coalesce(urlCaption) ?? "",
//defVal: coalesce(videoCaption) ?? coalesce(urlCaption) ?? "",
},
{
name: 'videoOrFileUrl',
label: 'Upload Video',
type: 'video',
required: true,
className: 'w-full',
defVal: coalesce(video) ?? coalesce(urlVideo) ?? "",
handleImage:updateVideo,
},
{
name: 'userId',
label: getUserProperty("id") ?? "",
type: 'hidden',
required: true,
className: 'w-full',
defVal: getUserProperty("id"),
},
];

const TopicsTab = () => (
<section
onClick={() => setShowVideoOption(true)}
className="cursor-pointer w-full h-full flex items-center justify-center"
>Topics</section>);

const LessonTab = () => (
<section
onClick={() => setShowVideoOption(false)}
className="cursor-pointer w-full h-full flex items-center justify-center"
>Lesson Information</section>);


const canView = !!userRole && ["tutor"].includes(userRole.toLowerCase());
if (!canView) { return <AccessDenied />; }
return (
<div className="p-2">
<div className="flex items-start space-x-4">
<Link href={`/user-area/${returnURL}`}>
<ArrowLeft className="w-5 h-5 text-gray-700" />
</Link>
<div>
<SubTitle string1="Update Topic" />
</div>
</div>


<div className="mt-3">
{/* Tab panels */}
<div className="mt-4 p-[1%] sm:p-[2%]">
<section className='mb-15'>
<p className="border-b border-gray-400 pb-1 font-bold">Documents</p>
<ul className="mt-4">
{filesImages?.map((item) => (
<li
  key={item.id}
  className="flex items-center justify-between bg-gray-100 mb-2 px-2 py-1 w-full mb-1"
>
  {/* Left section: delete icon + file name */}
  <div className="flex items-center gap-2">
    <button
      onClick={() => removeFileImage(`${item.id}`)}
      className="text-red-500 pointer hover:text-red-700"
    >
      <TrashIcon className="w-4 h-4" />
    </button><a href={item.name} target='_blank'>{getDocDisplayName(item.name)}</a> 
  </div>

  {/* Right section: copy button/icon */}
  <Copy
    onClick={() => handleCopy(item.name)}
    className="w-4 h-4 text-blue-700 cursor-pointer hover:text-blue-900"
  />
</li>

))}
</ul>
</section>
{type?.toLowerCase() === "video" ? <DynamicForm
apiType={`PUT`}
key={`${pathname}video`} 
apiEndpoint={`lesson-topics/${topicId}`}
fields={topicVideos}
submitButtonText="Update Topic"
className="space-y-6"
updateFormField={updateVideoField}
onSuccess={(data) => { refetchCurTopic();}}
/> : null}

{type?.toLowerCase() === 'document' ? <DynamicForm
apiType={`PUT`}
key={`${pathname}topic`} 
apiEndpoint={`lesson-topics/${topicId}`}
fields={topicFields}
submitButtonText="Update Topic"
className="space-y-6"
updateFormField={updateTopicField}
onSuccess={(data) => { refetchCurTopic();}}
/> : null}
</div></div>


{/* Delete lesson */}
{deleteItem && (
<Delete
apiUrl={`lesson-topics/${topicId}`}
title={`Delete Lesson Topic: ${topictitle}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteItem}
returnURL={`/user-area/${returnURL}`}
onClose={() => setDeleteItem(null)}
//onSuccess={() => handleDeleteSuccess('deleteItem.id')}
/>
)}


{/* Alert box */}
{showAlert && (
<div className="absolute top-2 right-2 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm animate-fade-in">
✅ Copied to clipboard!
</div>
)}
</div>
);
};