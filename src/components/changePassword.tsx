"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import SubTitle from "./subTitle";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function PasswordUpdateForm() {
  const [loading, setLoading] = useState(false);

  // Toggle visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to update password");
      }

      alert("Password updated successfully!");
      reset();
    } catch (err) {
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  // A reusable input with eye icon
  const PasswordInput = ({
    label,
    field,
    visible,
    setVisible,
    registerOptions,
    errorMessage,
  }: {
    label: string;
    field: keyof FormValues;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    registerOptions: any;
    errorMessage?: string;
  }) => (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1 text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          {...register(field, registerOptions)}
          className=" border border-1 border-gray-300 rounded-xl px-3 py-2 text-base w-full focus:outline-none text-gray-500 focus:ring-gray-700"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {errorMessage && <span className="text-xs text-red-500">{errorMessage}</span>}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white space-y-4"
    >
      <h2 className="text-lg font-bold">Update Your Password</h2>
	  <p className='text-base'>Keep your account secure by setting a strong and unique password</p>
	
	
	<div className="grid grid-cols-1 md:grid-cols-2 gap-7">
      <div> {/* Current Password */}
      <PasswordInput
        label="Current Password"
        field="currentPassword"
        visible={showCurrent}
        setVisible={setShowCurrent}
        registerOptions={{ required: "Current password is required" }}
        errorMessage={errors.currentPassword?.message}
      />
      </div>
      <div>
	   {/* New Password */}
      <PasswordInput
        label="New Password"
        field="newPassword"
        visible={showNew}
        setVisible={setShowNew}
        registerOptions={{
          required: "New password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        }}
        errorMessage={errors.newPassword?.message}
      />
      </div>
	  
	   <div>
	      {/* Confirm Password */}
      <PasswordInput
        label="Confirm Password"
        field="confirmPassword"
        visible={showConfirm}
        setVisible={setShowConfirm}
        registerOptions={{
          required: "Please confirm your password",
          validate: (value: string) =>
            value === watch("newPassword") || "Passwords do not match",
        }}
        errorMessage={errors.confirmPassword?.message}
      />

      </div>
    </div>
	
	
     

     

      {/* Submit Button */}
<div className="flex justify-end gap-4 mb-8 mt-10">
  <button
    type="submit"
    disabled={loading}
    className="bg-[#14265C] pointer text-sm font-medium hover:bg-blue-800 text-white px-10 py-4 rounded-xl transition disabled:opacity-50"
  >
    {loading ? "Updating..." : "Save Password"}
  </button>
</div>
    </form>
  );
}
