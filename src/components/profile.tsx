"use client";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";
import {Data} from "@/types";
import {getUser} from "@/utils/curUser";
 import { useTheme } from "next-themes";

let userDetails = JSON.parse(sessionStorage.getItem("user") || "{}");
interface UserProfilePopupProps {
  user?: Data;
  isOpen: boolean;
  onClose: () => void;
}

const names = [
{ label: "Sex", value: "value" },
{ label: "Location", value: "value" },
{ label: "Subject Taught", value: "value" },
];

const contact = [
{ label: "Email", value: "value" },
{ label: "Phone", value: "value" },
];


const activity = [
{ label: "Uploaded Lessons", value: "value" },
{ label: "Uploaded Quizzes", value: "value" },
{ label: "Students Lessons Rating", value: "value" },
];


const analytics = [
{ label: "Total students taught", value: "value" },
{ label: "Average class attendance", value: "value" },
];

 //const user = getUser()?.user;
 const user = getUser()?.user as Data | undefined;
 const userSubjects = (getUser()?.user?.subjects ?? []) as Data[];

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ isOpen, onClose }) => {
const { theme } = useTheme();
const isDark = theme === "dark";

return (
    <section>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 right-0 w-full md:w-96 h-full shadow-xl z-50 p-5 overflow-y-auto 
${isDark ? "bg-black text-white" : "bg-white text-black"} transition-colors duration-300`}>
        <button
          className="absolute pointer top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
		
		
		
		
		
		
		
		
		
 {/* Profile Info */}
        <div className="flex flex-col items-center space-y-2">
         

{user?.avatar ? (
  <img
    src={user.avatar}
    alt={user.fullName ?? "image placeholder"}
    className="rounded-full border"
    width={58}
    height={58}
  />
) : (
  <Image
    src="/avatar.png"
    alt={user?.fullName ?? "image placeholder"}
    className="rounded-full border"
    width={48}
    height={48}
  />
)}




<p className="text-baee text-center font-semibold uppercase">{user?.fullName || user?.username}</p>
<p className="text-base g-gray">{user?.role}</p></div>
		

<section className='mt-8 mb-4 text-lg text-base font-bold'>Basic Information</section>
<div className="space-y-2 g-gray mb-20">

<div className="flex justify-between items-center">
<span>Gender</span>
<span className="capitalize">{user?.gender}</span>
</div>

<div className="flex justify-between items-center">
<span>Location</span>
<span></span>
</div>

<div className="flex justify-between items-center">
<span>Subjects Taught</span>
<span>
{userSubjects?.map((item, index) => (
<span key={item.id}>
<span>{item.title}</span><br />
</span>
))}
</span>
</div>

</div>



<section className='mt-8 mb-4 text-lg text-base font-bold'>Contact Info</section>
<div className="space-y-2 g-gray mb-20">
<div className="flex justify-between items-center">
<span>Email</span>
<span>{user?.email}</span>
</div>

<div className="flex justify-between items-center">
<span>Phone</span>
<span>{user?.phone}</span>
</div>
</div>





<section className='mt-8 mb-4 text-lg text-base font-bold'>Teaching Activity</section>
<div className="space-y-2 g-gray mb-20">
{activity.map((item, index) => (
<div
key={index}
className="flex justify-between items-center"
>
<span>{item.label}</span>
<span>{item.value}</span>
</div>
))}
</div>


<section className='mt-8 mb-4 text-lg text-base font-bold'>Performance & Analytics</section>
<div className="space-y-2 g-gray mb-20">
{analytics.map((item, index) => (
<div
key={index}
className="flex justify-between items-center"
>
<span>{item.label}</span>
<span>{item.value}</span>
</div>
))}
</div>		
      </motion.div>
    </section>
  );
};

export default UserProfilePopup;
