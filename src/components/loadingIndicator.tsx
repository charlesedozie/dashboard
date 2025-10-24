"use client";

import React from "react";

type Variant = "primary" | "light" | "dark";

interface Props {
  size?: "sm" | "md" | "lg" | number; // preset sizes or pixel number
  label?: string; // accessible and visible label
  variant?: Variant;
  fullscreen?: boolean; // show centered overlay covering viewport
  className?: string;
  delayMs?: number; // wait before showing (prevents flicker)
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-4",
};

export default function LoadingIndicator({
  size = "md",
  label = "Loading…",
  variant = "primary",
  fullscreen = false,
  className = "",
  delayMs = 0,
}: Props) {
  const [visible, setVisible] = React.useState(delayMs === 0);

  React.useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!visible) return null;

  const borderColor =
    variant === "primary"
      ? "border-primary-500 border-t-transparent"
      : variant === "light"
      ? "border-gray-200 border-t-gray-400"
      : "border-gray-700 border-t-transparent";

  const spinnerSize =
    typeof size === "number" ? `w-[${size}px] h-[${size}px]` : sizeMap[size];

  const spinner = (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center my-3 gap-3 ${className}`}
    >
      <svg
        className={`${spinnerSize} ${borderColor} animate-spin rounded-full`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* This SVG uses stroke/border look by using solid circle and a masked top part */}
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="text-current/40" />
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" className="text-current" strokeLinecap="round" />
      </svg>

      {label ? (
        <span className="text-sm select-none" aria-hidden="false">
          {label}
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="rounded-2xl bg-white/90 p-4 shadow-lg dark:bg-black/80 dark:backdrop-blur">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}
