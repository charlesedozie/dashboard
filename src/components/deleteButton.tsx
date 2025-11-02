"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

interface ConfirmModalProps {
apiUrl: string;
title: string;
message: string;
cancelLabel?: string;
returnURL?: string;
confirmLabel?: string;
isOpen: boolean;
onClose: () => void;
onSuccess?: (data: any) => void;
onCancel?: () => void;   // ✅ optional cancel callback
}

export default function ConfirmModal({
apiUrl,
title,
message,
returnURL,
cancelLabel = "Cancel",
confirmLabel = "Confirm",
isOpen,
onClose,
onSuccess,
onCancel, // ✅ receive cancel callback
}: ConfirmModalProps) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const router = useRouter();
if (!isOpen) return null;

const handleConfirm = async () => {
setLoading(true);
setError(null);
try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiUrl}`,
 { method: "DELETE",
     headers: {
        "Content-Type": "application/json",
		"Authorization": `Bearer ${sessionStorage.getItem("token")}`, // Bearer Token
      },
  });

if (!res.ok) {
throw new Error("Request failed");
}
const data = await res.json();
if (onSuccess) onSuccess(data);
onClose(); 
if(returnURL){router.push(returnURL);}
} catch (err: any) {
setError(err.message || "Something went wrong");
} finally {
setLoading(false);
}
};

return (
<div
style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
className="fixed inset-0 flex items-center justify-center z-50"
>
<div style={{ pointerEvents: "auto" }} 
className="
bg-white rounded-lg shadow-lg 
w-[90%] sm:w-[70%] lg:w-[50%]
">
<h2 className="text-xl text-white p-3 font-semibold def-bg mb-2">{title}</h2>
<p className="text-gray-600 mb-3 p-3">{message}</p>
{error && <p className="text-red-500 p-3 text-sm">{error}</p>}

<div className="flex justify-center gap-3 p-3 mb-3">
<button
className="px-4 py-2 pointer rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
onClick={() => {
if (onCancel) onCancel();  // ✅ perform custom cancel callback
onClose();                 // ✅ close modal
}}
disabled={loading}
>
{cancelLabel}
</button>
<button
className={`px-4 py-2 pointer rounded text-white ${
loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
}`}
onClick={handleConfirm}
disabled={loading}
>
{loading ? "Processing..." : confirmLabel}
</button>
</div>
</div>
</div>
);
}
