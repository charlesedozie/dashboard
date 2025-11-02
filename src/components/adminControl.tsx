"use client";

import Link from "next/link";
import { FProps } from "@/types";
import SubTitle from "./subTitle";
import Tutors from "./adminTutors";
import AdminContent from "./adminContent";
import AdminMgt from "./adminMgt";
import { useState } from "react";
import { getUserField } from "@/utils/curUser";
import { AccessDenied } from "@/components/utils";
import { useTheme } from "next-themes";

interface Tab {
  name: string;
  content: React.ReactNode;
}

export default function App(options: FProps) {
  const [activeTab, setActiveTab] = useState("Tutor Management");
  const userRole = getUserField<string>("role");

  const { theme } = useTheme();
  const isDark = theme === "dark";



  // ✅ Build tabs dynamically based on role
  const tabs: Tab[] = [];

  if (userRole?.toLowerCase() === "super_admin") {
    tabs.push({ name: "Tutor Management", content: <Tutors /> });
  }

  tabs.push(
    { name: "Content Control", content: <AdminContent /> },
    { name: "Transaction Management", content: <AdminMgt /> }
  );

  // ✅ Allow only admins or super_admins to view page
  const canView =
    !!userRole && ["admin", "super_admin"].includes(userRole.toLowerCase());

  if (!canView) {
    return <AccessDenied />;
  }

  return (
    <section className="w-full transition-colors duration-300">
      <div className="flex flex-wrap gap-4">
        {/* Left div */}
        <div className="flex-1 min-w-[200px]">
          <SubTitle
            string1="Admin Control"
            string2="Manage Tutors, Content, and Transactions in One Place"
          />
        </div>

        {/* Right div - Add Account button */}
        {userRole?.toLowerCase() === "super_admin" && (
        <div className="w-auto">
          <Link
            href="/user-area/dboard?action=create&mod=tutor"
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="flex items-center space-x-2 cursor-pointer">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-2xl text-3xl transition-colors duration-300 
                ${isDark ? "bg-gray-700 text-white" : "bg-[#14265C] text-white"}`}
              >
                +
              </div>
              <span
                className={`text-lg font-medium transition-colors duration-300 
                ${isDark ? "text-gray-100" : "text-[#14265C]"}`}
              >
                Add Account
              </span>
            </div>
          </Link>
        </div>
        )}
      </div>

      {/* Tabs container */}
      <div
        className={`h-full transition-colors duration-300 mt-3 rounded-2xl shadow-sm ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-white text-black"
        }`}
      >
        {/* Tab headers */}
        <div
          className={`flex mb-5 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 pointer py-2 text-sm font-medium transition-colors duration-300 rounded-t-2xl
                ${
                  activeTab === tab.name
                    ? isDark
                      ? "border-b-2 border-blue-400 text-blue-400"
                      : "border-b-2 border-[#14265C] text-[#14265C]"
                    : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          className={`p-4 text-sm transition-colors duration-300 ${
            isDark ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {tabs.find((tab) => tab.name === activeTab)?.content}
        </div>
      </div>
    </section>
  );
}
