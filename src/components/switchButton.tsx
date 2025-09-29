"use client";
import React, { useState } from "react";

interface SwitchButtonProps {
  apiEndpoint: string;
  defaultState?: boolean;
  hiddenFields?: Record<string, any>;
  label?: string;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  apiEndpoint,
  defaultState = false,
  hiddenFields = {},
  label = "",
}) => {
  const [isOn, setIsOn] = useState<boolean>(defaultState);
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async () => {
    const newState = !isOn;
    setIsOn(newState);
    setLoading(true);

    try {
      const payload = {
        state: newState,
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
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-gray-700">{label}</span>}
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative pointer inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isOn ? "bg-blue-500" : "bg-gray-300"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default SwitchButton;