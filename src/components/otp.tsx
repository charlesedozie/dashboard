'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { BookOpenText, Mail } from "lucide-react";
import {getUser} from "@/utils/curUser";
import { useRouter } from "next/navigation";

type FormData = {
otp1: string;
otp2: string;
otp3: string;
otp4: string;
};

export default function OTPForm() {
const [loading, setLoading] = useState(false);
const [iniRun, setIniRun] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [verify, setVerify] = useState(false);
const [error, setError] = useState('');
const [resending, setResending] = useState(false);
const [resendMessage, setResendMessage] = useState('');
const router = useRouter();

const [OTP] = useState(() => {
const digits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
return digits.join('');
});
const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
function maskEmail(email: string): string {
const [localPart, domain] = email.split('@');
if (!domain) return email; // fallback if invalid email

const visibleLength = Math.max(1, Math.ceil(localPart.length * 0.15));
const visiblePart = localPart.slice(0, visibleLength);
return `${visiblePart}***@${domain}`;
}

const {
control,
handleSubmit,
formState: { errors },
reset,
} = useForm<FormData>();

// Auto-focus first input on mount
useEffect(() => {
otpRefs.current[0]?.focus();
}, []);

const onSubmit = async (data: FormData) => {
setLoading(true);
setError('');

try {
const otpCode = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}`;
if(OTP != otpCode){setError('Invalid OTP. Please try again.');}
if(OTP == otpCode){
try {
// ✅ Include the field name dynamically in the payload
const payload = {
isEmailVerified: true, 
};
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/${getUser()?.user.id}`, {
method: "PUT",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
},
body: JSON.stringify(payload),
});

if (!res.ok) {
console.error("API Error:", await res.text());
setError('Error connecting to server');
} else {
setSubmitted(true);
setError('');
reset();
router.push("/logout");
}
} catch (error) {
console.error("Request failed:", error);
} finally {
//setLoading(false);
}}} catch (err) {
setError('Network error: Failed to verify OTP. Please try again later.');
setSubmitted(false);
console.log(err);
} finally {
setLoading(false);
}

};

const handleOtpInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
const value = e.target.value;
if (value.length === 1 && /^\d$/.test(value)) {
if (index < 3 && otpRefs.current[index + 1]) {
otpRefs.current[index + 1]?.focus();
}
}
};

const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
if (e.key === 'Backspace' && !e.currentTarget.value && index > 0 && otpRefs.current[index - 1]) {
otpRefs.current[index - 1]?.focus();
}
};

const handleResendOTP = async () => {
try { setResending(true); setResendMessage("Sending OTP..."); setError("");
const email = getUser()?.user.email || "";
if (!email) { setError("No email found. Please log in again."); return; }
// ✅ Build payload for your Next.js API route
const payload = { email: email, otp: OTP, id: "N9HnMguA9-x3oXjUZn4cZ91_M8DLoGc1OVgwh9yJxI8", 
fullName:getUser()?.user.fullName, };
console.log("[Resend OTP] Sending payload:", payload);
const res = await fetch("/api/sendVerification", {
method: "POST", headers: { "Content-Type": "application/json", },
body: JSON.stringify(payload), });

const result = await res.json();
console.log("[Resend OTP] Server Response:", result);
if (!res.ok || result.status !== "success") {
throw new Error(result.message || "Failed to send OTP"); }
setResendMessage("OTP Sent Successfully!");
} catch (err: any) {
console.error("Resend OTP error:", err);
setError("Failed to resend OTP. Please try again.");
setResendMessage("");
} finally {
setResending(false);
}
};


useEffect(() => {
// Automatically send OTP when component mounts
const sendInitialOTP = async () => {
try {
if(!iniRun){
setResending(true);
setResendMessage('Sending OTP...');
setError('');

// Send OTP to backend endpoint
await handleResendOTP();
setResendMessage('OTP Sent to your email');
setIniRun(true);
}} catch (err) {
console.error('Failed to send initial OTP:', err);
setError('Failed to send OTP. Please try again.');
} finally {
setResending(false);
}
};

sendInitialOTP();
}, []); // ✅ empty dependency array ensures it runs only once



