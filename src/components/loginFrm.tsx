'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { BookOpenText } from "lucide-react";
import Link from 'next/link';
import { useTheme } from "next-themes";

type FormData = {
  name: string;
  email: string;
  subject: string;
  inquiry: string;
  message: string;
  agree: boolean;
  password: string;  // ✅ Add this line
};


export default function LoginForm() {
const [loading, setLoading] = useState<boolean>(false);
const [showPassword, setShowPassword] = useState<boolean>(false);
const [viewForm, setViewForm] = useState<boolean>(false);
const router = useRouter();
const [formState, setFormState] = useState({ authState: 0, authMsg: '', });
const [ready, setReady] = useState(false);

const { theme } = useTheme();
const isDark = theme === "dark";
const logoSrc = theme === "dark" ? "/logowhite.webp" : "/gleenlogo1.webp";

useEffect(() => {
const username = sessionStorage.getItem("username");
if (username) {
router.replace("/user-area/dboard/");
} else { setReady(true); // allow rendering only if no redirect
}}, [router]);

const togglePasswordVisibility = () => { setShowPassword((prev) => !prev); };
const {
register,
handleSubmit,
formState: { errors },
reset,
} = useForm<FormData>();
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState('');

const onSubmit = async (data: FormData) => {
setLoading(true); // start spinner
try {
const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
method: 'POST',
headers: { 
accept: "application/json",
'Content-Type': 'application/json' },
body: JSON.stringify(data),
});

const result = await response.json();
if (!response.ok) {
setError(result?.error || 'Submission failed');
setSubmitted(false);
} else {
setSubmitted(true);
setError('');
reset();

if(Number(result.status) == 500){
const obj = JSON.parse(result.error);
setFormState({ ...formState, authState: 2, authMsg: `${result.message}: ${obj.message}` });
}
if(Number(result.status) == 200){
sessionStorage.setItem("username", result.data.user.username || result.data.user.email);
sessionStorage.setItem("useremail", result.data.user.email);
sessionStorage.setItem("token", result.data.token);
sessionStorage.setItem("user", JSON.stringify(result.data));
if(data.password && data.password == 'pr=9w&2D2'){
sessionStorage.setItem("updatePassword", data.password) } 
setViewForm(true);	  
	  
}
}
} catch (err) {
setError(`${err}`);
setFormState({ ...formState, authState: 2, authMsg: `${err}` });
setSubmitted(false);
} finally {
setLoading(false); // stop spinner
}};


useEffect(() => {
    if (viewForm) {
     // router.push("/user-area/dboard/");
      window.location.href = "/user-area/dboard/";

    }
  }, [viewForm]);
  
  if (!ready) {
   // return null; 
   return <div className="p-6 text-center">Loading...</div>
  }

  if (viewForm) {
   // return null; 
   return <div className="fixed inset-0 flex items-center justify-center">
  <div><p><Image
    src="/gleenlogo1.webp"
    alt="Gleen Logo"
    title="Gleen Logo"
    width={288}
    height={120}
    style={{ objectFit: "cover" }}
  /></p><p className='text-center my-6 text-sm font-bold'>Loading GLEEN, please wait ….
  </p></div>
</div>
  }

return (
<section
className={`min-h-screen transition-colors duration-300 ${
isDark
? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
: "bg-gradient-to-br from-white via-gray-50 to-blue-50"
} px-4`}
>
<div
className={`min-h-screen flex items-center justify-center ${
isDark ? "bg-gray-950" : "bg-gray-100"
}`}
>
        <div
          className={`rounded-lg shadow-xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden border ${
            isDark
              ? "bg-gray-900 border-gray-700 text-gray-100"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >

<div className="p-8 flex flex-col justify-center">
<section className='mb-15'>
<Image
src={logoSrc}
alt={'Gleen Logo'}
title={'Gleen Logo'}
width={108}
height={48}
style={{ objectFit: 'cover' }}
/>
</section>

<div className="flex items-center justify-center mb-3">
<div className={`flex items-center justify-center w-16 h-16 rounded-full border ${
isDark ? "border-blue-400" : "border-[#78B3FF]"
}`}
>
<BookOpenText className={`w-10 h-10 ${isDark ? "text-blue-400" : "text-[#344D99]"}`}/>
</div>
</div>

<h2 className={`mb-1 text-center font-semibold text-[22px] leading-[33px] ${
isDark ? "text-white" : "text-gray-800"
}`}
>Welcome Back</h2>
<h2 className="silver text-center" style={{
fontWeight: 400,
fontStyle: 'Regular',
fontSize: '14px',
lineHeight: '21px',
letterSpacing: '0%',
verticalAlign: 'middle',
}}>Sign in to access your teaching portal</h2>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
{(error || formState.authState == 2) && (
<div className="bg-red-100 my-5 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
{formState.authMsg}
</div>
)}

<div>
<label htmlFor="email" className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
Email
</label>
<input
type="email"
className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
{...register('email', { required: 'Email is required' })}
placeholder="Enter your email"
/>{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
</div>


<div>
<label htmlFor="password"  className={`block text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
Password
</label>
<div className="relative">
<input 
className="mt-1 w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
{...register('password', { required: 'Password is required' })}
placeholder="Enter your password"

type={showPassword ? 'text' : 'password'}
id="password"
/>

<button
type="button"
onClick={togglePasswordVisibility}
className="absolute inset-y-0 right-0 flex items-center pr-3"
>
{showPassword ? (
<EyeSlashIcon className="h-5 w-5 text-gray-500 pointer" />
) : (
<EyeIcon className="h-5 w-5 text-gray-500 pointer" />
)}
</button>
</div>
{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
</div>

{/* Submit Button */}
<button
type="submit"
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
d="M4 12a8 8 0 018-8v8H4z"
/>
</svg>
Processing...
</>
) : (
'Sign In'
)}
</button>
</form>



<p className="mt-4 text-center text-sm text-gray-600">       
<Link aria-label={`Go to forgot password page`}
title={`Go to forgot password page`} href="/forgot-password"  className="text-blue-600 hover:underline">Forgot Password?
</Link>
</p>


</div>
{/* Image Column */}
<div className="hidden md:block relative h-full">
<Image
src={'/login.webp'}
alt={'Gleen User Login'}
title={'Gleen User Login'}
fill
priority
className="rounded-3xl object-cover object-center"
/>
</div>
</div>
</div>

</section>
);
}
