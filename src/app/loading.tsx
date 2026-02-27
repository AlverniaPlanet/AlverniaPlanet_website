"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme-provider";

export default function Loading() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const logoSrc = isLight ? "/Loga/Logo_pozytyw.svg" : "/Loga/Logo_negatyw.svg";
  const logoFrameClass = `inline-flex items-center justify-center rounded-[28px] px-10 py-3 ${
    isLight ? "bg-white/80 shadow-[0_12px_30px_rgba(23,23,48,0.16)]" : "bg-transparent"
  }`;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--ap-bg)]">
      {/* Pulsujące logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`mb-6 ${logoFrameClass}`}
      >
        <Image
          src={logoSrc}
          alt="Alvernia Planet"
          width={300}
          height={56}
          className="h-[56px] w-auto object-contain object-center opacity-95"
          priority
        />
      </motion.div>

      {/* Obracająca się poświata */}
      <motion.div
        className="absolute w-60 h-60 rounded-full bg-[color:var(--ap-accent-soft)] blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Tekst ładowania */}
      <motion.p
        className="mt-4 text-[color:var(--ap-text)]/80 text-lg tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Ładowanie wszechświata…
      </motion.p>
    </div>
  );
}
