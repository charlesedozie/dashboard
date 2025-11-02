"use client";
import { useTheme } from "next-themes";

export default function TestToggle() {
  const { theme, setTheme } = useTheme();

  return (<div>aluminoumn
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md transition"
    >
      Toggle Theme ({theme})
    </button></div>
  );
}
