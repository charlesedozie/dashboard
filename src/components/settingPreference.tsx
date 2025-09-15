"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import ToggleForm from "./toggleForm";
import SelectForm from "./selectSubmit";

export default function App(options: FProps)  {
const handleToggle = async (state: boolean) => {
    console.log("Notifications enabled:", state);
    // Call API to update user notification preference
    // await fetch("/api/update-notifications", { method: "POST", body: JSON.stringify({ notifications: state }) });
  };	
return (<section className='w-full'>
<SubTitle string1='App Preferences' string2='Customize your app experience and security settings' />

<section><SelectForm
  defaultState="enabled"
  options={[
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
    { value: "custom", label: "Custom" },
  ]}
  title="Theme Mode"
  tagLine="Choose your preferred app appearance"
  onSubmitToggle={(value) => console.log("Selected:", value)}
/>
</section>

<section><SelectForm
  defaultState="enabled"
  options={[
    { value: "enabled", label: "Enabled" },
    { value: "disabled", label: "Disabled" },
    { value: "custom", label: "Custom" },
  ]}
  title="Font Size"
  tagLine="Adjust the font size to improve readability"
  onSubmitToggle={(value) => console.log("Selected:", value)}
/>
</section>

<section><ToggleForm defaultState={true} title='Remember me' tagLine={`Enable this option to keep your account logged in for faster access. <br />Turn it off if you’re on a shared or public device`} onSubmitToggle={handleToggle} /></section>


</section>
  );
}
