"use client";
import { motion } from "framer-motion";
import React from "react";

interface UserProfile {
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
  details?: string;
}

interface UserProfilePopupProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const userProfile = {
name: "John Doe",
email: "john@example.com",
role: "Tutor",
details: "Tutor",
avatar: "https://i.pravatar.cc/150?img=3"
};

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


const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ user, isOpen, onClose }) => {
  return (
    <>
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
        className="fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl z-50 p-5 overflow-y-auto"
      >
        <button
          className="absolute pointer top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
		
		
		
		
		
		
		
		
		
 {/* Profile Info */}
        <div className="flex flex-col items-center space-y-2">
          {userProfile.avatar ? (
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-20 h-20 rounded-full border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
          )}
<h2 className="text-xl font-semibold uppercase">{userProfile.name}</h2>
<p className="text-base g-gray">{userProfile.role}</p>

          {userProfile.details && (
            <p className="text-gray-700 text-sm leading-relaxed">{userProfile.details}</p>
          )}
        </div>
		
		
		
		
<section className='mt-8 mb-4 text-lg text-base font-bold'>Basic Information</section>
<div className="space-y-2 g-gray mb-20">
{names.map((item, index) => (
<div
key={index}
className="flex justify-between items-center"
>
<span>{item.label}</span>
<span>{item.value}</span>
</div>
))}
</div>



<section className='mt-8 mb-4 text-lg text-base font-bold'>Contact Info</section>
<div className="space-y-2 g-gray mb-20">
{contact.map((item, index) => (
<div
key={index}
className="flex justify-between items-center"
>
<span>{item.label}</span>
<span>{item.value}</span>
</div>
))}
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
    </>
  );
};

export default UserProfilePopup;
