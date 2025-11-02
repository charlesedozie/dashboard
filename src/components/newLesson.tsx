"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import { InputField, Data, ApiResponse, RowsResponse1, RowsResponse2, RowsResponse } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useSearchParams, usePathname } from "next/navigation";
import { getUserProperty } from "@/utils/curUser";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Delete from "@/components/deleteButton";
import { Copy } from "lucide-react";
import Link from "next/link";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import ShowContent from "@/components/showContent";
import {AccessDenied} from "@/components/utils";
import { useTheme } from "next-themes";
import {getUserField, getUser} from "@/utils/curUser";

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
const [formResetKey, setFormResetKey] = useState(0);
const refs = useRef<(HTMLButtonElement | null)[]>([]);
const [viewState, setViewState] = useState(false);
//const [lessonAPI, setLessonAPI] = useState('lessons');
const [showVideoOption, setShowVideoOption] = useState(false);
const [avatar, setAvatar] = useState<string | null>('null');
const [videoCaption, setVideoCaption] = useState<string | null>('null');
const [video, setVideo] = useState<string | null>('null');
const [formField, setFormField] = useState<FormFields[] | null>(null);
const [topicField, setTopicField] = useState<FormFields[] | null>(null);
const [videoField, setVideoField] = useState<FormFields[] | null>(null);
const [subject, setSubject] = useState<Data[]>([]);
const [lessonId, setLessonId] = useState<Data | null>(null);
//const [subjectId, setSubjectId] = useState<string | null>(subjectParam);
const [deleteItem, setDeleteItem] = useState<any | null>(null); 
const [deleteTopic, setDeleteTopic] = useState<any | null>(null); 
const [curLesson, setCurLesson] = useState<RowsResponse2 | null>(null);
const [curTopic, setCurTopic] = useState<RowsResponse | null>(null);
const [curTopicTitle, setCurTopicTitle] = useState(''); 
const { theme } = useTheme();
const isDark = theme === "dark";


const itemId = searchParams.get("itemId") ?? null;
const title = searchParams.get("title") ?? null;
const description = searchParams.get("description") ?? null;
const subjectIdURL = searchParams.get("subjectId") ?? null;
const action = searchParams.get("action");
const avatarOrCover = searchParams.get("avatarOrCover");
const mod = searchParams.get("mod");
const router = useRouter();
const userRole = getUserField<string>("role");
const handleCopy = async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
      setShowAlert(true); // ✅ show alert
      setTimeout(() => setShowAlert(false), 2000); // ⏳ hide after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  

const handleDelete = (id: string, title: string) => {
setCurTopicTitle(title);
setDeleteTopic(id);
};

const handleDeleteSuccessCurTopic = (id: string) => {
setCurTopic((prev: any) => ({
...prev,
rows: prev.rows.filter((q: Data) => q.id !== id),
}));
};


// Handle delete success
const handleDeleteSuccess = (tutorId: string) => { 
//setTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
//setDeleteTutor(null);
};

// ✅ regex for UUID v4
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const shouldFetch = useMemo( () => action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId), [action, mod, itemId] );

const clearAllForms = () => {
  // Increment reset key to force all DynamicForm + TinyMCE editors to re-mount
  setFormResetKey((prev) => prev + 1);

  // Reset any local states if needed
  setFormField(null);
  setTopicField(null);
  setVideoField(null);
  setFilesImages([]);
  setAvatar(null);
  setVideo(null);
  setVideoCaption(null);

};


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

// Add files / images
function updateFileImage(status: string, msg: string): void {
handleAddByName(msg);}
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


if (prevItems.length < 2) {
return [];
}
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

console.log(('files Images'), filesImages)
const { data:curTopicData, isLoading:curTopicIsLoading, refetch:refetchCurTopic } = useQuery<RowsResponse | null>({
queryKey: ["lesson-topics", lessonId],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse>>(`lesson-topics?lessonId=${itemId}`, {}, 1000 );
if (response?.data) {
//if(curTopic !== response.data){setCurTopic(response.data);}
return response.data; } return null; },
//enabled: !!( action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)),
enabled: !!shouldFetch,
//staleTime: 1000 * 10,
});
useEffect(() => { if (curTopicData) { setCurTopic(curTopicData); }}, [curTopicData]);

const { data, isLoading } = useQuery<RowsResponse2 | null>({
queryKey: ["lesson", lessonId],
queryFn: async () => {
const response = await fetchData<ApiResponse<RowsResponse2>>(`lessons/${itemId}`, {}, 100 );
if (response?.data) { return response.data; } return null; },
//enabled: !!( action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)),
enabled: !!shouldFetch,
//staleTime: 1000 * 5,
});
useEffect(() => { if (data) { setCurLesson(data); }}, [data]);

