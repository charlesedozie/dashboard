import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import AuthGuard from "@/components/authGuard";
import {kanit, exo2, rajdhani, poppins} from "@/utils/fonts";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import "./globals.css";
import Providers from "@/components/providers";
import { ThemeProvider } from 'next-themes'

//const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], });
//const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], });


// Metadata for head
export const metadata: Metadata = {
  metadataBase: new URL("https://mygleen.com"),
  title: "GLEEN",
  description:
    "GLEEN makes preparing for WAEC, NECO, JAMB and Post UTME easier - and yes, a lot more fun than cramming alone at midnight.",
  keywords:
    "betting reviews, sportsbook reviews, best betting sites, online betting, betting bonuses, sports betting, top bookmakers, betting site ratings, odds comparison",
  manifest: "/manifest.json",
  icons: {
    icon: ["/favicon.ico", "/icons/icon-192x192.png"],
    apple: "/icons/icon-192x192.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "BetVersed - Professional Bet Reviews",
    description:
      "Discover honest and in-depth reviews of top betting sites. Compare bonuses, odds, and features to find the best sportsbook for your winning bets!",
    url: "https://mygleen.com",
    siteName: "BetVersed",
    images: [
      {
        url: "/apple-icon-114x114.png",
        width: 114,
        height: 114,
        alt: "GLEEN",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@myhandle",
    title: "BetVersed",
    description: "BetVersed betting reviews",
    images: ["/logo.webp"],
  },
};
export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {

return (
<html lang="en" suppressHydrationWarning>
<body className={`antialiased min-h-screen transition-colors duration-500 
        bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 
        dark:from-gray-900 dark:via-gray-950 dark:to-black`}
        style={{ fontFamily: "poppins, sans-serif" }}>
<ThemeProvider attribute="class" defaultTheme="light">
<main id="main-content">
<Providers><AuthGuard>
{children}</AuthGuard></Providers>
</main>
</ThemeProvider>
</body>
</html>
);
}

