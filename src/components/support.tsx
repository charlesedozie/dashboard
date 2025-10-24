"use client";

//import Image from "next/image";
//import Link from 'next/link';
import { FProps } from '@/types'; 
//import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import LinkList from "./linkList";
import SupportComplaint from "./supportComplaint";
import SupportFAQ from "./supportFAQ";
import NewFAQ from "./newFAQ";
import DefaultView from "./supportComplaint";
//import SupportRes from "./supportRes";
import SubTitle from "./subTitle";
import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from "react";
import {getUserField} from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";


const links = [
{ label: "Complaints", href: "/user-area/support" },
{ label: "FAQ", href: "/user-area/support?action=list&mod=faq&sub=faq" },
];

export default function Support(options: FProps)  {
const params = useParams();
const searchParams = useSearchParams();

const section = params?.section ?? "defaultSection";
const action = searchParams.get("action") ?? "defaultId";
const mod = searchParams.get("mod") ?? "defaultId";
const id = searchParams.get("id") ?? "defaultId";
const itemId = searchParams.get("itemId") ?? "defaultId";
const popup = searchParams.get("popup") ?? "defaultId";
const sub = searchParams.get("sub") ?? "defaultSub";
const userRole = getUserField<string>("role");

// Map each sub value to a component
const componentsMap: Record<string, React.ReactNode> = {
//const componentsMap: Record<string, JSX.Element> = {
complaint: <SupportComplaint />,
faq: <SupportFAQ />,
create: <NewFAQ />
};

// Pick the right component or fall back to default
const RenderedComponent = useMemo(() => {
return componentsMap[sub ?? ""] || <DefaultView />;
}, [sub]);

let content = (<DefaultView />);

if (action === 'create' && mod === 'faq') { content = <NewFAQ />; }
if (action === 'update' && mod === 'faq') { content = <NewFAQ />; }
if (action === 'list' && mod === 'faq') { content = <SupportFAQ />; }
//if (action === 'edit' && mod === 'complaint') { content = 'SupportRes'; }

const canView =
  !!userRole && ["admin", "super_admin"].includes(userRole.toLowerCase());

if (!canView) {
  return <AccessDenied />;
}
return (<section className='w-full'><section className='mb-10'>
<SubTitle string1='Support' />
</section>
<section className='font-semibold mb-4'>Support Menu</section>
<section className="mb-3"><LinkList items={links} /></section>
<div className="p-2">
<section className="p-2">{content}</section>
</div>
</section>);
}
