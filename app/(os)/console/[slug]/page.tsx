"use client";

import { use } from "react";
import PanelLoader from "../components/PanelLoader";

export default function ConsolePanelPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  // In Next.js 16+, params is a Promise that must be unwrapped with React.use()
  const { slug } = use(params);
  
  return <PanelLoader slug={slug} />;
}


