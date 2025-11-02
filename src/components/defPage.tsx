"use client";

import { Suspense, useEffect, useState } from "react";
//import Image from "next/image";
//import SideBar, { SideBarFoot } from "@/components/sideBar";
//import MobileMenu from "@/components/mobileMenu";
//import MobileFooter from "@/components/mobileNav";
//import TopBar from "@/components/dboardTop";
import Lesson from "@/components/lessons";
import Dboard from "@/components/dboard";
import AdminControl from "@/components/adminControl";
import Quiz from "@/components/quiz";
import Students from "@/components/students";
import Support from "@/components/support";
import Leaderboard from "@/components/leaderboard";
import Mock from "@/components/mock";
import { useSearchParams, useParams } from "next/navigation";
import { useTheme } from "next-themes";

export default function App() {
  const params = useParams();
  const searchParams = useSearchParams();
const { theme } = useTheme();
const isDark = theme === "dark";

  const [section, setSection] = useState("home");
  const [action, setAction] = useState("defaultAction");
  const [mod, setMod] = useState("defaultMod");
  const [id, setId] = useState("defaultId");

  // Sync params & searchParams with state
  useEffect(() => {
    if (params?.section) setSection(params.section as string);
    if (searchParams) {
      setAction(searchParams.get("action") || "defaultAction");
      setMod(searchParams.get("mod") || "defaultMod");
      setId(searchParams.get("itemid") || "defaultId");
    }
  }, [params, searchParams]);

  // Dynamic rendering based on section
  let Component;
  switch (section) {
    case "dboard":
      Component = <Dboard />;
      break;
    case "admin-control":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><AdminControl /></section>;
      break;
    case "students":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><Students /></section>;
      break;
    case "leaderboard":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><Leaderboard /></section>;
      break;
    case "lessons":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><Lesson /></section>;
      break;
    case "quizzes":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><Quiz /></section>;
      break;
    case "support":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><Support /></section>;
      break;
    case "mock":
      Component = <section className={`${isDark ? null : "bg-white"} p-4`}><Mock /></section>;
      break;
    default:
      Component = <div>Invalid mod</div>;
  }

return (
<div className={`${isDark ? "bg-black text-white" : "bg-gray-100 text-black"} p-2`}><Suspense fallback={<div>Loading...</div>}>{Component}</Suspense></div>
);
}
