"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "next-themes";

type LinkItem = {
  label: string;
  href: string;
};

interface LinksListProps {
  items: LinkItem[];
}

export default function LinksList({ items }: LinksListProps) {
  const searchParams = useSearchParams();
  const activeSub = searchParams.get("sub");
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <div
      className="
        flex flex-row 
        w-full 
        overflow-x-auto 
        space-x-2
        whitespace-nowrap
        scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
      "
    >
      {items?.map((item, index) => {
        const linkSub = new URLSearchParams(item.href.split("?")[1]).get("sub");
        const isActive = activeSub === linkSub;

        return (
          <Link
            key={index}
            href={item.href}
            className={clsx(
              "flex items-center justify-between p-3 transition-colors min-w-[140px] sm:min-w-[180px] rounded-lg border",
              isDarkMode
                ? clsx(
                    "border-gray-700 hover:bg-gray-800",
                    isActive ? "bg-gray-700 text-white font-medium" : "bg-gray-900 text-gray-200"
                  )
                : clsx(
                    "border-gray-200 hover:bg-gray-100",
                    isActive ? "bg-gray-200 text-gray-900 font-medium" : "bg-white text-gray-700"
                  )
            )}
          >
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
