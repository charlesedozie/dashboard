"use client";

import MobileMenu from "@/components/mobileMenu"
import MobileFooter from "@/components/mobileNav"
import { useTheme } from "next-themes";
import Image from 'next/image';
import Link from "next/link";

export default function App() {
const { theme } = useTheme();
const isDark = theme === "dark";
const logoSrc = isDark ? "/logowhite.webp" : "/gleenlogo1.webp";

return (<>

<div className="flex justify-between items-center rounded-md md:hidden p-2">
{/* Left Element */}
<div>
<Link href={`/user-area/dboard`}>
<Image
src={logoSrc}
alt={'Gleen Edutech'}
title={'Gleen Edutech'}
width={130}
height={60}
style={{ objectFit: 'cover' }}
/>
</Link>
</div>

{/* Right Element */}
<div className="text-right font-medium text-gray-700">
<MobileMenu /><MobileFooter />
</div>
</div>
</>);
}
