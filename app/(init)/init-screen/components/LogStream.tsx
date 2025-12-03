"use client";

import { useRef, useEffect, useState } from "react";

function getPrefix(text: string) {
  if (text.includes("Rho²") || text.includes("sovereign")) return "🜁";
  if (text.includes("workspace") || text.includes("Console")) return "🖥️";
  if (text.includes("mapping")) return "🗺️";
  if (text.includes("allocating") || text.includes("resource")) return "🔧";
  if (text.includes("registering")) return "🔐";
  if (text.startsWith("Initializing")) return "⚙️";
  if (text.endsWith("ready ✔")) return "✔️";
  if (text.includes("Resolving dependency")) return "🔗";
  if (text.includes("Linking recommended dependency")) return "🔗";
  if (text.includes("linked")) return "🕸️";
  if (text.includes("Scanning")) return "🔍";
  return "➜";
}

function AnimatedLine({ text }: { text: string }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 12); // typing speed

    return () => clearInterval(interval);
  }, [text]);

  const getTextColor = () => {
    if (text.includes("Rho²")) return "text-purple-300";
    if (text.includes("rotation")) return "text-blue-300";
    if (text.includes("sovereign") || text.includes("cryptographic")) return "text-purple-200";
    return "text-white/80";
  };

  return (
    <div className="mb-1 flex gap-2">
      <span className="text-purple-300">{getPrefix(text)}</span>
      <span className={getTextColor()}>{display}</span>
    </div>
  );
}

export default function LogStream({ logs }: { logs: string[] }) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="p-4 overflow-y-auto h-[calc(80vh-60px)] font-mono text-sm text-white/80 space-y-1">
      {logs.map((line, i) => (
        <AnimatedLine key={i} text={line} />
      ))}
      <div ref={logEndRef} />
    </div>
  );
}

