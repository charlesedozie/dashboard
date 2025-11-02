"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from 'next/navigation';
import Link from "next/link";
import { fetchData } from "@/utils/fetchData";
import { Data, ApiResponse } from "@/types";
import DataStudents from "@/components/dataStudents";
import {SearchPage, UserCalendar, CreateTutor} from "@/components/utils";
import Setting from "@/components/setting"
import {getUserField, getUser} from "@/utils/curUser";
import Dougnut from "@/components/dougnut";
import StudentList from "@/components/studentList";
import Feed from "@/components/feed";
import CalendarItems from "@/components/calendar";
import AllNotification from "@/components/allnotification"
import { useTheme } from "next-themes";

//import { Suspense } from 'react';

/*
//import  from "@/components/calendar";
/*
//import CreateQuiz from "@/components/newQuiz";
//import CreateMock from "@/components/newMock";
//const generateId = () => crypto.randomUUID();
//import CreateLesson from "@/components/newLesson";

/*
import NewSubject from "@/components/newSubject";
import Profile from "@/components/profile"


import TotalUsers from "@/components/totalUsers";

*/
//interface PageProps { params: { section: string };
//searchParams: { [key: string]: string | undefined }; // Handle multiple query params
//}

//export default async function App() {
export default function App() {
const userRole = getUserField<string>("role");
const [showTotalUsers, setshowTotalUsers] = useState<number>(0);
const [displayTotal, setdisplayTotal] = useState<string>('total');
const [totalUsers, setTotalUsers] = useState<number>(0);
const [activeUsers, setActiveUsers] = useState<number>(0);
const [totalLessons, setTotalLessons] = useState<number>(0);
const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
const { theme } = useTheme();
const isDark = theme === "dark";
//const [users, setUsers] = useState<Data[]>([]);
const params = useParams();
const searchParams = useSearchParams();
const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
if(event.target.value === 'active'){setshowTotalUsers(Number(activeUsers)); setdisplayTotal('active');}
if(event.target.value === 'total'){setshowTotalUsers(Number(totalUsers)); setdisplayTotal('total');}
};

// ✅ helper to check role
function isAdminRole(role?: string | null): boolean {
if (!role) return false;
return ["ADMIN", "SUPER_ADMIN"].includes(role.toUpperCase());
}

useEffect(() => {
async function getUsers() {
try {
const data = await fetchData<ApiResponse<Data[]>>("user/all");
if (data?.data) {
if(totalUsers != data.data.length){setTotalUsers(data.data.length);}
if(showTotalUsers != data.data.length){setshowTotalUsers(data.data.length);}
if(activeUsers != data.data.filter(user => user.status?.toLowerCase() === "active").length){setActiveUsers(data.data.filter(user => user.status?.toLowerCase() === "active").length);}
}
const dataLessons = await fetchData<ApiResponse<{ rows: Data[] }>>('lessons');
if (dataLessons?.data?.rows && totalLessons != dataLessons.data.rows.length) { setTotalLessons(dataLessons.data.rows.length); }

const dataQuizzes = await fetchData<ApiResponse<{ rows: Data[] }>>('quizzes');
if (dataQuizzes?.data?.rows && totalQuizzes != dataQuizzes.data.rows.length) { setTotalQuizzes(dataQuizzes.data.rows.length); }
} catch (error) { console.error("Error fetching dashboard data:", error); }}
getUsers();
}, []);

const summaryData = [
{ name: "Completed", value: 45 },
{ name: "Pending", value: 20 },
{ name: "In Progress", value: 25 },
{ name: "Failed", value: 10 },
];

const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const popup = searchParams.get("popup") ?? "defaultId";

