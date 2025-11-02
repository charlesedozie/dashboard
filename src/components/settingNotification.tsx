"use client";

//import Image from "next/image";
//import Link from 'next/link';
import { useState, useEffect } from "react";
import { FProps } from '@/types';
import SubTitle from "./subTitle";
import SwitchButton from "@/components/switchButton";
import { Data, ApiResponse, RowsResponse1, RowsResponse2 , RowsResponse} from "@/types";
import { fetchData } from "@/utils/fetchData"; 
import { useQuery } from "@tanstack/react-query";


import {getUser} from "@/utils/curUser";

export default function App(options: FProps)  {
const [apiURL, setApiURL] = useState('notification-settings');
const [notificationId, setNotificationId] = useState<Data>();


const { data, isLoading, isFetching, refetch } = useQuery<ApiResponse<RowsResponse2>>({
  queryKey: ["notification-settings"],
  queryFn: async () => {
  const response = await fetchData<ApiResponse<RowsResponse2>>(`notification-settings/user/${getUser()?.user.id}`, {}, 10);
  if (!response) {
    throw new Error("No data returned from lessons endpoint");
  }
  return response;
},
staleTime: 10 * 1000, // 10 seconds
refetchOnMount: true,
refetchOnWindowFocus: false,
});

useEffect(() => {
//if (data?.data?.rows && data.data.rows.length > 0) {
if(notificationId != data?.data){setNotificationId(data?.data);}
}, [data]);

return (<section className='w-full'>
<SubTitle string1='Notification Settings' string2='Configure when and what type of notifications you recieve' />
<section className="flex items-center gap-4 p-4 rounded-lg w-full">
<span className="text-sm font-medium flex-1">
<span className='text-base font-bold'>User Notifications</span> <br /><span>Do you want to receive notifications pertaining to user activities?</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint={`notification-settings/${notificationId?.id}`}
defaultState={notificationId?.userNotification}
hiddenFields={{ userId: getUser()?.user.id }}
label='userNotification'
key={`${getUser()?.user.id}userNotification`}
/></section>



<section className="flex items-center gap-4 p-4 rounded-lg w-full">
<span className="text-sm font-medium flex-1">
<span className='text-base font-bold'>Sound Preferences</span> <br /><span>Turn sounds on or off for incoming alerts to match your workflow.</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint={`notification-settings/${notificationId?.id}`}
defaultState={notificationId?.soundNotification}
hiddenFields={{ userId: getUser()?.user.id }}
label='soundNotification'
key={`${getUser()?.user.id}soundNotification`}
/></section>


<section className="flex items-center gap-4 p-4 rounded-lg w-full">
<span className="text-sm font-medium flex-1">
<span className='text-base font-bold'>Email Notifications</span> <br /><span>Receive important updates via email</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint={`notification-settings/${notificationId?.id}`}
defaultState={notificationId?.emailNotification}
hiddenFields={{ userId: getUser()?.user.id }}
label='emailNotification'
key={`${getUser()?.user.id}emailNotification`}
/></section>


<section className="flex items-center gap-4 p-4 rounded-lg w-full">
<span className="text-sm font-medium flex-1">
<span className='text-base font-bold'>App Updates</span> <br /><span>Be informed about new features, updates and improvements to the app</span>
</span>

{/* Switch for toggle */}
<SwitchButton
apiEndpoint={`notification-settings/${notificationId?.id}`}
defaultState={notificationId?.appNotification ?? false}
hiddenFields={{ userId: getUser()?.user.id }}
label='appNotification'
key={`${getUser()?.user.id}appNotification`}
/></section>
</section>
);
}
