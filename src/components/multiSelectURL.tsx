"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  redirectUrl?: string;
}

export default function MultiSelectDropdown({ options, redirectUrl }: MultiSelectProps) {
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  const toggleOption = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleSelectAll = () => setSelectedValues(options.map((o) => o.value));
  const handleClearAll = () => setSelectedValues([]);

  const handleApply = () => {
    if (selectedValues.length === 0) return;
    const params = selectedValues.join(",");
    const redirectWithParams = `${redirectUrl}&subjects=${params}`;
    router.push(redirectWithParams);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "border rounded-md p-2 cursor-pointer flex justify-between items-center transition-colors",
          isDarkMode
            ? "bg-gray-900 border-gray-700 text-gray-100 hover:bg-gray-800"
            : "bg-white border-gray-200 text-gray-800 hover:bg-gray-100"
        )}
      >
        <span>Filter</span>
        <SlidersHorizontal
          className={clsx("w-4 h-4", isDarkMode ? "text-gray-300" : "text-gray-700")}
        />
        <span>
          {selectedValues.length ? `${selectedValues.length} Selected` : "Select"}
        </span>
        <span>▼</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={clsx(
            "absolute mt-1 w-full border shadow-md rounded-md z-10 p-2 transition-colors",
            isDarkMode
              ? "bg-gray-900 border-gray-700 text-gray-100"
              : "bg-white border-gray-200 text-gray-800"
          )}
        >
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={clsx(
              "w-full p-1 border rounded mb-2 text-sm transition-colors",
              isDarkMode
                ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            )}
          />

          {/* Actions */}
          <div className="flex justify-between text-sm mb-2">
            <button
              onClick={handleSelectAll}
              className="text-blue-500 hover:underline"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions?.map((option) => (
              <label
                key={option.value}
                className={clsx(
                  "flex items-center gap-2 p-1 cursor-pointer rounded transition-colors",
                  isDarkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => toggleOption(option.value)}
                />
                {option.label}
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <p
                className={clsx(
                  "text-center text-sm py-2",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}
              >
                No results found
              </p>
            )}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={selectedValues.length === 0}
            className={clsx(
              "mt-3 w-full pointer p-2 rounded text-white font-medium transition-colors",
              selectedValues.length === 0
                ? "bg-gray-500 cursor-not-allowed"
                : isDarkMode
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
