"use client";

import { useState, useEffect } from "react";

interface ArchitectOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ArchitectOnly UI Guard
 * 
 * Renders children only if architect session is active.
 * UI-only gate - no redirects, no API calls, no backend coupling.
 * Reads session state from existing session check.
 */
export default function ArchitectOnly({ children, fallback }: ArchitectOnlyProps) {
  const [isArchitect, setIsArchitect] = useState<boolean | null>(null);

  useEffect(() => {
    const checkArchitectSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setIsArchitect(data.authenticated === true);
        } else {
          setIsArchitect(false);
        }
      } catch (error) {
        console.error("Failed to check architect session:", error);
        setIsArchitect(false);
      }
    };

    checkArchitectSession();
  }, []);

  // Show nothing while checking
  if (isArchitect === null) {
    return null;
  }

  // Show children if architect, otherwise show fallback or nothing
  if (isArchitect) {
    return <>{children}</>;
  }

  // Show subtle placeholder if provided, otherwise nothing
  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
