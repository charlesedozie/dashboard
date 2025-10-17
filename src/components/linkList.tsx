"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

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

  return (
    <div
      className="
        flex flex-row 
        w-full 
        overflow-x-auto 
        space-x-2
        whitespace-nowrap
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
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
              "flex items-center justify-between p-3 transition-colors min-w-[140px] sm:min-w-[180px]",
              "hover:bg-gray-100 border border-gray-200 rounded-lg",
              isActive ? "bg-gray-200 font-medium" : "bg-white"
            )}
          >
            <span className="truncate">{item.label}</span>
            {!isActive && <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
          </Link>
        );
      })}
    </div>
  );
}
