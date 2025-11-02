"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  apiEndpoint: string;
  options: DropdownOption[];
  defaultState?: string;
  hiddenFields?: Record<string, any>;
  label?: string;
  onOptionChange?: (value: string) => void;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  apiEndpoint,
  options,
  defaultState = "",
  hiddenFields = {},
  label = "",
  onOptionChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultState);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLabel, setStatusLabel] = useState<string>("");

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setLoading(true);
    setStatusLabel("Updating...");

    if (onOptionChange) onOptionChange(newValue);

    try {
      const payload = { status: newValue, ...hiddenFields };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });


      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", errorText);
        setStatusLabel("Failed");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatusLabel("Updated");
        setTimeout(() => setStatusLabel(""), 2000);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setStatusLabel("Failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Apply color based on status and theme
  const statusClasses =
    selectedValue === "ACTIVE"
      ? isDark
        ? "bg-green-800 border-green-600 focus:ring-green-500 text-white"
        : "bg-green-100 border-green-300 focus:ring-green-400 text-green-900"
      : selectedValue === "SUSPENDED"
      ? isDark
        ? "bg-yellow-800 border-yellow-600 focus:ring-yellow-500 text-white"
        : "bg-yellow-100 border-yellow-300 focus:ring-yellow-400 text-yellow-900"
      : selectedValue === "TERMINATED"
      ? isDark
        ? "bg-red-800 border-red-600 focus:ring-red-500 text-white"
        : "bg-red-100 border-red-300 focus:ring-red-400 text-red-900"
      : isDark
      ? "bg-gray-800 border-gray-600 focus:ring-gray-500 text-white"
      : "bg-gray-100 border-gray-300 focus:ring-gray-400 text-gray-800";

  return (<div>
    <div className={`flex items-center w-auto transition-colors duration-300 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
      {label && <span className="text-sm font-medium mr-2">{label}</span>}
      <select
        value={selectedValue}
        onChange={handleChange}
        disabled={loading}
        className={`pointer border rounded-md p-1 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors duration-300 ${statusClasses}`}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className={`${isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"}`}
          >
            {opt.label}
          </option>
        ))}
      </select>
</div>
      {statusLabel && (
        <span className={`ml-2 text-xs transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {statusLabel}
        </span>
      )}
    </div>
  );
};

export default DropdownSelect;
