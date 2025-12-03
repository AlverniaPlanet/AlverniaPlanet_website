"use client";

import { useEffect, useRef } from "react";

type Props = {
  pluginId: string;
  containerId?: string;
  type?: "inline" | "sticky" | string;
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | string;
  lang?: string;
  pluginCss?: boolean;
  className?: string;
};

declare global {
  interface Window {
    bookero_config?: Record<string, unknown>;
  }
}

const SCRIPT_ID = "bookero-plugin-script";
const SCRIPT_SRC = "https://cdn.bookero.pl/plugin/v2/js/bookero-compiled.js";

export default function BookeroEmbed({
  pluginId,
  containerId = "bookero",
  type = "inline",
  position,
  lang = "pl",
  pluginCss = true,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ustaw konfigurację przed wstrzyknięciem skryptu
    const config: Record<string, unknown> = {
      id: pluginId,
      container: containerId,
      type,
      plugin_css: pluginCss,
      lang,
    };
    if (position) config.position = position;
    window.bookero_config = config;

    // Nadaj id kontenerowi, jeśli nie ma
    if (containerRef.current && !containerRef.current.id) {
      containerRef.current.id = containerId;
    }

    // Dołóż skrypt tylko raz
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.src = SCRIPT_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
  }, [pluginId, containerId, type, position, lang, pluginCss]);

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={className ?? "w-full min-h-[640px] rounded-2xl bg-white/5 ring-1 ring-white/10"}
    />
  );
}
