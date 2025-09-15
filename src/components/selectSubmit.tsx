"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

type FormValues = {
  notifications: string;
};

interface NotificationToggleFormProps {
  defaultState: string;
  options: { value: string; label: string }[];
  title?: string;
  tagLine?: string;
  onSubmitToggle: (state: string) => Promise<void> | void;
}

export default function NotificationToggleForm({
  defaultState,
  options,
  onSubmitToggle,
  title,
  tagLine,
}: NotificationToggleFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: { notifications: defaultState },
  });

  const selectedValue = watch("notifications");

  // Submit form automatically whenever dropdown changes
  useEffect(() => {
    if (selectedValue !== undefined) {
      handleSubmit((data) => onSubmitToggle(data.notifications))();
    }
  }, [selectedValue, handleSubmit, onSubmitToggle]);

  return (
    <form className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
      <span className="text-gray-800 text-sm font-medium flex-1">
        <span className="text-base font-bold">{title}</span> <br />
        <span>{tagLine}</span>
      </span>

      {/* Dropdown menu */}
      <select
        {...register("notifications")}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setValue("notifications", e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}
