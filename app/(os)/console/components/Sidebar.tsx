"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { name: "Dashboard", href: "/console/dashboard" },
  { name: "Agents", href: "/console/agents" },
  { name: "Automations", href: "/console/automations" },
  { name: "Monitoring", href: "/console/monitoring" },
  { name: "Security", href: "/console/security" },
  { name: "Settings", href: "/console/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-white/10 bg-black/30 backdrop-blur-xl h-full p-4 flex flex-col">
      <nav className="flex flex-col gap-2">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href === "/console/dashboard" && pathname === "/console");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

