"use client";
import React, { useState } from "react";

interface TextInputSubmitProps {
  apiEndpoint: string;
  hiddenFields?: Record<string, any>;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
}

const TextInputSubmit: React.FC<TextInputSubmitProps> = ({
  apiEndpoint,
  hiddenFields = {},
  label = "",
  placeholder = "Enter text...",
  defaultValue = "",
}) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLabel, setButtonLabel] = useState<string>("Submit");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // stops page refresh
    setLoading(true);
    setButtonLabel("Updating...");

    try {
      const payload = {
        value,
        ...hiddenFields,
      };

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("API Error:", await res.text());
        setButtonLabel("Submit");
      } else {
        setButtonLabel("Updated");
        setTimeout(() => setButtonLabel("Submit"), 2000);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setButtonLabel("Submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      {label && <span className="text-gray-700">{label}</span>}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-xl px-3 py-1 w-48 text-base focus:outline-none focus:ring-2 text-gray-500"
      />
      <button
        type="button" // <-- prevents default form action
        onClick={() => handleSubmit()} // <-- manually triggers submit
        disabled={loading}
        className={`bg-[#C4E9FD] font-medium text-sm px-4 py-2 rounded-3xl pointer hover:bg-blue-200 disabled:opacity-50 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-300"
        }`}
      >
        {buttonLabel}
      </button>
    </form>
  );
};

export default TextInputSubmit;