useEffect(() => {
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
if (action === "update" && mod === "lesson" && itemId && uuidRegex.test(itemId)) { 
//if(lessonAPI !== `lessons/${itemId}`){setLessonAPI(`lessons/${itemId}`);}

if ((lessonId?.id ?? "") !== (itemId ?? "")) {
  setLessonId({ ...(lessonId ?? {}), id: itemId } as Data);
}} 
//else if (action === "create" && mod === "lesson") { setLessonAPI("lessons"); }
}, [searchParams]);

const shouldShowTopics = String(lessonId ?? "").trim() !== "";
const getDocDisplayName = (url: string): string => {
// 1️⃣ Get the last part of the URL (the filename)
const fileName = url.split("/").pop() || "";
// 2️⃣ Split by triple underscore and get the last part
const parts = fileName.split("___");
const displayName = parts[parts.length - 1];
return displayName;
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
const filteredSubjects = data.data.filter((item: any) => userSubjectIds.includes(String(item.id))
);


const newArray = filteredSubjects.map(item => ({
label: String(item.title ?? ""),
value: String(item.id ?? ""),
}));
const sortedArray = newArray.sort((a, b) =>
a.label.localeCompare(b.label)
);
setSubject(sortedArray);
}
} catch (error) {
console.error("Error fetching data:", error);
}
}

loadSubject();
}, [pathname, searchParams]); // 👈 runs again when route or URL params change


const toggleSwitch = () => {
setViewState((prev) => !prev);
};

function returnHome(){
router.push(`/user-area/lessons`);
}


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

const lessonInfo: InputField[] = useMemo(
() => [
{
name: 'subjectId',
label: 'Lesson Subject',
type: 'select',
required: true,
className: 'w-full',
options: subject,
defVal: getFormFieldValue(formField, "subjectId") ?? curLesson?.subjectId ?? subjectIdURL  ?? "",
},
{
name: 'title',
label: 'Lesson Title',
type: 'text',
placeholder: 'Enter title',
required: true,
className: 'w-full',
defVal: getFormFieldValue(formField, "title") ?? curLesson?.title ?? title ?? "",
//updateFormField:{updateFormField},
}, 
{
name: 'description',
label: 'About Lesson',
type: 'textarea',
placeholder: 'Enter description',
required: true,
className: 'w-full',
defVal: getFormFieldValue(formField, "description") ?? curLesson?.description ?? description ?? "",
},
{
name: 'avatarOrCover',
label: 'Upload Lesson Image',
type: 'image',
required: true,
className: 'w-full',
defVal: coalesce(avatar) ?? coalesce(curLesson?.avatarOrCover) ?? coalesce(getFormFieldValue(formField, "avatarOrCover")) ?? coalesce(avatarOrCover) ?? "",
handleImage:updateAvatar,
},
{
name: 'userId',
label: getUserProperty("id") ?? "",
type: 'hidden',
required: false,
className: 'w-full',
defVal: getUserProperty("id"),
},
], [avatar, subject, title, description]
);

