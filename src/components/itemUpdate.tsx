"use client";
import React, { useState, useEffect } from "react";

interface TextInputSubmitProps {
  apiEndpoint: string;
  hiddenFields?: Record<string, any>;
  label?: string;
  placeholder?: string;
  btnValue?: string;
  defaultValue?: string;
  name: string;
  isLogout?: boolean;
}

const TextInputSubmit: React.FC<TextInputSubmitProps> = ({
  apiEndpoint,
  hiddenFields = {},
  label = "",
  placeholder = "Enter text...",
  defaultValue,
  btnValue = "Submit",
  name,  
  isLogout=true,
}) => {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLabel, setButtonLabel] = useState<string>(btnValue);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    //setButtonLabel("Updating...");
    setStatusMessage("Updating...");

    try {
      // ✅ Include the field name dynamically in the payload
      const payload = {
        [name]: value, // dynamic key name
        ...hiddenFields,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("API Error:", await res.text());
        setButtonLabel(btnValue);
        setStatusMessage("An error occurred while updating.");
      } else {
        setButtonLabel("Updated");
        setStatusMessage(isLogout === true ? (`<span class='text-xs'>Successfully updated! <br />Changes might take effect upon next login</span>`) : (`<span class='text-xs'>Successfully updated!</span>`));
        setTimeout(() => setButtonLabel(btnValue), 2000);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setButtonLabel(btnValue);
      setStatusMessage("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Hide status message after 10 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-fit">
      <div className="flex items-center gap-2">
        {label && <span className="text-gray-700">{label}</span>}
        <input
          type="text"
          value={value}
          name={name}
          onChange={(e) => setValue(e.target.value)}
          placeholder={!defaultValue ? placeholder : ""}
          className="border border-gray-300 rounded-xl px-3 py-1 w-48 text-sm focus:outline-none focus:ring-2 text-gray-500"
        />
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={loading}
          className={`bg-[#C4E9FD] font-medium text-sm px-4 py-2 rounded-3xl pointer hover:bg-blue-200 disabled:opacity-50 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-300"
          }`}
        >
          {buttonLabel}
        </button>
      </div>

      {/* Status message */}
      {statusMessage && (
        <div
          className={`text-xs ${
            statusMessage.includes("error") || statusMessage.includes("failed")
              ? "text-red-500"
              : statusMessage.includes("Updating")
              ? "text-blue-500"
              : "text-green-600"
          }`}
        ><span dangerouslySetInnerHTML={{__html: statusMessage}}></span>
        </div>
      )}
    </form>
  );
};

export default TextInputSubmit;
