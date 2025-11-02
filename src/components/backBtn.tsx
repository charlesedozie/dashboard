// components/BackButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  /**
   * Fallback path to navigate to if history.back() isn't available.
   * Default: '/'
   */
  fallbackPath?: string;
  /**
   * Extra className for styling the button (Tailwind-friendly by default)
   */
  className?: string;
  /**
   * Optional children (label). Default: "Back"
   */
  children?: React.ReactNode;
  /**
   * Optional aria-label override for accessibility
   */
  ariaLabel?: string;
  /**
   * Optional callback that runs after navigation
   */
  onAfterNavigate?: () => void;
}

export default function BackButton({
  fallbackPath = "/",
  className = "px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700",
  children = "Back",
  ariaLabel,
  onAfterNavigate,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // If there's a previous history entry, go back.
    // window.history.length > 1 is a heuristic; if it's not available,
    // still attempt router.back() and then fallback.
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
        onAfterNavigate?.();
        return;
      }
    } catch {
      // ignore and fallback
    }

    // Fallback to explicit path
    router.push(fallbackPath);
    onAfterNavigate?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel ?? (typeof children === "string" ? children : "Go back")}
    >
      {children}
    </button>
  );
}
