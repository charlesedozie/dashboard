"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {SearchPage, UserCalendar, CreateTutor} from "@/components/utils";
//import  from "@/components/calendar";
import CalendarItems from "@/components/calendar";
import { fetchData } from "@/utils/fetchData";
import { Data, ApiResponse } from "@/types";
import Dougnut from "@/components/dougnut";
import Link from "next/link";
import StudentList from "@/components/studentList";
import Feed from "@/components/feed";
import Setting from "@/components/setting"
import DataStudents from "@/components/dataStudents";
import CreateQuiz from "@/components/newQuiz";
const generateId = () => crypto.randomUUID();

/*
import CreateLesson from "@/components/newLesson";
import NewSubject from "@/components/newSubject";
import Profile from "@/components/profile"
import AllNotification from "@/components/allnotification"


import TotalUsers from "@/components/totalUsers";

*/
//interface PageProps { params: { section: string };
//searchParams: { [key: string]: string | undefined }; // Handle multiple query params
//}

//export default async function App() {
export default function App() {
const [showTotalUsers, setshowTotalUsers] = useState<number>(0);
const [displayTotal, setdisplayTotal] = useState<string>('total');
const [totalUsers, setTotalUsers] = useState<number>(0);
const [activeUsers, setActiveUsers] = useState<number>(0);
const [totalLessons, setTotalLessons] = useState<number>(0);
const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
const [users, setUsers] = useState<Data[]>([]);
const params = useParams();
const searchParams = useSearchParams();

const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
if(event.target.value === 'active'){setshowTotalUsers(Number(activeUsers)); setdisplayTotal('active');}
if(event.target.value === 'total'){setshowTotalUsers(Number(totalUsers)); setdisplayTotal('total');}
};

useEffect(() => {
async function getUsers() {
try {
const data = await fetchData<ApiResponse<Data[]>>("user/all");
if (data?.data) {
setTotalUsers(data.data.length);
setshowTotalUsers(data.data.length);
setActiveUsers(data.data.filter(user => user.status?.toLowerCase() === "active").length);
}
const dataLessons = await fetchData<ApiResponse<{ rows: Data[] }>>('lessons');
if (dataLessons?.data?.rows) { setTotalLessons(dataLessons.data.rows.length); }

const dataQuizzes = await fetchData<ApiResponse<{ rows: Data[] }>>('quizzes');
if (dataQuizzes?.data?.rows) { setTotalQuizzes(dataQuizzes.data.rows.length); }
} catch (error) { console.error("Error fetching dashboard data:", error); }}
getUsers();
}, []);


const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const popup = searchParams.get("popup") ?? "defaultId";

let mainArea = (<>
<section className='my-7'>
<div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
<div className="bg-[#78B3FF1A] p-[1%] sm:p-[2%] md:p-[4%] xl:p-[6%] rounded-lg">
<section>
<div className="flex justify-between items-center w-full mb-3">
{/* Left element */}
<div>Users</div>
{/* Right element */}
<div className="">
<select
id="totalUsers"
value={displayTotal}
onChange={handleChange}
className="text-sm bg-transparent pointer border-none focus:border-none focus:ring-0 outline-none"
>
<option className='pointer' value='total'>Total Users</option>
<option className='pointer' value='active'>Active Users</option>
</select>
</div>
</div>
</section>
<section className="text-4xl">{showTotalUsers.toLocaleString()}</section>
<section className='my-2'>
<Image
src={'/graph.webp'}
alt={'Users analytics'}
title={'Users analytics'}
width={100}
height={40}
style={{ objectFit: 'cover' }}
/>
</section>
</div>
<div className="bg-[#FF85111A] p-[1%] sm:p-[2%] md:p-[4%] xl:p-[6%] rounded-lg">
<div className='mb-3'>Lessons Uploaded</div>
<section className="text-4xl">{totalLessons.toLocaleString()}</section>
<section className='my-2'>
<Image
src={'/graph.webp'}
alt={'Users analytics'}
title={'Users analytics'}
width={100}
height={40}
style={{ objectFit: 'cover' }}
/>
</section>
</div>
<div className="bg-[#14265C1A] p-[1%] sm:p-[2%] md:p-[4%] xl:p-[6%] rounded-lg">
<section className='mb-3'>Quiz Uploaded</section>
<section className="text-4xl">{totalQuizzes.toLocaleString()}</section>
<section className='my-2'>
<Image
src={'/graph.webp'}
alt={'Users analytics'}
title={'Users analytics'}
width={100}
height={40}
style={{ objectFit: 'cover' }}
/>
</section>
</div></div></section>
<section className='bg-white p-6 mb-5'><DataStudents /></section>

<section className='py-1'>
<div className="grid grid-cols-1 lg:grid-cols-[60%_35%] gap-8">
<div className="bg-white p-2">
<div>  
<div className="flex w-full">
{/* Left: takes the rest */}
<div className="flex-1 pr-5">
Students <span className="inline-block px-3 py-1 text-sm rounded-full" style={{ backgroundColor:"#FF85114A" }}> students</span>
</div>
{/* Right: only as wide as content */}
<div className="flex items-center gap-4 font-semibold"><Link
href="/user-area/students" 
aria-label={`Go to Students Page`}
title={`Go to Students Page`}
className="def-link-style px-4 py-1 hover:bg-gray-100 transition"
>View all</Link></div>
</div>
<section className='p-4'><StudentList /></section>
</div>
</div>

<div className="bg-white p-4 w-full">
<div className="w-full h-64">
<Dougnut />
</div>
</div>


</div></section>
</>);

let content = ( 
<div>
<div className="text-2xl font-semibold my-2">Overview</div>
<div className="flex w-full">
{/* Main Content */}
<div className="w-full lg:w-[78%] sm:pr-2 md:pr-4 lg:pr-6 transition-all duration-300">
<section>{mainArea}</section>
<section className='block lg:hidden'>
<section className='mb-5'><UserCalendar /></section>
<section className='mb-20'><Feed /></section>
</section>
</div>

{/* Sidebar: Visible only on large screens */}
<div className="hidden lg:block lg:w-[22%] px-2 transition-all duration-300">
<div className="mb-10 bg-white rounded-2xl"><UserCalendar /></div>
<div className="mb-5 bg-white rounded-2xl"><Feed /></div>
</div></div></div>
);

if (action === 'search' && mod === 'search') { content = <SearchPage />; }
if (action === 'list' && mod === 'calendar') { content = <CalendarItems />; }
if (action === 'create' && mod === 'tutor') { content = <CreateTutor />; } 
if (action === 'list' && mod === 'settings') { content = <Setting />; } 
if (action === 'create' && mod === 'quiz') { content = <CreateQuiz />; } 
/*

if (action === 'create' && mod === 'lesson') { content = <CreateLesson />; } 
if (action === 'create' && mod === 'subject') { content = <NewSubject />; }
if (action === 'list' && mod === 'notification') { content = <AllNotification />; }  
if (action === 'list' && mod === 'profile') { content = <Profile />; } 
*/

return ( content  );
}
