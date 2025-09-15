"use client";

import { FProps } from "@/types";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton(options: FProps){
const router = useRouter();

return (<>

{/* Render only if options.string1 === 'button' */}
{options.string1 === "btn" && (
<section
onClick={() => router.back()}
className="flex items-center gap-2 px-4 pointer py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
><ChevronLeft size={18} /> {options.string2 ?? 'Back'}
</section>
)}



</>
);
}
