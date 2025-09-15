"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <div className="flex flex-col w-full overflow-y-auto max-h-screen">
      {items.map((item, index) => {
        const linkSub = new URLSearchParams(item.href.split("?")[1]).get("sub");
        const isActive = activeSub === linkSub;

        return (
          <Link
            key={index}
            href={item.href}
            className={clsx(
              "flex items-center justify-between p-3 transition-colors",
              "hover:bg-gray-100 border-1 border-gray-200",
              isActive ? "bg-gray-200 font-medium" : "bg-white"
            )}
          >
            <span className="text-left">{item.label}</span>
            {!isActive && <ChevronRight className="w-4 h-4 text-gray-500" />}
          </Link>
        );
      })}
    </div>
  );
}
