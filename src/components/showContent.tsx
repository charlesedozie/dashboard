"use client";

import { useState, ReactNode } from "react";

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

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openPopup}>
        {triggerIcon || triggerText || "Open"}
      </button>

      {/* Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {/* Popup Box */}
          <div className="relative w-[90%] h-[90%] bg-white rounded-xl shadow-xl overflow-y-auto p-8 text-left">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl leading-none pointer"
            >
              &times;
            </button>

            {/* Popup Content */}
            <div className="h-full flex flex-col text-left">
              <h2 className="text-3xl font-bold mb-3">{title}</h2>
              <p className="text-gray-700 mb-2">{description}</p>
              <p className="text-sm text-gray-500 mb-6">Duration: {duration}</p>

              {/* Video Section */}
              <div className="space-y-6 mb-6">
                {videoUrl1 && (
                  <div>
                    <p className="text-gray-700 font-medium mb-2 text-center font-semibold my-5">Caption</p>
                    <video
                      src={videoUrl1}
                      controls
                      className="w-full max-h-[400px] rounded-md shadow"
                    />
                  </div>
                )}

                {videoUrl2 && (
                  <div className='mb-10'>
                    <p className="text-gray-700 font-medium mb-4 mt-18 font-semibold text-center">Video</p>
                    <video
                      src={videoUrl2}
                      controls
                      className="w-full max-h-[400px] rounded-md shadow"
                    />
                  </div>
                )}
              </div>

              {/* HTML Main Content */}
              <div
                className="prose max-w-none text-gray-800 flex-1 text-left"
                dangerouslySetInnerHTML={{ __html: mainContent }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
