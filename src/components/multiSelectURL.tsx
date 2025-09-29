"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
}

export default function MultiSelectDropdown({ options }: MultiSelectProps) {
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter options by search term
  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  // Toggle single option
  const toggleOption = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  // Select all options
  const handleSelectAll = () => {
    setSelectedValues(options.map((o) => o.value));
  };

  // Clear all selections (no redirect)
  const handleClearAll = () => {
    setSelectedValues([]);
  };

  // Redirect on Apply button click
  const handleApply = () => {
    if (selectedValues.length === 0) return; // prevent empty redirect
    const params = selectedValues.join(",");
    router.push(`/user-area/lessons?action=list&subjects=${params}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-200 rounded-md p-2 bg-white cursor-pointer flex justify-between items-center"
      ><span>Filter</span>
<SlidersHorizontal className="def-color" />
        <span>
          {selectedValues.length
            ? `${selectedValues.length} Selected`
            : "Select"}
        </span>
        <span>▼</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-1 w-full border bg-white shadow-md rounded-md z-10 p-2">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-1 border rounded mb-2 text-sm"
          />

          {/* Actions */}
          <div className="flex justify-between text-sm mb-2">
            <button
              onClick={handleSelectAll}
              className="text-blue-600 hover:underline"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer"
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
              <p className="text-center text-gray-400 text-sm py-2">
                No results found
              </p>
            )}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={selectedValues.length === 0}
            className={`mt-3 w-full p-2 rounded text-white ${
              selectedValues.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
