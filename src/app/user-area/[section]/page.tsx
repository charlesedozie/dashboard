import { Suspense } from "react"
import SideBar, {SideBarFoot} from "@/components/sideBar"
import TopBar from "@/components/dboardTop";
import Lesson from "@/components/lessons"
import Dboard from "@/components/dboard"
import AdminControl from "@/components/adminControl"
import Quiz from "@/components/quiz"
import Students from "@/components/students"
import Support from "@/components/support"
import Leaderboard from "@/components/leaderboard"
import Mock from "@/components/mock"
import DefPage from "@/components/defPage"
import MobileWrapper from "@/components/mobileWrapper"

/*

import Link from 'next/link';
*/

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
case "admin-control":
Component = <AdminControl />
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
case "mock":
Component = <Mock />
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
<div>
<section>
<MobileWrapper />
</section>
<div className="flex flex-col md:flex-row w-full h-full">
{/* Sidebar */}
<section className='hidden md:block'>
<div className="w-full md:w-[250px] flex flex-col flex-shrink-0 justify-between h-full">
<div><SideBar /></div>
<section className="flex flex-col h-full">
<div className="flex-grow"></div>
{/* Bottom */}
<div><SideBarFoot /></div>
</section>
</div>
</section>

{/* Main area */}
<div className={`flex-1`}>
<div><TopBar /></div>
<DefPage />
</div>
</div>
</div>
)
}