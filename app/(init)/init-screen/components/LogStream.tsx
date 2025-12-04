"use client";

import { useRef, useEffect, useState } from "react";

function getPrefix(text: string) {
  if (text.includes("HADRA")) return "🜁";
  if (text.includes("AIDR")) return "◇";
  if (text.includes("Warning")) return "⚠️";
  if (text.includes("Notice")) return "ℹ️";
  if (text.includes("Resolved") || text.includes("normalized") || text.includes("successful")) return "✔️";
  if (text.includes("variance") || text.includes("recalibrating")) return "🌀";
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
    if (text.includes("HADRA") || text.includes("AIDR")) return "text-purple-200";
    if (text.includes("Warning")) return "text-yellow-400";
    if (text.includes("Notice")) return "text-blue-300";
    if (text.includes("Resolved") || text.includes("normalized")) return "text-green-400";
    if (text.includes("variance")) return "text-purple-300";
    if (text.includes("Rho²")) return "text-purple-300";
    if (text.includes("rotation")) return "text-blue-300";
    if (text.includes("sovereign") || text.includes("cryptographic")) return "text-purple-200";
    return "text-white/80";
  };

  return (
    <span className={getTextColor()}>{display}</span>
  );
}

export default function LogStream({ logs }: { logs: string[] }) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="h-[420px] overflow-y-auto pr-2 space-y-2 font-mono text-[14px] leading-relaxed text-white/80">
      {logs.map((line, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="text-purple-400">➤</span>
          <AnimatedLine text={line} />
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}

