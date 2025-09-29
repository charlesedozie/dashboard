'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { BookOpenText } from "lucide-react";
import Link from 'next/link';

type FormData = {
  currentpassword: string;
  password: string;
  confirmpassword: string;
};

export default function UpdatePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const password = watch('password'); // Watch new password for confirm validation

  const toggleCurrentPassword = () => setShowCurrentPassword((prev) => !prev);
  const toggleNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || 'Failed to update password. Please try again.');
        setSubmitted(false);
      } else {
        setSubmitted(true);
        setError('');
        reset();
        // Optionally redirect: router.push('/login');
      }
    } catch (err) {
      setError('Network error: Failed to update password. Please try again later.');
      setSubmitted(false);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
            {submitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Password updated successfully! You can now log in with your new password.
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label htmlFor="currentpassword" className="block text-sm font-medium silver">
                Current Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('currentpassword', { required: 'Current Password is required' })}
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentpassword"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Current Password"
                />
                <button
                  type="button"
                  onClick={toggleCurrentPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.currentpassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentpassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium silver">
                New Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('password', {
                    required: 'New Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must include uppercase, lowercase, and number',
                    },
                  })}
                  type={showNewPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={toggleNewPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters, including uppercase, lowercase, and a number.
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmpassword" className="block text-sm font-medium silver">
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <input
                  {...register('confirmpassword', {
                    required: 'Confirm New Password is required',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmpassword"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.confirmpassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmpassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#14265C] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex justify-center items-center gap-2 disabled:opacity-50"
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
                'Update Password'
              )}
            </button>
          </form>

          <div className="mt-4 space-y-2 text-center text-sm text-gray-600">
            <p>
              <Link
                aria-label="Go to login page"
                title="Go to login page"
                href="/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
            <p>
              <Link
                aria-label="Go to forgot password page"
                title="Go to forgot password page"
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
            <p>
              <Link
                aria-label="Go to OTP verification page"
                title="Go to OTP verification page"
                href="/otp"
                className="text-blue-600 hover:underline"
              >
                OTP
              </Link>
            </p>
          </div>
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