"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { moduleRegistry } from "@/lib/console/moduleRegistry";

const nav = [
  { name: "Overview", icon: Home, href: "/console/dashboard" },
  ...moduleRegistry.map((mod) => ({
    name: mod.name,
    icon: mod.icon,
    href: `/console/${mod.slug}`,
  })),
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-20 h-screen border-r border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex flex-col py-6 space-y-6">
      {nav.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href === "/console/dashboard" && pathname === "/console");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-3 transition-colors ${
              active ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[10px] mt-1">{item.name}</span>
          </Link>
        );
      })}
    </aside>
  );
}


