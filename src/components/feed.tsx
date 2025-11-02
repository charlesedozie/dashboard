"use client";

export default function App() {
return (
<div className='p-3 rounded-3xl border border-white'>
<div className="flex justify-between items-center w-full">
{/* Left element */}
<div className="text-base font-bold">Activity Feed</div>
{/* Right element with rounded blue background */}
<div className="bg-[#C4E9FD] text-gray-700 p-2 rounded-full text-xs">
18th August, 2025
</div>
</div>

<ul className="space-y-3">
</ul>
</div>
);
}
