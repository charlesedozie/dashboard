"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { addDays, format, parseISO } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../app/globals.css";

export default function PeriodChart() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pickerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default dates
  const today = new Date();
  const defaultRange = [
    { startDate: today, endDate: addDays(today, 7), key: "selection" },
  ];

  const [range, setRange] = useState(defaultRange);
  const [showPicker, setShowPicker] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [dropDirection, setDropDirection] = useState<"right" | "left">("right");

  // Parse URL params
  const getParams = () => {
    const startParam = searchParams?.get("start");
    const endParam = searchParams?.get("end");
    return {
      start: startParam ? parseISO(startParam) : defaultRange[0].startDate,
      end: endParam ? parseISO(endParam) : defaultRange[0].endDate,
    };
  };

  const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // Check available space before showing picker
  const handleShowPicker = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      // If not enough space on right side → open to left
      if (rect.right + 350 > windowWidth) {
        setDropDirection("left");
      } else {
        setDropDirection("right");
      }
    }
    setShowPicker(true);
    setClickCount(0);
  };

  // Handle date selection
  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    const s = startDate ? normalize(startDate) : null;
    const e = endDate ? normalize(endDate) : null;

    setRange([{ startDate: s ?? today, endDate: e ?? today, key: "selection" }]);

    const nextCount = clickCount + 1;
    if (e && nextCount >= 2) {
      const startStr = format(s!, "yyyy-MM-dd");
      const endStr = format(e, "yyyy-MM-dd");
      router.push(`?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}`);
      setShowPicker(false);
      setClickCount(0);
    } else {
      setClickCount(nextCount);
    }
  };

  // Sync with URL changes
  useEffect(() => {
    const { start, end } = getParams();
    setRange([{ startDate: normalize(start), endDate: normalize(end), key: "selection" }]);
    setShowPicker(false);
    setClickCount(0);
  }, [pathname, searchParams?.toString()]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
        setClickCount(0);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Labels
  const { start, end } = getParams();
  const startLabel = format(normalize(start), "yyyy-MM-dd");
  const endLabel = format(normalize(end), "yyyy-MM-dd");

  return (
    <div
      ref={containerRef}
      className="relative z-50 rounded-lg shadow-md w-fit"
    >

      <div
        className="flex bg-white items-center gap-4 cursor-pointer border border-gray-200 rounded-md p-2"
        onClick={handleShowPicker}
      ><Calendar className="w-5 h-5 text-blue-600" />
        <span className="text-gray-800">Start: {startLabel}</span> - 
        <span className="text-gray-800">End: {endLabel}</span>
      </div>
    </div>
  );
}
