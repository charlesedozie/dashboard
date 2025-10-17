"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DropdownItem = {
  label: string;
  href: string;
};

interface ActionDropdownProps {
  items: DropdownItem[];
}

export default function ActionDropdown({ items }: ActionDropdownProps) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelected(value);
    if (value) {
      router.push(value);
    }
  };

  return (
    <select
      value={selected}
      onChange={handleChange}
      className="p-1 border border-gray-200 text-xs rounded-md"
    >
      <option value="">-- All --</option>
      {items?.map((item, idx) => (
        <option key={idx} value={item.href}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
