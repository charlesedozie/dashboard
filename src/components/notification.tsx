"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from 'next/link';
import { Wallet } from "lucide-react";
import { ArrowRight } from "lucide-react";
import ActionDropdown from "./dropDown";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}


 const actions = [
    { label: "Add Lesson", href: "/user-area/dboard?action=add&mod=lesson" },
    { label: "Upload Quiz", href: "/user-area/dboard?action=upload&mod=quiz" },
    { label: "Add Mock Exam", href: "/user-area/dboard?action=add&mod=mock-exam" },
  ];

 // Create 12 sample requests
  const requests = Array.from({ length: 0 }, (_, i) => ({
    id: i + 1,
    title: "New Withdrawal Request",
    description: "₦5,000 withdrawal requested by Student123",
    time: "Just now",
  }));

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ isOpen, onClose }) => {
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
        className="fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-xl z-50 p-5 overflow-y-auto"
      >
        <button
          className="absolute top-4 pointer right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
<div className="flex w-full mb-8 mt-10">
{/* Left: takes the rest */}
<div className="flex-1 pr-5 text-lg font-semibold my-2">
Notifications
</div>
{/* Right: only as wide as content */}
<div className="flex items-center gap-4"><ActionDropdown items={actions} /></div>
</div>

		
{requests.map((request) => (		
<div key={request.id} className="flex justify-between p-2 mt-2 mb-5 bg-white rounded-lg shadow border border-gray-200">
{/* Left side: icon + text */}
<div className="flex flex-1 min-w-0 items-start gap-1">
{/* Icon container */}
<div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0">
<Wallet size={20} className="text-gray-700" />
</div>
{/* Text content */}

<div className="min-w-0">
<h3 className="font-bold text-lg">
New Withdrawal Request
</h3>
<p className="text-sm text-gray-600">
₦5,000 withdrawal requested by Student123 
</p></div></div>

{/* Right side: only as wide as content */}
<div className="flex-shrink-0 text-sm text-gray-500 text-right whitespace-nowrap ml-4">
<span
className="inline-block w-2 h-2 rounded-full mr-2 bg-[#69BF6F]" />
Just now
</div>
</div>
))}

<div className="flex justify-center mt-12">
<Link
href="/user-area/dboard?action=list&mod=notification"
aria-label={`Go to Notification Page`}
title={`Go to Notification Page`}
onClick={onClose}
className="inline-flex items-center gap-1 text-[#14265C] border border-[#14265C] rounded-xl px-6 py-3 text-base font-medium hover:bg-gray-100 hover:text-blue-800 transition-colors"
>
<span>View All Notifications</span>
<ArrowRight className="w-4 h-4" />
</Link>
</div>
      </motion.div>
    </>
  );
};

export default UserProfilePopup;
