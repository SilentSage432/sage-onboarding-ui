"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { moduleRegistry } from "@/lib/console/moduleRegistry";
import { cn } from "@/lib/utils";

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
    <aside className="w-20 h-screen bg-[#080b11] border-r border-white/5 flex flex-col py-6 gap-6">
      {nav.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href === "/console/dashboard" && pathname === "/console");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative flex flex-col items-center gap-1 py-3 transition-all duration-200",
              active
                ? "text-white"
                : "text-slate-400 group-hover:text-white group-hover:animate-[sage-sidebar-hover_200ms_ease-in-out]"
            )}
          >
            {active && (
              <div className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-[0_0_6px_rgba(140,90,255,0.6)]" />
            )}
            <div className="flex flex-col items-center gap-1 w-24">
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  active
                    ? "text-white drop-shadow-[0_0_4px_rgba(180,120,255,0.45)]"
                    : "text-slate-400 group-hover:text-white"
                )}
              />
              <span className="text-[11px] leading-tight whitespace-nowrap text-center tracking-wide">
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </aside>
  );
}


