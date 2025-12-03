"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Cpu,
  Activity,
  Network,
  KeyRound,
  Shield,
  Settings,
} from "lucide-react";

const nav = [
  { name: "Overview", icon: Home, href: "/console/dashboard" },
  { name: "Modules", icon: Cpu, href: "/console/modules" },
  { name: "Agents", icon: Activity, href: "/console/agents" },
  { name: "Mesh Graph", icon: Network, href: "/console/mesh" },
  { name: "Rho² Keyring", icon: KeyRound, href: "/console/rho2" },
  { name: "Security", icon: Shield, href: "/console/security" },
  { name: "Settings", icon: Settings, href: "/console/settings" },
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


