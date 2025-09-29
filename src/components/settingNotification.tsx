"use client";

import Image from "next/image";
import Link from 'next/link';
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import SwitchButton from "@/components/switchButton";

export default function App(options: FProps)  {
const handleToggle = async (state: boolean) => {
console.log("Notifications enabled:", state);
// Call API to update user notification preference
// await fetch("/api/update-notifications", { method: "POST", body: JSON.stringify({ notifications: state }) });
};
return (<section className='w-full'>
<SubTitle string1='Notification Settings' string2='Configure when and what type of notifications you recieve' />
<section className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
<span className="text-gray-800 text-sm font-medium flex-1">
<span className='text-base font-bold'>User Notifications</span> <br /><span>Do you want to receive notifications pertaining to user activities?</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint="/api/toggle-feature"
defaultState={true}
hiddenFields={{ userId: "123", feature: "dark-mode" }}
label=""
/></section>



<section className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
<span className="text-gray-800 text-sm font-medium flex-1">
<span className='text-base font-bold'>Sound Preferences</span> <br /><span>Turn sounds on or off for incoming alerts to match your workflow.</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint="/api/toggle-feature"
defaultState={true}
hiddenFields={{ userId: "123", feature: "dark-mode" }}
label=""
/></section>


<section className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
<span className="text-gray-800 text-sm font-medium flex-1">
<span className='text-base font-bold'>Email Notifications</span> <br /><span>Receive important updates via email</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint="/api/toggle-feature"
defaultState={true}
hiddenFields={{ userId: "123", feature: "dark-mode" }}
label=""
/></section>


<section className="flex items-center gap-4 p-4 bg-white rounded-lg w-full">
<span className="text-gray-800 text-sm font-medium flex-1">
<span className='text-base font-bold'>App Updates</span> <br /><span>Be informed about new features, updates and improvements to the app</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint="/api/toggle-feature"
defaultState={true}
hiddenFields={{ userId: "123", feature: "dark-mode" }}
label=""
/></section>
</section>
);
}
