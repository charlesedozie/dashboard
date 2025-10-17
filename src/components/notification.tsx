"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from 'next/link';
import { Wallet } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
}


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
</div>

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
