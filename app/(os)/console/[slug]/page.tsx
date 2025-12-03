"use client";

import PanelLoader from "../components/PanelLoader";

export default function ConsolePanelPage({ params }: { params: { slug: string } }) {
  return <PanelLoader slug={params.slug} />;
}


