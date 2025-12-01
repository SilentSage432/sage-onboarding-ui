'use client';

import './styles/global.css';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthStatus {
  registered: boolean;
  authenticated: boolean;
  operator: string;
}

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
          setStatus({
            registered: false,
            authenticated: false,
            operator: 'prime',
          });
          return;
        }

        const data = await res.json();

        if (!isMounted) return;

        setStatus({
          registered: data.registered === true,
          authenticated: data.authenticated === true,
          operator: data.operator || 'prime',
        });
      } catch {
        if (!isMounted) return;
        setStatus({
          registered: false,
          authenticated: false,
          operator: 'prime',
        });
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
  }, []);

  useEffect(() => {
    if (!status) return;

    const isOnboardingRoute = pathname.startsWith('/onboarding');
    const isOperatorRoute = pathname.startsWith('/operator');
    const isDashboardRoute = pathname.startsWith('/dashboard');

    // if unregistered → force /register
    if (status.registered === false) {
      if (pathname !== '/register') {
        setIsRedirecting(true);
        router.replace('/register');
      } else {
        setIsRedirecting(false);
      }
      return;
    }

    // if registered but not authenticated → force /auth
    if (status.registered && !status.authenticated) {
      if (pathname !== '/auth') {
        setIsRedirecting(true);
        router.replace('/auth');
      } else {
        setIsRedirecting(false);
      }
      return;
    }

    // if authenticated and on a valid route → allow rendering
    if (status.registered && status.authenticated) {
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
  }, [status, pathname, router]);

  const shell = (content: React.ReactNode) => (
    <html lang="en">
      <body className="bg-[#0b0c0f] text-white min-h-screen antialiased">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Temporary nav placeholder */}
          <header className="mb-10 text-xl font-semibold tracking-wide">
            SAGE Onboarding
          </header>
          {content}
        </div>
      </body>
    </html>
  );

  // While loading auth status or mid-redirect, render shell without children to avoid flicker/loops
  if (!status || isRedirecting) {
    return shell(null);
  }

  // At this point, route is valid for the current auth state
  return shell(children);
}