let mainArea = (<section className={`${isDark ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
<section className='my-7'>
<div className="flex flex-wrap gap-4">
{/* Admin card (Users) */}
{isAdminRole(userRole) && (
<div className="w-full md:flex-1 flex flex-col items-stretch justify-start bg-[#78B3FF1A] p-4 rounded-2xl">
{/* Header row: left = label, right = select */}
<div className="w-full min-w-0 flex items-center justify-between mb-3">
{/* Left element */}
<div className="text-base font-medium">
Users
</div>

{/* Right element */}
<div className="flex items-center">
<select
id="totalUsers"
value={displayTotal}
onChange={handleChange}
className={`text-sm border-none py-1 outline-none focus:ring-0 cursor-pointer transition-colors duration-300
${
theme === "dark"
? "bg-gray-900 text-white border-gray-600 focus:ring-gray-500"
: "bg-transparent text-gray-900"
}`}
>
<option value="total">Total Users</option>
<option value="active">Active Users</option>
</select>
</div>
</div>

{/* Big number */}
<div className="w-full text-4xl">
{showTotalUsers.toLocaleString()}
</div>

{/* Graph */}
<div className="w-full my-2">
<Image
src="/graph.webp"
alt="Users analytics"
title="Users analytics"
width={100}
height={40}
style={{ objectFit: "cover" }}
/>
</div>
</div>
)}


<div className="w-full md:flex-1 flex flex-col items-start justify-start bg-[#FF85111A] p-[2%] rounded-2xl">
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

{/* Hide below md, show from md and above */}
<div className="w-full md:flex-1 flex flex-col items-start justify-start bg-[#14265C1A] p-[2%] rounded-2xl">
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
/></section></div></div>
</section>
<section className={`${isDark ? "bg-black text-white" : "bg-white text-black"} p-3 mb-5`}><DataStudents /></section>
<section className='py-1'>
<div className="grid grid-cols-1 lg:grid-cols-[60%_35%] gap-8">
{isAdminRole(userRole) && (
<div> 
<section className={`${isDark ? "bg-black text-white" : "bg-white text-black"} p-4`}><StudentList /> </section>
</div>
)}

<div className="p-4 w-full">
<Dougnut summaryData={summaryData} />
</div></div></section>
</section>);

let content = ( 
<div className={` ${isDark ? "bg-black text-white" : "bg-gray-100 text-black"} p-3`}>
<div className="text-2xl font-semibold my-2">Overview</div>
<div className="flex w-full">
{/* Main Content */}
<div className="w-full lg:w-[78%] sm:pr-2 md:pr-4 lg:pr-6 transition-all duration-300">
<section className={`${isDark ? "bg-black text-white" : "bg-gray-100 text-black"}`}>{mainArea}</section>
<section className='block lg:hidden'>
<section className={`${isDark ? "bg-black text-white" : "bg-white text-black"} mb-5`}><UserCalendar /> </section>
<section className={` ${isDark ? "bg-black text-white" : "bg-white text-black"} mb-20`}><Feed /> </section>
</section>
</div>

{/* Sidebar: Visible only on large screens */}
<div className="hidden lg:block lg:w-[22%] px-2 transition-all duration-300">
<div className={`${isDark ? "bg-black text-white" : "bg-white text-black"} mb-10 rounded-2xl`}><UserCalendar /> </div>
<div className={`${isDark ? "bg-black text-white" : "bg-white text-black"} mb-5 rounded-2xl`}><Feed /> </div>
</div></div></div>
);

if (action === 'create' && mod === 'tutor') { content = <section className='p-4'><CreateTutor /></section>; } 
if (action === 'list' && mod === 'settings') { content = <section className='p-4'><Setting /></section>; } 
if (action === 'list' && mod === 'calendar') { content = <section className='p-4'><CalendarItems /></section>; }
if (action === 'list' && mod === 'notification') { content = <section className='p-4'><AllNotification /></section>; } 
if (action === 'search' && mod === 'search') { content = <section className='p-4'><SearchPage /></section>; } 

/*

/*


if (action === 'create' && mod === 'subject') { content = <NewSubject />; }
if (action === 'list' && mod === 'profile') { content = <Profile />; } 
*/

return ( content  );
}
