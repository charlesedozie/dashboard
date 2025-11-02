"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { BookOpenText } from "lucide-react";
import { useTheme } from "next-themes";

type FormData = {
  name: string;
  email: string;
  subject: string;
  inquiry: string;
  message: string;
  agree: boolean;
};

export default function ForgotPass() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [status, setStatus] = useState(0);

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<FormData>();

  const { theme } = useTheme();
  const isDark = theme === "dark";
const logoSrc = theme === "dark" ? "/logowhite.webp" : "/gleenlogo1.webp";

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result?.error || "Submission failed");
        setSubmitted(false);
      } else {
        setSubmitted(true);
        setError("");
        reset();
        setStatus(result.status);
        setStatusMsg(result.message || JSON.parse(result.error)?.message || "");
      }
    } catch (err) {
      console.error(err);
      setError(String(err));
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

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
          {/* Form Column */}
          <div className="p-8 flex flex-col justify-center">
            <section className="mb-8">
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
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full border ${
                  isDark ? "border-blue-400" : "border-[#78B3FF]"
                }`}
              >
                <BookOpenText
                  className={`w-10 h-10 ${
                    isDark ? "text-blue-400" : "text-[#344D99]"
                  }`}
                />
              </div>
            </div>

            <h2
              className={`mb-1 text-center font-semibold text-[22px] leading-[33px] ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Reset Password
            </h2>
            <h2
              className={`text-center text-[14px] mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter your email to continue
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
              {submitted && status === 200 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {statusMsg}
                </div>
              )}

              {submitted && status === 500 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {statusMsg}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter your email"
                  className={`w-full border p-3 rounded focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full pointer font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex justify-center items-center gap-2 ${
                  isDark
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-[#14265C] text-white hover:bg-blue-700"
                }`}
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
                  "Next"
                )}
              </button>
            </form>

            <p
              className={`mt-4 text-center text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Link
                href="/login"
                className={`hover:underline ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Return to login
              </Link>
            </p>
          </div>

          {/* Image Column */}
          <div className="hidden md:block relative h-full">
            <Image
              src={"/fpassword.webp"}
              alt={"Reset your password"}
              title={"Reset your password"}
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