return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
<div className="bg-white p-2 rounded-lg shadow-xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
{/* Form Column */}
<div className="p-8 flex flex-col justify-center">
<section className='mb-15'>
<Image
src={'/apple-icon-72x72.png'}
alt={'Gleen Logo'}
title={'Gleen Logo'}
width={48}
height={48}
style={{ objectFit: 'cover' }}
/>
</section>

<div className="flex items-center justify-center mb-3">
<div className="flex items-center justify-center w-16 h-16 border-1 border-[#78B3FF] rounded-full">
<BookOpenText className="w-10 h-10 text-[#344D99] text-3xl font-bold" />
</div>
</div>

<h2 style={{
fontWeight: 600,
fontStyle: 'SemiBold',
fontSize: '22px',
lineHeight: '33px',
letterSpacing: '0%',
textAlign: 'center',
verticalAlign: 'middle',
}} className="mb-1 def-color">Verify Your Identity</h2>

<h2 className="silver text-center" style={{
fontWeight: 400,
fontStyle: 'Regular',
fontSize: '14px',
lineHeight: '21px',
letterSpacing: '0%',
verticalAlign: 'middle',
}}>
<div className='my-4'>Click Send OTP and Enter the OTP code sent to your email to verify your identity</div>
<div className="flex items-center justify-center gap-2">
<Mail className="w-5 h-5" />
<span className="text-sm font-medium">Send to: {maskEmail(getUser()?.user.email || '')}</span>
</div>
</h2>

<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
{submitted && (
<div className="bg-green-100 my-5 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
OTP verified successfully! Redirecting...
</div>
)}
{error && (
<div className="bg-red-100 my-5 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
{error}
</div>
)}

<div className="flex flex-col items-center gap-4 mb-6">
{/* OTP inputs */}
<div className="flex items-center justify-center gap-3">
{[0, 1, 2, 3].map((index) => {
const fieldName = `otp${index + 1}` as keyof FormData;
return (
<div key={index} className="flex flex-col items-center">
<Controller
name={fieldName}
control={control}
rules={{
required: 'OTP digit is required',
pattern: { value: /^\d$/, message: 'Enter a single digit' }
}}
render={({ field }) => (
<input
ref={(el) => {
otpRefs.current[index] = el;
}}
type="number"
maxLength={1}
className={`w-12 h-12 text-center border rounded-lg focus:outline-none focus:ring-2 text-lg ${
errors[fieldName]
? 'border-red-500 focus:ring-red-500'
: 'border-gray-300 focus:ring-blue-500'
}`}
value={field.value || ''}
onChange={(e) => {
const value = e.target.value;
if (value.length <= 1) {
field.onChange(value.slice(-1));
}
handleOtpInput(index, e);
}}
onKeyDown={(e) => handleKeyDown(index, e)}
id={`otp${index + 1}`}
/>
)}
/>
{/* Optional: Per-field error message */}
{/* {errors[fieldName] && (
<p className="text-red-500 text-xs mt-1">{errors[fieldName]?.message}</p>
)} */}
</div>
);
})}
</div>

<section className='text-center'>{resendMessage}</section>
{/* Resend OTP button */}
<button
type="button"
className="text-blue-600 text-sm pointer font-medium hover:underline"
onClick={handleResendOTP}
disabled={resending}
>
{resending ? 'Sending...' : 'Resend OTP'}
</button>
</div>

{/* Submit Button */}
<button
type="button"
onClick={handleSubmit(onSubmit)}
className="w-full pointer bg-[#14265C] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex justify-center items-center gap-2"
disabled={loading}
>
{loading ? (
<>
<svg
className="animate-spin h-5 w-5 text-white"
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
>
<circle
className="opacity-25"
cx="12"
cy="12"
r="10"
stroke="currentColor"
strokeWidth="4"
/>
<path
className="opacity-75"
fill="currentColor"
d="M4 12a8 8 0 018-8V8H4z"
/>
</svg>
Processing...
</>
) : (
'Continue'
)}
</button>
</form>
</div>

{/* Image Column */}
<div className="hidden md:block relative h-full">
<Image
src={'/fpassword.webp'}
alt={'OTP Image'}
title={'Enter the OTP sent to you'}
fill
priority
className="rounded-3xl object-cover object-center"
/>
</div>
</div>
</div>
);
}