const topicFields: InputField[] =  [ 
{
name: 'title',
label: 'Topic Title',
type: 'text',
placeholder: 'Enter title',
required: true,
className: 'w-full',
defVal: getFormFieldValue(topicField, "title") ?? "",
},
{
name: 'duration',
label: 'Topic Duration  (Minutes)',
type: 'number',
placeholder: 'Enter duration',
required: true,
className: 'w-full',
defVal: getFormFieldValue(topicField, "duration") ?? "",
},
{
name: 'subtitle',
label: '',
type: 'hidden',
placeholder: '',
required: false,
className: 'w-full',
defVal: JSON.stringify(filesImages),
},
{
name: 'description',
label: 'Add Topic Description',
type: 'textarea',
placeholder: 'Enter topic Description',
required: true,
className: 'w-full',
defVal: getFormFieldValue(topicField, "description") ?? "",
},
{
name: 'mainContent',
label: 'Add Topic Content',
type: 'html',
placeholder: 'Enter topic content',
required: true,
className: 'w-full',
defVal: getFormFieldValue(topicField, "mainContent") ?? "",
},
{
name: 'avatarOrCover',
label: 'Add Image',
type: 'image',
required: false,
className: 'w-full',
handleImage:updateFileImage,
},
{
name: 'lessonId',
label: String(itemId),
type: 'hidden',
required: true,
className: 'w-full',
defVal: String(itemId),
},
{
name: 'fileType',
label: String(viewState ? 'VIDEO' : 'DOCUMENT'),
type: 'hidden',
required: true,
className: 'w-full',
defVal: String(viewState ? 'VIDEO' : 'DOCUMENT'),
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
defVal: getFormFieldValue(videoField, "title") ?? "",
},
{
name: 'duration',
label: 'Topic Duration',
type: 'number',
placeholder: 'Enter duration',
required: true,
className: 'w-full',
defVal: getFormFieldValue(videoField, "duration") ?? "",
},
{
name: 'videoOrFileUrl',
label: 'Upload Video',
type: 'video',
required: true,
className: 'w-full',
defVal: coalesce(video) ?? coalesce(getFormFieldValue(videoField, "videoOrCover")) ?? "",
handleImage:updateVideo,
},
{
name: 'videoCaptionUrl',
label: 'Video Caption ',
type: 'textarea',
required: false,
className: 'w-full',
defVal: getFormFieldValue(videoField, "videoCaptionUrl") ?? "",
},
{
name: 'lessonId',
label: String(itemId),
type: 'hidden',
required: true,
className: 'w-full',
defVal: String(itemId),
},
{
name: 'fileType',
label: 'VIDEO',
type: 'hidden',
required: true,
className: 'w-full',
defVal: 'VIDEO',
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

const VideoTab = () => (<>
{showVideoOption ? 
<div className="flex items-center space-x-3 font-bold">
Video-based 
<button onClick={toggleSwitch} type="button" aria-pressed={viewState} className={`relative mx-3 inline-flex h-6 w-11 pointer items-center rounded-full transition-colors focus:outline-none ${
    viewState ? "bg-blue-600" : "bg-gray-300"}`}><span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      viewState ? "translate-x-6" : "translate-x-1"
    }`}
  ></span>
</button>
</div> : null}
</>);

const tabs = [<LessonTab />, <TopicsTab />, <VideoTab />];
const canView = !!userRole && ["tutor"].includes(userRole.toLowerCase());
if (!canView) { return <AccessDenied />; }
return (
<div className="p-4">
<div className="flex justify-between items-center w-full">
<div><SubTitle string1={itemId ? 'Update Lesson' : 'New Lesson'} /></div>
<div>
{itemId && action === 'update' ? <TrashIcon
onClick={() => setDeleteItem(lessonId)}
className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
/> : null}</div>
</div>
<div className="mt-8">
<div role="tablist" aria-label="Example Tabs" className="flex items-center justify-between">
{/* Left group */}
<div className="flex">
{[0, 1].map((i) => (
<section key={`tabCon${i}`}>{i === 0 ? <button
key={`tab${i}`}
ref={(el) => {
refs.current[i] = el;
}}
role="tab"
aria-selected={active === i}
tabIndex={active === i ? 0 : -1}
onClick={() => {
setActive(i); 
}}
className={`px-6 py-4 text-base font-medium ${
active === i
? "text-white bg-[#14265C] pointer"
: "text-gray-900 bg-[#78B3FF33] pointer"
}`}
type="button"
>
{tabs[i]}
</button> : null}


{shouldShowTopics && i === 1 ? <button
key={`tab${i}`}
ref={(el) => {
refs.current[i] = el;
}}
role="tab"
aria-selected={active === i}
tabIndex={active === i ? 0 : -1}
onClick={() => {
setActive(i); // Always change tab
setShowVideoOption(true); 
}}
className={`px-6 py-4 text-base font-medium ${
active === i
? "text-white bg-[#14265C] pointer"
: "text-gray-900 bg-[#78B3FF33] pointer"
}`}
type="button"
>
{tabs[i]}
</button> : null}
</section>
))}
</div>

{/* Right tab (third tab exception) */}
<div>
<section 
className={`px-4 py-2 -mb-px text-sm font-medium focus:outline-none border-b-2 ${
active === 2
? "border-blue-800 text-blue-800 bg-blue-100"
: "border-transparent text-gray-600 hover:text-gray-800"
}`}
>
{tabs[2]}
</section>
</div>
</div>

{/* Tab panels */}
<div className="mt-4 p-[1%] sm:p-[2%]">
<div role="tabpanel" aria-hidden={active !== 0} className={active === 0 ? "" : "hidden"}>
<section>
<DynamicForm 
apiType={itemId ? `PUT` : `POST`}
key={`${pathname}-lesson-${formResetKey}`}
apiEndpoint={itemId ? `lessons/${itemId}` : `lessons`}
fields={lessonInfo}
submitButtonText={action === "update" ? "Update Lesson Information" : "Next"}
className="space-y-6"
updateFormField={updateFormField}
onSuccess={(data) => { returnHome(); }}
clearAllForms={clearAllForms} // ✅ added
/>
</section>
</div>
<div role="tabpanel" aria-hidden={active !== 1} className={active === 1 ? "" : "hidden"}>
<section>
<div className="w-full">
<div className="overflow-x-auto">
<table className="w-full border-collapse text-gray-500">
<thead className={`sticky top-0 z-10 ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<tr>
<th className="py-2 text-left text-sm">S/N</th>
<th className="py-2 text-left text-sm">Title</th>
<th className="py-2 text-left text-sm">Type</th>
<th className="py-2 text-center text-sm">Duration</th>
<th className="py-2 text-center text-sm">Actions</th>
</tr></thead>

<tbody>
{curTopic?.rows?.map((tutor, index) => (
<tr key={tutor.id || index} className={`border-b p-3 rounded-2xl transition-colors ${isDark ? "bg-gray-900 text-white border-b border-gray-600" : "border-b border-gray-200 bg-gray-50 text-[#535862]"}`}>
<td className="py-3 text-sm align-top">{index + 1}</td>
<td className="py-3 text-sm align-top">{tutor.title || "N/A"}</td>
<td className="py-3 text-sm align-top">{!tutor.fileType ? "N/A" : tutor.fileType.toLowerCase() === "video" ? "Video" : "Text"}
</td>
<td className="py-3 text-sm align-top text-center">{tutor.duration || "N/A"}</td>
<td className="py-3 text-center text-sm align-top">
<div className="flex items-center justify-center gap-2">
<ShowContent
triggerIcon={<EyeIcon className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />}
title={tutor.title || ''}
description={tutor.description || ''}
duration={`${tutor.duration} mins` || "N/A"}
videoUrl1={tutor.videoCaptionUrl || ''}
videoUrl2={tutor.videoOrFileUrl || ''}
mainContent={tutor.mainContent || ''}
/>
<Link 
href={{
pathname: "/user-area/lessons",
query: { action: "update", mod: "lesson-topic", topictitle: tutor.title ?? "", topicduration: tutor.duration ?? "", topiccontent: tutor.mainContent ?? "", topicdescription: tutor.description ?? "", topicId: tutor.id ?? "", itemId: tutor.id ?? "", type: tutor.fileType ?? "", video: tutor.videoOrFileUrl ?? "", caption: tutor.videoCaptionUrl ?? "", returnURL: `lessons?action=update&mod=lesson&itemId=${itemId}&subjectId=${subjectIdURL}&title=${title}&description=${description}&avatarOrCover=${avatarOrCover}` },
}}
aria-label={`Go to edit Page`}
title={`Go to edit Page`}
className="def-link-style"
><PencilIcon
className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
</Link>
<TrashIcon 
onClick={() => { handleDelete(tutor.id || '', tutor.title || '')}}
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
</section>  
<section className='my-15'>
<p className="border-b border-gray-400 pb-1 font-bold">Images</p>
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
<section className='mb-3 font-semibold'> Add New {viewState ? 'Video-Based Topic' : 'Text-Based Topic'} </section>
{viewState ? <DynamicForm
apiType={`POST`}
key={`${pathname}-video-${formResetKey}`}
apiEndpoint={`lesson-topics`}
fields={topicVideos}
submitButtonText="Save Topic"
className="space-y-6"
updateFormField={updateVideoField}
onSuccess={(data) => { refetchCurTopic();}}
clearAllForms={clearAllForms} // ✅ added
/> : <DynamicForm
apiType={`POST`}
key={`${pathname}-text-${formResetKey}`}
apiEndpoint={`lesson-topics`}
fields={topicFields}
submitButtonText="Save Topic"
className="space-y-6"
updateFormField={updateTopicField}
onSuccess={(data) => { refetchCurTopic();}}
clearAllForms={clearAllForms} // ✅ added
/>}
</div>
<div role="tabpanel" aria-hidden={active !== 2} className={active === 2 ? "" : "hidden"}>
<p></p>
</div></div></div>


{/* Delete lesson */}
{deleteItem && (
<Delete
apiUrl={`lessons/${deleteItem.id}`}
title={`Delete Lesson: ${curLesson?.title ?? getFormFieldValue(formField, "title") ?? title ?? ""}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteItem}
returnURL={`/user-area/lessons?deleteId=${deleteItem.id}`}
onClose={() => setDeleteItem(null)}
onSuccess={() => handleDeleteSuccess(deleteItem.id)}
/>
)}

{/* Delete TOPIC */}
{deleteTopic && (
<Delete
apiUrl={`lesson-topics/${deleteTopic}`}
title={`Delete Topic: ${curTopicTitle ?? ""}`}
message="Are you sure you want to proceed?"
cancelLabel="Cancel"
confirmLabel="Confirm"
isOpen={!!deleteTopic}
onClose={() => setDeleteTopic(null)}
onSuccess={() => handleDeleteSuccessCurTopic(deleteTopic)}
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