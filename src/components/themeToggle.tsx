"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function FancyThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`
        relative flex items-center justify-between w-16 h-6 rounded-full
        transition-all duration-500 focus:outline-none overflow-hidden pointer 
        ${isDark
          ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] shadow-inner"
          : "bg-gradient-to-r from-[#F8B107] via-[#F5D179] to-[#F8B107] shadow-lg"}
      `}
    >
      {/* 🌙 Moon Icon (Dark Mode) */}
      <div
        className={`absolute left-1 transition-all duration-500 ease-in-out
        ${isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90"}`}
      >
        <Moon
          size={14}
          className="text-white drop-shadow-[0_0_6px_rgba(45,212,191,0.8)]"
        />
      </div>

      {/* ☀️ Sun Icon (Light Mode) */}
      <div
        className={`absolute right-1 transition-all duration-500 ease-in-out
        ${isDark ? "opacity-0 scale-0 rotate-90" : "opacity-100 scale-100 rotate-0"}`}
      >
        <Sun
          size={16}
          className="text-white drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]"
        />
      </div>

      {/* 🟣 Toggle Knob */}
      <span
        className={`
          absolute top-1 left-1 w-4 h-4 rounded-full 
          bg-white dark:bg-gray-200 shadow-md transform transition-all duration-500 ease-in-out
          ${isDark ? "translate-x-8 bg-gradient-to-br from-teal-300 to-cyan-400" : "translate-x-0 bg-gradient-to-br from-indigo-200 to-blue-400"}
        `}
      ></span>
    </button>
  );
}
