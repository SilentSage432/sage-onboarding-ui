"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConsoleRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/console/dashboard");
  }, [router]);

  return null;
}
