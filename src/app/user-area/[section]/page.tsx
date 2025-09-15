import type { Metadata } from 'next'
import { Suspense } from "react"
import TopBar from "@/components/dboardTop";
import SideBar, { SideBarFoot } from "@/components/sideBar"
import Dboard from "@/components/dboard"
import Students from "@/components/students"
import Leaderboard from "@/components/leaderboard"
import Quiz from "@/components/quiz"
import Lesson from "@/components/lessons"
import MobileNav from "@/components/mobileNav";
import Support from "@/components/support"

/*
import SideBar1 from "@/components/sideBar1"
import Image from 'next/image'
import Link from "next/link"
import Setting from "@/components/setting"
import Profile from "@/components/profile"
import Notification from "@/components/notification"
*/

interface PageProps {
params: Promise<{ section: string }>
searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function App({ params, searchParams }: PageProps) {
// Await params to resolve the Promise
const resolvedParams = await params
const section = resolvedParams.section ?? "home"

// Await searchParams to resolve the Promise
const resolvedSearchParams = await searchParams

// Extract query params with default values
const action = resolvedSearchParams.action ?? "defaultAction"
const mod = resolvedSearchParams.mod ?? "defaultMod"
const id = resolvedSearchParams.itemid ?? "defaultId"

// Dynamic rendering based on `section`
let Component


switch (section) {
case "dboard":
Component = <Dboard />
break
case "students":
Component = <Students />
break
case "leaderboard":
Component = <Leaderboard />
break
case "lessons":
Component = <Lesson />
break
case "quizzes":
Component = <Quiz />
break
case "support":
Component = <Support />
break
default:
Component = <div>Invalid mod</div>
}

/*
switch (section) {
case "setting":
// Handle sub-sections based on `mod`
switch (mod) {
case "profile":
Component = <Profile />
break
case "notification":
Component = <Notification />
break
case "settings":
Component = <Setting /> // Use Setting component
break
default:
Component = <div>Invalid mod</div>
}
break
default:
Component = <div>Invalid section</div>
}
*/

return (
<div className="">
<section><MobileNav /></section>


<div className="flex flex-col md:flex-row w-full">
{/* Sidebar */}
<section className='hidden md:block'>
<div className="w-full md:w-[250px] flex flex-col flex-shrink-0 justify-between p-4 bg-white">
<SideBar /> 
{/* Logout button at bottom */}
<SideBarFoot />
</div>
</section>

{/* Main area */}
<div className="flex-1 bg-gray-100 p-4 overflow-auto pl-[1%] sm:pl-[2%] md:pl-[3%]">
<div className='bg-white p-2 mb-5'><TopBar /></div>
<Suspense fallback={<div>Loading...</div>}>
{Component}
</Suspense>
</div>
</div>
</div>
)
}