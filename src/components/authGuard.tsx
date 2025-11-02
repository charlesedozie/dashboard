"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { hasAccess } from "@/utils/curUser";
import {AccessDenied} from "@/components/utils";
import {getUserField, getUser} from "@/utils/curUser";

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/otp", "/update-password", "/logout"]; // whitelist

export default function RootLayout({ children }: { children: React.ReactNode }) {
const pathname = usePathname();
const router = useRouter();
const [checking, setChecking] = useState(true);
let signIn;
const userRole = getUserField<string>("role");
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

if (!checking && !signIn && pathname !== "/login" && pathname !== "/logout" && pathname !== "/otp" && pathname !== "/forgot-password" && pathname !== "/update-password") { window.location.href = "/logout"; return null;  }


const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
if (!isPublic && !hasAccess(userRole, ["ADMIN", "SUPER_ADMIN", "TUTOR"])) {
return <AccessDenied />; }
if(sessionStorage.getItem("username") && !getUser()?.user.isEmailVerified && pathname !== "/otp" && pathname !== "/logout"){window.location.href = "/otp"; return null; }

if(sessionStorage.getItem("username") && sessionStorage.getItem("updatePassword") && sessionStorage.getItem("updatePassword") == 'pr=9w&2D2' && pathname !== "/otp" && pathname !== "/logout" && pathname !== "/update-password"){window.location.href = "/update-password"; return null; }
return <>{children}</>; 
}
