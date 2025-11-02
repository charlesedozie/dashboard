"use client";

import { useState, ReactNode } from "react";
import { useTheme } from "next-themes";

interface PopupProps {
  title: string;
  description: string;
  duration: string;
  mainContent: string; // HTML string
  videoUrl1?: string; // optional video 1
  videoUrl2?: string; // optional video 2
  triggerText?: string;
  triggerIcon?: ReactNode;
}

export default function Popup({
  title,
  description,
  duration,
  mainContent,
  videoUrl1,
  videoUrl2,
  triggerText,
  triggerIcon,
}: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  const isDark = theme === "dark";
  const popupBg = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-200" : "text-gray-800";
  const subText = isDark ? "text-gray-400" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const overlayBg = isDark ? "bg-black/70" : "bg-black/50";
  const buttonStyle = isDark
    ? "bg-slate-800 text-gray-100 hover:bg-slate-700"
    : "bg-blue-600 text-white hover:bg-blue-700";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openPopup}
        className={`cursor-pointer ${textColor} hover:underline`}
      >
        {triggerIcon || triggerText || "Open"}
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 ${overlayBg} flex items-center justify-center z-50`}
        >
          {/* Popup Box */}
          <div
            className={`relative w-[90%] h-[90%] ${popupBg} ${textColor} rounded-xl shadow-xl overflow-y-auto p-8 text-left border ${borderColor}`}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className={`absolute top-4 right-4 text-3xl leading-none cursor-pointer ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              &times;
            </button>

            {/* Popup Content */}
            <div className="h-full flex flex-col text-left">
              <h2 className="text-3xl font-bold mb-3">{title}</h2>
              <p className={`${subText} mb-2`}>{description}</p>
              <p className={`text-sm ${subText} mb-6`}>
                Duration: {duration}
              </p>

              {/* Video Section */}
              <div className="space-y-6 mb-6">
               
                {videoUrl2 && (
                  <div className="mb-10">
                    <p
                      className={`font-semibold mb-4 text-center ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Video
                    </p>
                    <video
                      src={videoUrl2}
                      controls
                      className="w-full max-h-[400px] rounded-md shadow"
                    />
                  </div>
                )}
              </div>

               {videoUrl1 && (
                  <div>
                    <p
                      className={`font-semibold mb-2 font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Caption
                    </p>
                     <div
                className={`prose max-w-none mb-12 flex-1 ${textColor}`}
                dangerouslySetInnerHTML={{ __html: videoUrl1 }}
              />
                  </div>
                )}


              {/* HTML Main Content */}
              <div
                className={`prose max-w-none flex-1 ${textColor}`}
                dangerouslySetInnerHTML={{ __html: mainContent }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
