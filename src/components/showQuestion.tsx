"use client";

import { useState, ReactNode } from "react";
import { useTheme } from "next-themes";

interface Option {
  title: string;
  image: string | null;
}

interface PopupProps {
  question: string;
  answer: string;
  type: string;
  avatar: string;
  options: Option[];
  triggerText?: string;
  triggerIcon?: ReactNode;
}

export default function Popup({
  question,
  answer,
  type,
  avatar,
  options = [],
  triggerText,
  triggerIcon,
}: PopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  // ✅ helper: check if image URL is valid
  const isValidImageUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
    } catch {
      return false;
    }
  };

  // ✅ Theme-based styles
  const isDark = theme === "dark";
  const popupBg = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-200" : "text-gray-800";
  const subText = isDark ? "text-gray-400" : "text-gray-600";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const overlayBg = isDark ? "bg-black/70" : "bg-black/50";

  return (
    <>
      {/* Trigger Button */}
      <section
        onClick={openPopup}
        className={`cursor-pointer ${textColor} hover:underline`}
      >
        {triggerIcon || triggerText || "Open"}
      </section>

      {/* Popup Overlay */}
      {isOpen && (
        <div className={`fixed inset-0 ${overlayBg} flex items-center justify-center z-50`}>
          {/* Popup Box */}
          <div
            className={`relative w-[90%] h-[90%] ${popupBg} ${textColor} rounded-xl shadow-xl overflow-y-auto p-8 text-left border ${borderColor}`}
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className={`absolute top-4 right-4 text-3xl leading-none cursor-pointer ${
                isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              &times;
            </button>

            {/* Popup Content */}
            <div className="h-full flex flex-col text-left">
              <h2 className="text-3xl font-bold mb-3">
                Question: {question}
              </h2>

              <section className="mb-6 font-semibold">
                Cover or Avatar:
                {isValidImageUrl(avatar) ? (
                  <img
                    src={avatar}
                    alt={question}
                    className={`w-16 h-16 object-cover rounded-md border ${borderColor}`}
                  />
                ) : (
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-md border ${borderColor} ${subText}`}
                  >
                    No image
                  </div>
                )}
              </section>

              <section className={`${subText} mb-6`}>
                <span className="font-semibold text-sm text-gray-400">Correct Answer:</span> {answer}
              </section>

              <section className={`${subText} mb-6`}>
                <span className="font-semibold">Type:</span> {type}
              </section>

              {type?.toLowerCase() === "multiple_choice" && (
                <section>
                  <section className={`text-sm ${subText} mb-6 font-semibold`}>
                    Options
                  </section>

                  <section className={`text-sm ${subText} mb-6`}>
                    {options?.map((opt, index) => (
                      <section key={`option-${index}`} className="mb-10">
                        <section className="py-3 text-sm align-top font-medium">
                          {opt.title}
                        </section>
                        <section className="py-3 text-sm align-top">
                          {isValidImageUrl(opt.image) ? (
                            <img
                              src={opt.image as string}
                              alt={opt.title}
                              className={`w-16 h-16 object-cover rounded-md border ${borderColor}`}
                            />
                          ) : (
                            <div
                              className={`w-16 h-16 flex items-center justify-center rounded-md border ${borderColor} ${subText}`}
                            >
                              No image
                            </div>
                          )}
                        </section>
                      </section>
                    ))}
                  </section>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}