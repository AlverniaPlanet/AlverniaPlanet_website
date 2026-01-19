"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme-provider";

export default function Loading() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const logoFrameClass = `inline-flex items-center justify-center rounded-[28px] bg-white px-12 py-3 ring-0 ${
    isLight
      ? "shadow-[0_12px_30px_rgba(15,23,42,0.16)]"
      : "shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
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
          src="/logo_alvernia_planet_RGB_crop.jpg"
          alt="Alvernia Planet"
          width={300}
          height={52}
          className="h-[56px] w-auto object-contain object-center opacity-95"
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
