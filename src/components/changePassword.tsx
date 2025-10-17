"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    console.group("🔐 Password Update Attempt");
    console.log("📦 Form data submitted:", data);

    setLoading(true);
    setMessage({ text: "Processing your request...", type: "info" });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/auth/change-password`;

    try {
      if (!process.env.NEXT_PUBLIC_API_BASE) {
        console.error("❌ Missing NEXT_PUBLIC_API_BASE environment variable.");
        throw new Error("API base URL not defined.");
      }

      console.log("🌍 Sending request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
         },
        body: JSON.stringify(data),
      });

      console.log("📬 Server response status:", response.status);

      const result = await response.json().catch(() => ({}));
      console.log("📨 Server response JSON:", result);

      if (!response.ok) {
        console.log("🚨 Request failed:", result);
        throw new Error(result?.message || "Failed to update password");
      }

      console.log("✅ Password updated successfully!");
      setMessage({ text: result?.message || "Password updated successfully!", type: "success" });
      reset();
    } catch (err: any) {
      console.error("❌ Error updating password:", err);
      setMessage({
        text: err?.message || "Something went wrong while updating password.",
        type: "error",
      });
    } finally {
      setLoading(false);
      console.groupEnd();

      // Automatically hide the alert after 6 seconds
      setTimeout(() => setMessage(null), 10000);
    }
  };

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
      <label className="text-sm font-medium mb-1 text-gray-600">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          {...register(field, registerOptions)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-base w-full focus:outline-none text-gray-700 focus:ring-2 focus:ring-gray-500"
          onChange={(e) => console.log(`✏️ ${field} changed:`, e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            console.log(`👁️ Toggled visibility for ${field}`);
            setVisible((prev) => !prev);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? <EyeOff className="pointer" size={18} /> : <Eye className="pointer" size={18} />}
        </button>
      </div>
      {errorMessage && <span className="text-xs text-red-500 mt-1">{errorMessage}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-lg font-bold text-gray-800">Update Your Password</h2>
      <p className="text-sm text-gray-600">
        Keep your account secure by setting a strong and unique password.
      </p>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        <PasswordInput
          label="Current Password"
          field="oldPassword"
          visible={showCurrent}
          setVisible={setShowCurrent}
          registerOptions={{ required: "Current password is required" }}
          errorMessage={errors.oldPassword?.message}
        />

        <PasswordInput
          label="New Password"
          field="newPassword"
          visible={showNew}
          setVisible={setShowNew}
          registerOptions={{
            required: "New password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          }}
          errorMessage={errors.newPassword?.message}
        />

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

      <div className="flex justify-end gap-4 mb-8 mt-10">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#14265C] text-sm font-medium hover:bg-blue-800 text-white px-10 py-4 rounded-xl transition disabled:opacity-50 pointer"
        >
          {loading ? "Updating..." : "Save Password"}
        </button>
      </div>
    </form>
  );
}
