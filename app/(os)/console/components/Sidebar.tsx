"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lock } from "lucide-react";
import { moduleRegistry } from "@/lib/console/moduleRegistry";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";
import { isModuleUnlocked, isModuleVisibleToPerspective } from "@/lib/console/readinessUtils";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const readinessState = useReadinessStore();

  // Build nav array with lock state information
  // Filter by perspective first (architect-only modules don't exist for non-architects)
  const visibleModules = moduleRegistry.filter((mod) =>
    isModuleVisibleToPerspective(mod, readinessState.systemPerspective)
  );
  
  const nav = [
    { 
      name: "Overview", 
      icon: Home, 
      href: "/console/dashboard", 
      id: "overview",
      isLocked: false,
      module: null,
    },
    ...visibleModules.map((mod) => {
      const isUnlocked = isModuleUnlocked(
        mod, 
        readinessState.unlockedCapabilities,
        readinessState.systemPerspective
      );
      return {
        name: mod.name,
        icon: mod.icon,
        href: `/console/${mod.slug}`,
        id: mod.slug,
        isLocked: !isUnlocked,
        module: mod,
      };
    }),
  ];

  return (
    <motion.aside
      layout
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        fixed left-0 top-0
        h-screen w-20
        flex flex-col items-center
        gap-6
        bg-[#080b11]/90 backdrop-blur-xl
        border-r border-white/5
        z-[var(--z-sidebar)]
        py-6
        m-0
      "
      style={{ paddingTop: "56px" }}
    >
      {nav.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href === "/console/dashboard" && pathname === "/console");
        
        const isLocked = item.isLocked;
        
        // Build tooltip text for locked items
        const tooltipText = isLocked && item.module
          ? item.module.unlockMessage || 
            (item.module.readinessGates && item.module.readinessGates.length > 0
              ? `Available when: ${item.module.readinessGates.map(g => g.condition).join(', ')}`
              : 'This capability is currently locked')
          : null;

        const NavContent = (
          <>
            {active && !isLocked && (
              <div className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-[0_0_6px_rgba(140,90,255,0.6)]" />
            )}
            <div className="flex flex-col items-center gap-1 w-24 relative">
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isLocked
                      ? "text-slate-600 opacity-40"
                      : active
                      ? "text-white drop-shadow-[0_0_4px_rgba(180,120,255,0.45)]"
                      : "text-slate-400 group-hover:text-white"
                  )}
                />
                {isLocked && (
                  <Lock className="absolute -top-1 -right-1 h-3 w-3 text-slate-500" />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] leading-tight whitespace-nowrap text-center tracking-wide",
                  isLocked && "opacity-40"
                )}
              >
                {item.name}
              </span>
            </div>
          </>
        );

        // Render locked items as links (they'll show locked preview when accessed)
        if (isLocked) {
          return (
            <Link
              key={item.id || item.href}
              href={item.href}
              className={cn(
                "group relative flex flex-col items-center gap-1 py-3 transition-all duration-200",
                "text-slate-600 cursor-pointer"
              )}
              title={tooltipText || undefined}
            >
              {NavContent}
            </Link>
          );
        }

        // Render unlocked items as links
        return (
          <Link
            key={item.id || item.href}
            href={item.href}
            className={cn(
              "group relative flex flex-col items-center gap-1 py-3 transition-all duration-200",
              active
                ? "text-white"
                : "text-slate-400 group-hover:text-white group-hover:animate-[sage-sidebar-hover_200ms_ease-in-out]"
            )}
          >
            {NavContent}
          </Link>
        );
      })}
    </motion.aside>
  );
}


