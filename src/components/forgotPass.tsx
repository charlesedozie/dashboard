'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { BookOpenText } from "lucide-react";


type FormData = {
  name: string;
  email: string;
  subject: string;
  inquiry: string;
  message: string;
  agree: boolean;
};

export default function ContactForm() {
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState<boolean>(false);

const togglePasswordVisibility = () => {
setShowPassword((prev) => !prev);
};

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
    const response = await fetch('https://gleen-nexoris.duckdns.org/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    }
  } catch (err) {
    setError(`${err}`);
    setSubmitted(false);
	console.log(err);
  } finally {
    setLoading(false); // stop spinner
  }
};

  





return (
<section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 px-4">	  
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
<div className="bg-white p-2 rounded-lg shadow-xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
{/* Form Column */}



<div className="p-8 flex flex-col justify-center">
<section className='mb-15'><Image
src={'/apple-icon-72x72.png'}
alt={'Gleen Logo'}
title={'Gleen Logo'}
width={48}
height={48}
style={{ objectFit: 'cover' }}
/></section>

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
}} className="mb-1 def-color">Reset Password</h2>
<h2 className="silver text-center" style={{
fontWeight: 400,
fontStyle: 'Regular',
fontSize: '14px',
lineHeight: '21px',
letterSpacing: '0%',
verticalAlign: 'middle',
}}>Enter your email to continue</h2>


<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
{submitted && (
<div className="bg-green-100 my-5 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
Thank you! Your message has been sent.
</div>
)}
{error && (
<div className="bg-red-100 my-5 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
{error}
</div>
)}

<div>
<label htmlFor="email" className="block text-sm font-medium silver">
Email
</label>
<input
type="email"
className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
{...register('email', { required: 'Email is required' })}
placeholder="Enter your email"
/>{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
</div>



{/* Submit Button */}
<button
type="submit"
className="w-full bg-[#14265C] pointer hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex justify-center items-center gap-2"
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
'Next'
)}
</button>
</form>



<p className="mt-4 text-center text-sm text-gray-600">     
<Link aria-label={`Return to login`}
title={`Return to login`} href="/login"  className="text-blue-600 hover:underline">Return to login
</Link>
</p>
</div>
{/* Image Column */}
<div className="hidden md:block relative h-full">
<Image
src={'/fpassword.webp'}
alt={'Reset your password'}
title={'Reset your password'}
fill
priority
className="rounded-3xl object-cover object-center"
/></div></div></div></section>);}
