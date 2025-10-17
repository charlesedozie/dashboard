"use client";

import { useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import SwitchButton from "@/components/switchButton";

type FormValues = {
  notifications: boolean;
};

interface NotificationToggleFormProps {
  defaultState: boolean;
  title?: string;
  tagLine?: string;
  onSubmitToggle: (state: boolean) => Promise<void> | void;
}

export default function NotificationToggleForm({
  defaultState,
  onSubmitToggle,
  title,
  tagLine,
}: NotificationToggleFormProps) {
  const [enabled, setEnabled] = useState(defaultState);
  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: { notifications: defaultState },
  });

  // Submit form automatically whenever the switch changes
  useEffect(() => {
    setValue("notifications", enabled);
    handleSubmit((data) => onSubmitToggle(data.notifications))();
  }, [enabled, setValue, handleSubmit, onSubmitToggle]);

  return (
    <form className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
      <span className="text-gray-800 text-sm font-medium flex-1">
        <span className='text-base font-bold'>{title}</span> <br /><span dangerouslySetInnerHTML={{__html: tagLine || ''}} />
      </span>

      {/* Switch for toggle */}
      <SwitchButton
        apiEndpoint="/api/toggle-feature"
        defaultState={true}
        hiddenFields={{ userId: "123", feature: "dark-mode" }}
        label=""
      />
      {/* Hidden input for react-hook-form */}
      <input type="hidden" {...register("notifications")} />
    </form>
  );
}
