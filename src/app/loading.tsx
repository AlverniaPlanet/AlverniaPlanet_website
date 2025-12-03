"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme-provider";

export default function Loading() {
  const { theme } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--ap-bg)]">
      {/* Pulsujące logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-40 h-40 mb-6"
      >
        <Image
          src={theme === "light" ? "/logo_AP_grey.png" : "/logo_AP_white.png"}
          alt="Alvernia Planet"
          fill
          className={`object-contain opacity-90 ${theme === "dark" ? "mix-blend-screen" : ""}`}
          priority
        />
      </motion.div>

      {/* Obracająca się poświata */}
      <motion.div
        className="absolute w-60 h-60 rounded-full bg-amber-500/20 blur-3xl"
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
