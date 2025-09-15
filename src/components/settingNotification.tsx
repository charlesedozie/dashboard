"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import ToggleForm from "./toggleForm";

export default function App(options: FProps)  {
const handleToggle = async (state: boolean) => {
    console.log("Notifications enabled:", state);
    // Call API to update user notification preference
    // await fetch("/api/update-notifications", { method: "POST", body: JSON.stringify({ notifications: state }) });
  };
return (<section className='w-full'>
<SubTitle string1='Notification Settings' string2='Configure when and what type of notifications you recieve' />
<section><ToggleForm defaultState={true} title='User Notifications' tagLine='Do you want to receive notifications pertaining to user activities?' onSubmitToggle={handleToggle} /></section>

<section><ToggleForm defaultState={true} title='Sound Preferences' tagLine='Turn sounds on or off for incoming alerts to match your workflow.' onSubmitToggle={handleToggle} /></section>

<section><ToggleForm defaultState={true} title='Email Notifications' tagLine='Receive important updates via email' onSubmitToggle={handleToggle} /></section>

<section><ToggleForm defaultState={true} title='App Updates' tagLine='Be informed about new features, updates and improvements to the app' onSubmitToggle={handleToggle} /></section>
</section>
  );
}
