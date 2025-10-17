"use client";

import { useState, ReactNode } from "react";

interface Option {
title: string;
image: string | null;
}

interface PopupProps {
question: string;
answer: string;
type: string;
avatar: string; 
options: Option[];
triggerText?: string;
triggerIcon?: ReactNode;
}

export default function Popup({
question,
answer,
type,
avatar,
options=[],
triggerText,
triggerIcon,
}: PopupProps) {
const [isOpen, setIsOpen] = useState(false);

const openPopup = () => setIsOpen(true);
const closePopup = () => setIsOpen(false);

// ✅ helper: check if image URL is valid
const isValidImageUrl = (url: string | null): boolean => {
if (!url) return false;
try {
new URL(url);
return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
} catch {
return false;
}
};

return (
<>
{/* Trigger Button */}
<button
onClick={openPopup}>
{triggerIcon || triggerText || "Open"}
</button>




{/* Popup Overlay */}
{isOpen && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
{/* Popup Box */}
<div className="relative w-[90%] h-[90%] bg-white rounded-xl shadow-xl overflow-y-auto p-8 text-left">
{/* Close Button */}
<button
onClick={closePopup}
className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl leading-none pointer"
>
&times;
</button>

{/* Popup Content */}
<div className="h-full flex flex-col text-left">
<h2 className="text-3xl font-bold mb-3">Question: {question}</h2>
<p className="text-gray-700 mb-6 font-semibold">Cover or Avatar: {isValidImageUrl(avatar) ? (
<img
src={avatar as string}
alt={question}
className="w-16 h-16 object-cover rounded-md border"
/>
) : (
<div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-md border">
No image
</div>
)}
</p>
<p className="text-gray-700 mb-6"><span className="font-semibold">Correct Answer:</span> {answer}</p>
<p className="text-sm text-gray-500 mb-6"><span className="font-semibold">Type: </span>{type}</p>
{type?.toLowerCase() === "multiple_choice" && (
<section>
<p className="text-sm text-gray-500 mb-6 font-semibold">Options</p>
<p className="text-sm text-gray-500 mb-6">
{options?.map((tutor, index) => (
<section key={`optionsshow${index}`} className="mb-10">
<section className="py-3 text-sm align-top">{tutor.title}</section>
<section className="py-3 text-sm align-top"> {isValidImageUrl(tutor.image) ? (
<img
src={tutor.image as string}
alt={tutor.title}
className="w-16 h-16 object-cover rounded-md border"
/>
) : (
<div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-md border">
No image
</div>
)}</section>
</section>
))}
</p>
</section>
)}
</div>
</div>
</div>
)}
</>
);
}
