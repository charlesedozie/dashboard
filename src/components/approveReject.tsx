"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface ApproveRejectProps {
  apiEndpoint: string;
  hiddenFields?: Record<string, any>;
  label?: string;
  placeholder?: string;
  btnValue?: string;
  defaultValue?: string;
  name: string;
  isLogout?: boolean;
  onSuccess?: () => void; // ✅ parent callback (to refetch after approve/reject)
}

const ApproveReject: React.FC<ApproveRejectProps> = ({
  apiEndpoint,
  hiddenFields = {},
  label = "",
  placeholder = "Enter text...",
  defaultValue,
  btnValue = "Submit",
  name,
  isLogout = true,
  onSuccess, // ✅ callback
}) => {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonLabel, setButtonLabel] = useState<string>(btnValue);
  const [statusMessage, setStatusMessage] = useState<string>("");

const { theme } = useTheme();
const isDark = theme === "dark";

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setStatusMessage("Updating...");

    try {
      const payload = { ...hiddenFields };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/${apiEndpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("API Error:", await res.text());
        setStatusMessage("An error occurred while updating.");
      } else {
        setStatusMessage("<span class='text-green-600 text-xs'>Updated!</span>");
        setButtonLabel("Updated");

        // ✅ Trigger parent refetch after success
        if (typeof onSuccess === "function") {
          onSuccess();
        }

        setTimeout(() => setButtonLabel(btnValue), 2000);
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-fit">
      <div className="flex items-center">
        {name === "approve" && (
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className={`bg-[#14265C] pointer text-white py-1 text-xs hover:bg-blue-800 px-3 rounded-xl ${
              loading ? "bg-gray-400 cursor-not-allowed" : ""
            }`}
          >
            {buttonLabel}
          </button>
        )}
        {name === "reject" && ( 
<button 
type="button"
onClick={() => handleSubmit()}
disabled={loading}
 className={`bg-transparent border-0 font-medium pointer px-4 py-1 hover:border-gray-600 focus:outline-none text-xs ${
            isDark
              ? "text-yellow-300"
              : "text-red-700"
          }`}>
    {buttonLabel}
    </button>
        )}
      </div>

      {statusMessage && (
        <div
          className="text-xs"
          dangerouslySetInnerHTML={{ __html: statusMessage }}
        />
      )}
    </form>
  );
};

export default ApproveReject;
