"use client";

import Card from "@/app/components/Card";
import { motion, type Variants } from "framer-motion";
import { FaPlane, FaTrain, FaCity } from "react-icons/fa";
import { useI18n } from "@/app/i18n-provider";

const MAP_SRC =
  "https://www.google.com/maps?q=Alvernia+Planet,+Nieporaz,+Ferdynanda+Wspania%C5%82ego+1&output=embed";

type Locale = "pl" | "en";
type NearbyItem = { label: string; distance: number; icon: React.ComponentType<{ className?: string }> };

const COPY: Record<
  Locale,
  {
    tag: string;
    title: string;
    subtitle: string;
    nearbyTitle: string;
    mapTitle: string;
    unit: string;
  }
> = {
  pl: {
    tag: "Dojazd",
    title: "Jak dojechać",
    subtitle: "Obiekt zlokalizowany przy autostradzie A4, pomiędzy Krakowem i Katowicami.",
    nearbyTitle: "W pobliżu",
    mapTitle: "Mapa dojazdu – Alvernia Planet",
    unit: "km",
  },
  en: {
    tag: "Getting here",
    title: "How to get here",
    subtitle: "Located by the A4 highway between Kraków and Katowice.",
    nearbyTitle: "Nearby",
    mapTitle: "Directions map – Alvernia Planet",
    unit: "km",
  },
};

const NEARBY: Record<Locale, NearbyItem[]> = {
  pl: [
    { label: "Dworzec kolejowy Krzeszowice", distance: 9, icon: FaTrain },
    { label: "Lotnisko Kraków-Balice", distance: 15, icon: FaPlane },
    { label: "Kraków", distance: 25, icon: FaCity },
    { label: "Katowice", distance: 47, icon: FaCity },
    { label: "Lotnisko Katowice-Pyrzowice", distance: 73, icon: FaPlane },
  ],
  en: [
    { label: "Krzeszowice railway station", distance: 9, icon: FaTrain },
    { label: "Kraków-Balice Airport", distance: 15, icon: FaPlane },
    { label: "Kraków", distance: 25, icon: FaCity },
    { label: "Katowice", distance: 47, icon: FaCity },
    { label: "Katowice-Pyrzowice Airport", distance: 73, icon: FaPlane },
  ],
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

export default function JakDojechacPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const nearby = NEARBY[loc];

  return (
    <main className="relative min-h-screen px-4 py-12">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fade}
        className="max-w-5xl mx-auto space-y-10"
      >
        <header className="text-center space-y-3">
          <motion.p className="text-xs uppercase tracking-[0.35em] text-white/60" variants={fadeUp}>
            {copy.tag}
          </motion.p>
          <motion.h1 className="text-4xl sm:text-5xl font-extrabold" variants={fadeUp}>
            {copy.title}
          </motion.h1>
          <motion.p className="text-white/80 text-lg" variants={fadeUp}>
            {copy.subtitle}
          </motion.p>
        </header>

        <Card variant="solid" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 items-start">
            <motion.div className="space-y-3" variants={fadeUp}>
              <h2 className="text-2xl font-semibold">{copy.nearbyTitle}</h2>
              <div className="h-[1px] w-full bg-white/15" />
              <ul className="space-y-3 text-gray-100">
                {nearby.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3"
                    >
                      <span className="inline-flex items-center gap-3 font-semibold">
                        <Icon className="text-amber-300 h-4 w-4" />
                        {item.label}
                      </span>
                      <span className="text-sm text-white/80">
                        {item.distance} {copy.unit}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40"
              variants={fadeUp}
            >
              <iframe
                title={copy.mapTitle}
                src={MAP_SRC}
                loading="lazy"
                className="w-full h-[320px] border-0"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}
