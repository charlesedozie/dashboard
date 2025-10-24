"use client";
import React from 'react';  // Add this line after your existing imports
//import Image from "next/image";
//import Link from 'next/link';
import { FProps } from '@/types'; 
import LinkList from "./linkList";
import SettingProfile from "./settingProfile";
import DefaultView from "./settingProfile";
import SettingNotification from "./settingNotification";
import SettingPreference from "./settingPreference";

import SubTitle from "./subTitle";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/*
type TutorFormInputs = {
name: string;
gender: 'Male' | 'Female';
email: string;
phone: string;
subject: string;
};
*/
const links = [
{ label: "Profile", href: "/user-area/dboard?action=list&mod=settings&sub=profile" },
{ label: "Notification", href: "/user-area/dboard?action=list&mod=settings&sub=notification" },
{ label: "Preferences", href: "/user-area/dboard?action=list&mod=settings&sub=preference" },
];

export default function Setting(options: FProps)  {
const searchParams = useSearchParams();
const sub = searchParams.get("sub");

const componentsMap: Record<string, React.JSX.Element> = {
profile: <SettingProfile />,
notification: <SettingNotification />,
preference: <SettingPreference />,
};

// Pick the right component or fall back to default
const RenderedComponent = useMemo(() => {
return componentsMap[sub ?? ""] || <DefaultView />;
}, [sub]);


return (<section className='w-full'><section className='mb-6'>
<SubTitle string1='Settings' string2='Manage your profile and customize how the app works for you' /></section>
<section className='font-semibold mb-4'>Settings Menu</section>
<section className='mb-3'><LinkList items={links} /></section>
<div className="p-2">
{RenderedComponent}
</div></section>
);
}
