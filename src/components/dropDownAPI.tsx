"use client";
import React, { useState } from "react";

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

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setLoading(true);
    setStatusLabel("Updating...");

    if (onOptionChange) {
      onOptionChange(newValue);
    }

    try {
      const payload = {
        value: newValue,
        ...hiddenFields,
      };
console.log(JSON.stringify(payload))
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",          
"Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("API Error:", await res.text());
        setStatusLabel("Failed");
      } else {
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

// ✅ Dynamically set background & border color based on selectedValue
const statusClasses =
selectedValue === "active" ? "bg-green-100 border-green-300 focus:ring-green-400" : 
selectedValue === "suspended" ? "bg-yellow-100 border-yellow-300 focus:ring-yellow-400" : selectedValue === "terminated" ? "bg-red-100 border-red-300 focus:ring-red-400" : 
"bg-gray-100 border-gray-300 focus:ring-gray-400";

return (
    <>
      <div className="flex items-center bg-inherit text-inherit border-inherit w-auto">
        {label && <span className="text-sm font-medium mr-2">{label}</span>} 
        <select
          value={selectedValue}
          onChange={handleChange}
          disabled={loading}
          className={`pointer border rounded-md p-1 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 ${statusClasses}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {statusLabel && (
        <span className="ml-2 text-xs text-gray-500">{statusLabel}</span>
      )}
    </>
  );
};

export default DropdownSelect;
