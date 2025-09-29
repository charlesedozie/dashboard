'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { BookOpenText, Mail } from "lucide-react";
import Link from 'next/link';

type FormData = {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
};

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    try {
      const otpCode = `${data.otp1}${data.otp2}${data.otp3}${data.otp4}`;
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpCode }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.error || 'Invalid OTP. Please try again.');
        setSubmitted(false);
      } else {
        setSubmitted(true);
        setError('');
        reset();
        // Optionally redirect after success
      }
    } catch (err) {
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
            <div className='my-4'>Enter the OTP code sent to your email to verify your identity</div>
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Code sent to: john***@email.com</span>
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
                            type="text"
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

              {/* Resend OTP button */}
              <button
                type="button"
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={() => {
                  // Add resend logic here, e.g., fetch('/api/resend-otp')
                  alert("Resend OTP clicked");
                }}
              >
                Resend OTP
              </button>
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

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link 
              aria-label="Go to login page"
              title="Go to login page" 
              href="/login"  
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link 
              aria-label="Go to forgot password page"
              title="Go to forgot password page" 
              href="/forgot-password"  
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link 
              aria-label="Go to update password page"
              title="Go to update password page" 
              href="/update-password"  
              className="text-blue-600 hover:underline"
            >
              Update Password
            </Link>
          </p>
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