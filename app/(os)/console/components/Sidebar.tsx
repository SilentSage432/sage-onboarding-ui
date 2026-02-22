"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lock, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { moduleRegistry } from "@/lib/console/moduleRegistry";
import { useReadinessStore } from "@/app/(os)/console/store/useReadinessStore";
import { isModuleUnlocked, isModuleVisibleToPerspective } from "@/lib/console/readinessUtils";
import { cn } from "@/lib/utils";

export default function Sidebar({ 
  isOpen = false, 
  onClose 
}: { 
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const readinessState = useReadinessStore();
  const sidebarRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Build nav array with lock state information
  // Filter by perspective first (architect-only modules don't exist for non-architects)
  const visibleModules = moduleRegistry.filter((mod) =>
    isModuleVisibleToPerspective(mod, readinessState.systemPerspective)
  );
  
  // Overview stays at top
  const overviewItem = { 
    name: "Overview", 
    icon: Home, 
    href: "/console/dashboard", 
    id: "overview",
    isLocked: false,
    module: null,
  };

  // Group modules by layer
  const modulesByLayer = visibleModules.reduce((acc, mod) => {
    const isUnlocked = isModuleUnlocked(
      mod, 
      readinessState.unlockedCapabilities,
      readinessState.systemPerspective
    );
    const navItem = {
      name: mod.name,
      icon: mod.icon,
      href: `/console/${mod.slug}`,
      id: mod.slug,
      isLocked: !isUnlocked,
      module: mod,
    };
    
    const layer = mod.layer || 'capability'; // Default to capability if missing
    if (!acc[layer]) {
      acc[layer] = [];
    }
    acc[layer].push(navItem);
    return acc;
  }, {} as Record<string, Array<{ name: string; icon: any; href: string; id: string; isLocked: boolean; module: typeof visibleModules[number] | null }>>);

  // Define layer order
  const layerOrder: Array<'orientation' | 'capability' | 'governance'> = ['orientation', 'capability', 'governance'];

  // Handle ESC key to close drawer
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open (mobile only)
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  // Focus trapping when drawer is open
  useEffect(() => {
    if (!isOpen || !sidebarRef.current) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the drawer
    const firstFocusable = sidebarRef.current.querySelector(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    firstFocusable?.focus();

    // Handle tab trapping
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !sidebarRef.current) return;

      const focusableElements = sidebarRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => {
      document.removeEventListener("keydown", handleTab);
      // Restore focus to previous element when drawer closes
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // Close drawer when clicking a link (mobile + tablet only)
  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  // Render navigation content (shared between desktop and mobile)
  const renderNavContent = (isMobile: boolean = false) => {
    return (
      <>
        {/* Render Overview first */}
        {(() => {
          const item = overviewItem;
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href === "/console/dashboard" && pathname === "/console");
          
          if (isMobile) {
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "group relative flex items-center gap-3 px-4 py-3 transition-all duration-200",
                  active
                    ? "text-white bg-white/5 border-l-2 border-purple-500"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          }

          const NavContent = (
            <>
              {active && (
                <div className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-[0_0_6px_rgba(140,90,255,0.6)]" />
              )}
              <div className="flex flex-col items-center gap-1 w-24 relative">
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      active
                        ? "text-white drop-shadow-[0_0_4px_rgba(180,120,255,0.45)]"
                        : "text-slate-400 group-hover:text-white"
                    )}
                  />
                </div>
                <span className="text-[11px] leading-tight text-center tracking-wide whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            </>
          );

          return (
            <Link
              key={item.id}
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
        })()}

        {/* Render grouped modules with dividers between layers */}
        {layerOrder.map((layer) => {
          const layerItems = modulesByLayer[layer] || [];
          if (layerItems.length === 0) return null;

          // For orientation layer: render ADRAE first (above Arcs), then Arc entries
          const adraeItem = layer === "orientation" ? layerItems.find((i) => i.id === "adrae") : null;
          const arcItems =
            layer === "orientation"
              ? layerItems.filter((i) => i.id !== "adrae")
              : layerItems;
          const orderedItems = adraeItem ? [adraeItem, ...arcItems] : layerItems;

          return (
            <React.Fragment key={layer}>
              {/* Divider between groups */}
              {isMobile ? (
                <div className="px-4 py-2">
                  <div className="h-px bg-white/5" />
                </div>
              ) : (
                <div className="w-12 h-px bg-white/5" />
              )}
              
              {/* Render items in this layer */}
              {orderedItems.map((item) => {
                const Icon = item.icon;
                const isTextOnly = !item.icon;
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

                if (isMobile) {
                  return (
                    <Link
                      key={item.id || item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      title={tooltipText || undefined}
                      className={cn(
                        "group relative flex items-center gap-3 px-4 py-3 transition-all duration-200",
                        isLocked
                          ? "text-slate-600 opacity-60 cursor-not-allowed"
                          : active
                          ? "text-white bg-white/5 border-l-2 border-purple-500"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {!isTextOnly && (
                        <div className="relative flex-shrink-0">
                          <Icon className="h-5 w-5" />
                          {isLocked && (
                            <Lock className="absolute -top-1 -right-1 h-3 w-3 text-slate-500" />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium flex-1">{item.name}</span>
                    </Link>
                  );
                }

                const NavContent = (
                  <>
                    {active && !isLocked && (
                      <div className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-blue-400 to-purple-500 shadow-[0_0_6px_rgba(140,90,255,0.6)]" />
                    )}
                    <div className="flex flex-col items-center gap-1 w-24 relative">
                      {!isTextOnly && (
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
                      )}
                      <span
                        className={cn(
                          "text-[11px] leading-tight text-center tracking-wide",
                          item.name.includes('\n') ? "whitespace-pre-line" : "whitespace-nowrap",
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
            </React.Fragment>
          );
        })}
      </>
    );
  };

  // Desktop sidebar (unchanged behavior)
  const desktopSidebar = (
    <motion.aside
      layout
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        fixed left-0 top-0
        h-screen h-[100dvh] w-20
        flex flex-col items-center
        gap-6
        bg-[#080b11]/90 backdrop-blur-xl
        border-r border-white/5
        z-[var(--z-sidebar)]
        py-6
        m-0
        overflow-y-auto
        overflow-x-hidden
        max-lg:hidden
      "
      style={{
        paddingTop: "56px",
        paddingBottom: "80px",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
      }}
    >
      {renderNavContent(false)}
    </motion.aside>
  );

  // Mobile drawer - rendered via portal to escape stacking contexts
  const mobileDrawerContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay - covers entire viewport, sits above all UI except drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="
              fixed inset-0
              bg-black/60 backdrop-blur-sm
              z-[90]
            "
            aria-hidden="true"
          />

          {/* Drawer - overlays all UI elements including bottom bar, HUD, floating buttons */}
          <motion.aside
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            role="navigation"
            aria-label="Main navigation"
            className="
              fixed left-0 top-0
              h-screen h-[100dvh] w-64
              flex flex-col
              bg-[#080b11]/95 backdrop-blur-xl
              border-r border-white/10
              z-[100]
              overflow-y-auto
              overflow-x-hidden
            "
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
            }}
          >
            {/* Mobile header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-sm font-medium text-white">Navigation</span>
              <button
                onClick={onClose}
                aria-label="Close navigation menu"
                className="
                  p-2
                  rounded-lg
                  text-slate-300
                  hover:text-white
                  hover:bg-white/5
                  transition-colors
                  touch-manipulation
                  min-h-[44px] min-w-[44px]
                  flex items-center justify-center
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation content */}
            <div className="flex-1 py-4">
              {renderNavContent(true)}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  // Render drawer via portal at document root to escape stacking contexts
  const mobileDrawer = mounted && typeof document !== 'undefined'
    ? createPortal(mobileDrawerContent, document.body)
    : null;

  return (
    <>
      {desktopSidebar}
      {mobileDrawer}
    </>
  );
}
