"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { useTheme } from "next-themes";

export type ExportFormat = "csv" | "excel" | "pdf";

export interface TableHeader {
  label: string;
  key: string;
}

interface DataExporterProps<T extends Record<string, any>> {
  data: T[];
  headers: TableHeader[];
  fileName?: string;
  className?: string;
}

const DataExporter = <T extends Record<string, any>>({
  data,
  headers,
  fileName = "data",
  className = "",
}: DataExporterProps<T>) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [format, setFormat] = useState<ExportFormat>("csv");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    headers.map((h) => h.key)
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const activeHeaders = headers.filter((h) => selectedColumns.includes(h.key));
  const headerLabels = activeHeaders.map((h) => h.label);
  const mappedData = data.map((item) =>
    activeHeaders.map((h) => item[h.key] ?? "")
  );

  const exportToCSV = () => {
    const csvRows = [headerLabels.join(",")];
    mappedData.forEach((row) => csvRows.push(row.join(",")));
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const worksheetData = [headerLabels, ...mappedData];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [headerLabels],
      body: mappedData,
    });
    doc.save(`${fileName}.pdf`);
  };

  const handleExport = () => {
    if (!data.length) return alert("No data to export");
    if (!selectedColumns.length) return alert("Please select at least one column");
    switch (format) {
      case "csv":
        exportToCSV();
        break;
      case "excel":
        exportToExcel();
        break;
      case "pdf":
        exportToPDF();
        break;
    }
  };

  return (
    <div
      className={`text-sm flex flex-wrap gap-2 items-center transition-colors duration-300 ${className}`}
    >
      {/* === Column Selector Dropdown === */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`border pointer rounded-md px-4 py-2 flex justify-between items-center w-full sm:w-auto transition-all ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700"
              : "bg-gray-50 border-gray-300 text-gray-800 hover:bg-gray-100"
          }`}
        >
          <span>⚙️ Columns</span>
          <span
            className={`ml-2 transform transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </button>

        {open && (
          <div
            className={`absolute z-[9999] mt-2 rounded-md shadow-lg p-3 w-56 border transition-all ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <h3 className="font-medium text-sm mb-2">Choose columns:</h3>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {headers?.map((header) => (
                <label key={header.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(header.key)}
                    onChange={() => toggleColumn(header.key)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm">{header.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* === Format Selector Dropdown === */}
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as ExportFormat)}
        className={`border rounded-md px-3 py-2 transition-all pointer ${
          isDark
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-300 text-gray-800"
        }`}
      >
        <option value="csv">CSV</option>
        <option value="excel">Excel</option>
        <option value="pdf">PDF</option>
      </select>

      {/* === Export Button === */}
      <button
        onClick={handleExport}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
          isDark
            ? "def-bg pointer hover:bg-blue-500 text-white"
            : "def-bg pointer hover:bg-blue-600 text-white"
        }`}
      >
        Export {format.toUpperCase()}
      </button>
    </div>
  );
};

export default DataExporter;
