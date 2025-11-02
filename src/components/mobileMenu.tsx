"use client";
import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { sidebarItems, sidebarFootItems } from "@/types";
import { getUserField } from "@/utils/curUser";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Drawer() {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const userRole = getUserField<string>("role");

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const logoSrc = isDark ? "/logowhite.webp" : "/gleenlogo1.webp";
  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-100" : "text-gray-800";
  const hoverColor = isDark ? "hover:bg-gray-800" : "hover:bg-[#E1E5F0]";
  const activeColor = isDark ? "bg-blue-600 text-white" : "def-bg text-white";

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={`p-2 bg-transparent rounded-xl transition ${
          isHome ? "text-white" : isDark ? "text-gray-200" : "text-black"
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        />
      )}

      {/* Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: open ? "0%" : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`fixed top-0 left-0 h-full w-72 ${bgColor} shadow-2xl p-4 z-50 flex flex-col transition-colors duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Image
            src={logoSrc}
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
          />
          <button
            onClick={() => setOpen(false)}
            className={`p-2 rounded-full ${hoverColor}`}
            aria-label="Close menu"
          >
            <X className={`w-6 h-6 ${textColor}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-2">
          {sidebarItems.map((item) => {
            const isActive = pathname.startsWith(`/user-area/${item.section}`);
            const Icon = item.icon;
            const canView =
              item.section !== "admin-control" ||
              (item.section === "admin-control" &&
                userRole &&
                ["admin", "super_admin"].includes(userRole.toLowerCase()));

            return (
              canView && (
                <Link
                  key={item.section}
                  href={`/user-area/${item.section}`}
                  className={`flex items-center p-4 rounded-lg font-medium transition-colors ${
                    isActive
                      ? activeColor
                      : `${textColor} ${hoverColor} hover:text-blue-600`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="pl-3">{item.name}</span>
                </Link>
              )
            );
          })}

          {sidebarFootItems.map((item) => {
            const isActive = pathname.startsWith(`/user-area/${item.section}`);
            const Icon = item.icon;
            const canView =
              item.section !== "support" ||
              (item.section === "support" &&
                userRole &&
                ["admin", "super_admin"].includes(userRole.toLowerCase()));

            return (
              canView && (
                <Link
                  key={item.section}
                  href={`/user-area/${item.section}`}
                  className={`flex items-center p-4 rounded-lg font-medium transition-colors ${
                    isActive
                      ? activeColor
                      : `${textColor} ${hoverColor} hover:text-blue-600`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="pl-3">{item.name}</span>
                </Link>
              )
            );
          })}

          {/* Logout */}
          <Link
            href="/logout"
            className={`flex items-center p-4 rounded-lg font-medium transition-colors ${hoverColor} ${textColor}`}
          >
            <LogOut className="w-5 h-5" />
            <span className="pl-3">Logout</span>
          </Link>
          <section style={{ marginBottom: "100px" }}></section>
        </nav>
      </motion.div>
    </div>
  );
}
