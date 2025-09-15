"use client";

import { useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";

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
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-blue-500" : "bg-gray-300"
        } relative inline-flex h-6 w-11 items-center rounded-full transition`}
      >
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>

      {/* Hidden input for react-hook-form */}
      <input type="hidden" {...register("notifications")} />
    </form>
  );
}
