"use client";

import { useState } from "react";

interface ConfirmModalProps {
apiUrl: string;
title: string;
message: string;
cancelLabel?: string;
confirmLabel?: string;
isOpen: boolean;
onClose: () => void;
onSuccess?: (data: any) => void;
}

export default function ConfirmModal({
apiUrl,
title,
message,
cancelLabel = "Cancel",
confirmLabel = "Confirm",
isOpen,
onClose,
onSuccess,
}: ConfirmModalProps) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

if (!isOpen) return null;

const handleConfirm = async () => {
setLoading(true);
setError(null);
try {
const res = await fetch(apiUrl, { method: "POST" });
if (!res.ok) throw new Error("Request failed");
const data = await res.json();
if (onSuccess) onSuccess(data);
onClose(); // Close on success only
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
"
>
<h2 className="text-xl text-white p-3 font-semibold def-bg mb-2">{title}</h2>
<p className="text-gray-600 mb-3 p-3">{message}</p>

{error && <p className="text-red-500 p-3 text-sm">{error}</p>}

<div className="flex justify-center gap-3 p-3 mb-3">
<button
className="px-4 py-2 pointer rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
onClick={onClose}
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
