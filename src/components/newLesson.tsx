"use client";
import React, { useState, useRef, useEffect } from "react";
import DynamicForm from "./newItem";
import SubTitle from "./subTitle";
import { InputField, Data, ApiResponse, RowsResponse1 } from "@/types";
import { fetchData } from "@/utils/fetchData"; 
//import SupportList from "./supportList";
import { useSearchParams } from "next/navigation";

export default function NewLesson() {
const [active, setActive] = useState(0);
const refs = useRef<(HTMLButtonElement | null)[]>([]);
const [viewState, setViewState] = useState(false);
const [showVideoOption, setShowVideoOption] = useState(false);
const [subject, setSubject] = useState<Data[]>([]);
const [userId, setUserId] = useState<string | null>(null);
const [lessonId, setLessonId] = useState<string | null>(null);
const searchParams = useSearchParams();
const itemId = searchParams.get("itemId") ?? null;
const subjectId = searchParams.get("subjectId") ?? null;
const title = searchParams.get("title") ?? null;
const description = searchParams.get("description") ?? null;
const avatar = searchParams.get("avatar") ?? null;


useEffect(() => {
async function loadSubject() {
try {
const data = await fetchData<ApiResponse<RowsResponse1>>("subjects");
if (data?.data) {
const newArray = data.data.map(item => ({
label: String(item.title ?? ''),
value: String(item.id ?? '')
}));
const sortedArray = newArray.sort((a, b) => a.label.localeCompare(b.label));
setSubject(sortedArray);
}} 
catch (error) { console.error("Error fetching data:", error); }}
loadSubject(); }, []);

const toggleSwitch = () => {
setViewState((prev) => !prev);
};

const user = sessionStorage.getItem("user");
if (user) {
const userInfo = JSON.parse((user))
console.log(userInfo.id)
if(userId !== userInfo.id){setUserId(userInfo.id);}
}

const formFields: InputField[] =  [
    {
      name: 'subjectId',
      label: 'Lesson Subject',
      type: 'select',
      required: true,
      className: 'w-full',
      options: subject,
      defVal: subjectId,
    },
    {
      name: 'title',
      label: 'Lesson Title',
      type: 'text',
      placeholder: 'Enter title',
      required: true,
      className: 'w-full',
      defVal: title,
    }, 
	{
      name: 'description',
      label: 'About Lesson',
      type: 'textarea',
      placeholder: 'Enter description',
      required: true,
      className: 'w-full',
      defVal: description,
    },
    {
      name: 'avatar',
      label: 'Upload Lesson Image',
      type: 'image',
      required: true,
      className: 'w-full',
      defVal: avatar,
    },
    {
      name: 'userId',
      label: '',
      type: 'hidden',
      required: false,
      className: 'w-full',
      defVal: userId,
    },
    {
      name: 'avatarOrCover',
      label: '',
      type: 'hidden',
      required: false,
      className: 'w-full',
      defVal: 'userIadadadad',
    },
 ];
 
const topicFields: InputField[] =  [ 
    {
      name: 'title',
      label: 'Topic Title',
      type: 'text',
      placeholder: 'Enter title',
      required: true,
      className: 'w-full',
    },
    {
      name: 'duration',
      label: 'Topic Duration',
      type: 'text',
      placeholder: 'Enter duration',
      required: true,
      className: 'w-full',
    },
	 {
      name: 'topictext',
      label: 'Add Topic Text',
      type: 'html',
      placeholder: 'Enter topic text',
      required: true,
      className: 'w-full',
    },
	{
      name: 'avatarOrCover',
      label: 'Add Image',
      type: 'image',
      required: false,
      className: 'w-full',
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
    },
    {
      name: 'duration',
      label: 'Topic Duration',
      type: 'text',
      placeholder: 'Enter duration',
      required: true,
      className: 'w-full',
    },
    {
      name: 'videoOrCover',
      label: 'Upload Video',
      type: 'image',
      required: true,
      className: 'w-full',
    },
	{
      name: 'avatarOrCover',
      label: 'Attach Video Caption',
      type: 'image',
      required: true,
      className: 'w-full',
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
      <button
        onClick={toggleSwitch}
        type="button"
        aria-pressed={viewState}
        className={`relative mx-3 pointer inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          viewState ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            viewState ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div> : null}
</>);

const tabs = [<LessonTab />, <TopicsTab />, <VideoTab />];

return (
<div className="p-4"><SubTitle string1='New Lesson' />
<div className="mt-8">


<div role="tablist" aria-label="Example Tabs" className="flex items-center justify-between"
>
{/* Left group */}
<div className="flex">
  {[0, 1].map((i) => (
    <button
      key={`tab${i}`}
      ref={(el) => {
        refs.current[i] = el;
      }}
      role="tab"
      aria-selected={active === i}
      tabIndex={active === i ? 0 : -1}
      onClick={() => {
        setActive(i); // Always change tab
        if (i === 1) {
          setShowVideoOption(true); // ✅ Trigger only when tab index is 1
        }  
    if (i === 0) {
          setShowVideoOption(false); // ✅ Trigger only when tab index is 1
        }
      }}
      className={`px-6 py-4 text-base font-medium ${
        active === i
          ? "text-white bg-[#14265C] pointer"
          : "text-gray-900 bg-[#78B3FF33] pointer"
      }`}
      type="button"
    >
      {tabs[i]}
    </button>
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
<div className="mt-4 bg-white p-[1%] sm:p-[2%]">
<div role="tabpanel" aria-hidden={active !== 0} className={active === 0 ? "" : "hidden"}>
<section>
<DynamicForm
apiEndpoint={`lessons`}
fields={formFields}
submitButtonText="Next"
className="space-y-6"
onSuccess={(data) => { setLessonId(data);
console.log("Form successfully submitted:", data); }}
/>
</section>
</div>
<div role="tabpanel" aria-hidden={active !== 1} className={active === 1 ? "" : "hidden"}>
{viewState ? <DynamicForm
apiEndpoint={`${process.env.NEXT_PUBLIC_API_BASE}/user`}
fields={topicVideos}
submitButtonText="Save Topic"
className="space-y-6"
/> : <DynamicForm
apiEndpoint={`${process.env.NEXT_PUBLIC_API_BASE}/user`}
fields={topicFields}
submitButtonText="Save Topic"
className="space-y-6"
/>}
</div>
<div role="tabpanel" aria-hidden={active !== 2} className={active === 2 ? "" : "hidden"}>
<p>Content for Tab 3</p>
</div>
</div>
</div>


</div>
);
};
