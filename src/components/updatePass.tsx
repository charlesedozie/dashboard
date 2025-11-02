"use client";

import React, { useState, useEffect } from 'react';
import { useForm, UseFormWatch, UseFormSetValue, Controller, UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { BookOpenText } from "lucide-react";


type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordUpdateForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const [isAuthChecked, setIsAuthChecked] = useState(false);

useEffect(() => {
  const username = sessionStorage.getItem("username");
  if (!username) {
    router.push("/login");
  } else {
    setIsAuthChecked(true);
  }
}, [router]);





  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
if(data.newPassword === 'pr=9w&2D2'){
  setMessage({ text: "Please choose a new password", type: "error" });
  return;
}

if(data.newPassword !== data.confirmPassword){
  setMessage({ text: "Entered password and confirm password do not match", type: "error" });
  return;
}

    setLoading(true);
    setMessage({ text: "Processing your request...", type: "info" });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/auth/change-password`;

    try {
      if (!process.env.NEXT_PUBLIC_API_BASE) {
        throw new Error("API base URL not defined.");
      }
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
         },
        body: JSON.stringify(data),
      });


      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.log("🚨 Request failed:", result);
        throw new Error(result?.message || "Failed to update password");
      }

if(result?.status == 500){
console.log('result', result)
console.log('statys', result?.status)
console.log('msg', result?.message)
console.log('message', JSON.parse(result?.error).message)
 setMessage({ text: JSON.parse(result?.error).message, type: "error" });
return;
}

      setMessage({ text: result?.message || "Password updated successfully!", type: "success" });
      reset();
      const timer = setTimeout(() => { router.push('/logout'); }, 2000); // 3 seconds
    } catch (err: any) {
      console.error("❌ Error updating password:", err);
      setMessage({
        text: err?.message || "Something went wrong while updating password.",
        type: "error",
      });
    } finally {
      setLoading(false);

      // Automatically hide the alert after 6 seconds
      setTimeout(() => setMessage(null), 10000);
    }
  };

  const PasswordInput = ({
    label,
    field,
    visible,
    setVisible,
    control,
    registerOptions,
    errorMessage,
  className, 
  }: {
    label: string;
    field: keyof FormValues;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  control: UseFormReturn<FormValues>["control"];
    registerOptions: any;
    errorMessage?: string;
    className?: string; // 👈 optional
  }) => {
    return (
    <div className={`flex flex-col ${className || ""}`}>
      <label className="">{label}</label>
      <div className="relative">
         <Controller
        name={field}
        control={control}
        rules={registerOptions}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            type={visible ? "text" : "password"}
            onChange={onChange}
            onBlur={onBlur}
            value={value || ""}
            className="border border-gray-300 rounded-xl px-3 py-2 text-base w-full focus:outline-none text-gray-700 focus:ring-2 focus:ring-gray-500"
          />
        )}
      />
        <button
          type="button"
          onClick={() => {
            setVisible((prev) => !prev);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? <EyeOff size={18} className="pointer" /> : <Eye size={18} className="pointer" />}
        </button>
      </div>
      {errorMessage && <span className="text-xs text-red-500 mt-1">{errorMessage}</span>}
    </div>
  );
  }
  if (!isAuthChecked) {
  return <div className="text-center py-20 text-gray-500">Checking authentication...</div>;
}
  return (
  
  <div className="min-h-screen p-3 bg-gray-100 flex items-center justify-center">
  <div className="bg-white p-2 rounded-lg shadow-xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2">
  {/* Form Column */}
  <div className="p-8 flex flex-col justify-center">
  <section className="mb-15">
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
  <div className="flex items-center justify-center w-16 h-16 border border-[#78B3FF] rounded-full">
  <BookOpenText className="w-10 h-10 text-[#344D99] text-3xl font-bold" />
  </div>
  </div>
  
  <h2
  style={{
  fontWeight: 600,
  fontStyle: 'SemiBold',
  fontSize: '22px',
  lineHeight: '33px',
  letterSpacing: '0%',
  textAlign: 'center',
  verticalAlign: 'middle',
  }}
  className="mb-1 def-color"
  >
  Change Password
  </h2>
  <h2
  className="silver text-center"
  style={{
  fontWeight: 400,
  fontStyle: 'Regular',
  fontSize: '14px',
  lineHeight: '21px',
  letterSpacing: '0%',
  verticalAlign: 'middle',
  }}
  >
  For security, please update your default password before continuing
  </h2>
  
   <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow space-y-6">
       {/* ✅ Alert Message */}
      {message && (
        <div
          className={`p-3 text-sm rounded-md transition-all duration-500 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : message.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-gray-100 text-gray-700 border border-gray-300"
          }`}
        >
          {message.text}
        </div>
      )}
  
   {/* Current Password */}
              <div>
                <div className="relative mt-1 text-sm font-medium silver">
                  <PasswordInput
          label="Current Password"
          field="oldPassword"
          visible={showCurrent}
          setVisible={setShowCurrent}
           className="text-sm font-medium silver"
           control={control}
          registerOptions={{
    required: "Old password is required",
    validate: (value: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return passwordRegex.test(value)
        ? true
        : "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    },
  }}
          errorMessage={errors.oldPassword?.message}
        />
                 
                </div>
              </div>
  
  {/* New Password */}
  <div>
  <div className="relative mt-1">
    <PasswordInput
  label="New Password"
  className="text-sm font-medium silver"
  field="newPassword"
  visible={showNew}
  setVisible={setShowNew}
  control={control}
  registerOptions={{
    required: "New password is required",
    validate: (value: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return passwordRegex.test(value)
        ? true
        : "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
    },
  }}
  errorMessage={errors.newPassword?.message}
/>

<p className="text-xs text-gray-500 mt-1">
  Password must be at least 8 characters, including uppercase, lowercase, and a number.
</p>
  </div>
  </div>
  
  {/* Confirm New Password */}
  <div>
  <div className="relative mt-1">
    <PasswordInput
          label="Confirm Password"
          
           className="text-sm font-medium silver"
          field="confirmPassword"
          visible={showConfirm}
          setVisible={setShowConfirm}
          control={control}
  registerOptions={{
    required: "Confirm password is required",

  }}
         
        />
  </div>
  </div>
   <div className="flex justify-center gap-4 mb-8 mt-10">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#14265C] text-sm font-medium hover:bg-blue-800 text-white px-10 py-4 rounded-xl transition disabled:opacity-50 pointer"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
  </form>
  </div>
  
  {/* Image Column */}
  <div className="hidden md:block relative h-full">
  <Image
  src={'/updatepass.webp'}
  alt={'Update password image'}
  title={'Update your password'}
  fill
  priority
  className="rounded-3xl object-cover object-center"
  />
  </div>
  </div>
  </div>
  
  
  
  
  
  
  
  
  
  
  
  
  
  );
}
