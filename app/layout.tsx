'use client';

import "./styles/global.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useOnboardingStore from "@/lib/store/useOnboardingStore";
import AppShell from "@/components/layout/AppShell";

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    operator,
    registered,
    authenticated,
    setOperator,
    setRegistered,
    setAuthenticated,
  } = useOnboardingStore();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasLoadedStatus, setHasLoadedStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchAuthStatus() {
      try {
        const res = await fetch('/api/auth/status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!isMounted) return;

        if (!res.ok) {
          setRegistered(false);
          setAuthenticated(false);
          setOperator('prime');
          setHasLoadedStatus(true);
          return;
        }

        const data = await res.json();

        if (!isMounted) return;

        setRegistered(data.registered === true);
        setAuthenticated(data.authenticated === true);
        setOperator(data.operator || 'prime');
        setHasLoadedStatus(true);
      } catch {
        if (!isMounted) return;
        setRegistered(false);
        setAuthenticated(false);
        setOperator('prime');
        setHasLoadedStatus(true);
      }
    }

    fetchAuthStatus();

    const handleAuthChange = () => {
      fetchAuthStatus();
    };

    window.addEventListener('auth-status-changed', handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener('auth-status-changed', handleAuthChange);
    };
  }, [setAuthenticated, setOperator, setRegistered]);

  useEffect(() => {
    if (!hasLoadedStatus) return;

    const isOnboardingRoute = pathname.startsWith('/onboarding');
    const isOperatorRoute = pathname.startsWith('/operator');
    const isDashboardRoute = pathname.startsWith('/dashboard');

    // if unregistered → force /register
    if (registered === false) {
      if (pathname !== '/register') {
        setIsRedirecting(true);
        router.replace('/register');
      } else {
        setIsRedirecting(false);
      }
      return;
    }

    // if registered but not authenticated → force /auth
    if (registered && !authenticated) {
      if (pathname !== '/auth') {
        setIsRedirecting(true);
        router.replace('/auth');
      } else {
        setIsRedirecting(false);
      }
      return;
    }

    // if authenticated and on a valid route → allow rendering
    if (registered && authenticated) {
      if (isOnboardingRoute || isOperatorRoute || isDashboardRoute) {
        setIsRedirecting(false);
        return;
      }

      // authenticated but not on any of these → redirect to onboarding/select
      if (pathname !== '/onboarding/select') {
        setIsRedirecting(true);
        router.replace('/onboarding/select');
      } else {
        setIsRedirecting(false);
      }
    }
  }, [registered, authenticated, pathname, router, hasLoadedStatus]);

  const shell = (content: React.ReactNode) => (
    <html lang="en">
      <body className="bg-[#0b0c0f] text-white min-h-screen antialiased">
        <AppShell>{content}</AppShell>
      </body>
    </html>
  );

  // While loading auth status or mid-redirect, render shell without children to avoid flicker/loops
  if (!hasLoadedStatus || isRedirecting) {
    return shell(null);
  }

  // At this point, route is valid for the current auth state
  return shell(children);
}
