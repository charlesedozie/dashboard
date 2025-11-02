"use client";
import React, { useState, useEffect } from "react";

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

  // ✅ Sync with incoming defaultState
  useEffect(() => {
    setIsOn(defaultState);
  }, [defaultState]);

  const handleToggle = async () => {
    const newState = !isOn;
    setIsOn(newState);
    setLoading(true);

    try {
      const payload = {
        [label]: newState,
        ...hiddenFields,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
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
      {/* for debugging */}
      <span className="text-xs">{isOn ? "ON" : "OFF"}</span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative pointer inline-flex h-5 w-10 items-center rounded-full transition-colors ${
          isOn ? "bg-blue-500" : "bg-gray-300"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            isOn ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default SwitchButton;
