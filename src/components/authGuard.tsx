"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/otp", "/update-password", "/logout"]; // whitelist

export default function RootLayout({ children }: { children: React.ReactNode }) {
const pathname = usePathname();
const router = useRouter();
const [checking, setChecking] = useState(true);
let signIn;

if (typeof window !== "undefined") {signIn = sessionStorage.getItem("username");}
useEffect(() => {
const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
if (!isPublic) {

signIn = sessionStorage.getItem("username");
if (!signIn) { router.replace("/login"); return; }
} setChecking(false); }, [pathname, router]);

if (checking) {
return <div className="flex flex-col h-screen w-full items-center justify-center">
<p className='mb-8'>
<Image
src={'/gleenlogo1.webp'}
alt={'Gleen Logo'}
title={'Gleen Logo'}
width={170}
height={80}
style={{ objectFit: 'cover' }}
/>
</p>
<p>Loading...</p>
</div>;
}

if (!signIn && pathname !== "/login") {router.replace("/login"); }
else { return <>{children}</>; }
}
