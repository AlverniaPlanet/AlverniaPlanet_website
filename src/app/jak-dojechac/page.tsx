"use client";

import Card from "@/app/components/Card";
import { motion, type Variants } from "framer-motion";
import { FaPlane, FaTrain, FaCity, FaMapMarkerAlt } from "react-icons/fa";
import { useI18n } from "@/app/i18n-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const MAP_SRC =
  "https://www.google.com/maps?q=Alvernia+Planet,+Nieporaz,+Ferdynanda+Wspania%C5%82ego+1&output=embed";
const DESTINATION = "Alvernia Planet, Ferdynanda Wspaniałego 1, Nieporaz";

type Locale = "pl" | "en";
type NearbyItem = {
  label: string;
  distance: number;
  icon: React.ComponentType<{ className?: string }>;
};

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

const ATTRACTIONS: Record<Locale, NearbyItem[]> = {
  pl: [
    { label: "Zamek Tenczyn", distance: 3, icon: FaMapMarkerAlt },
    { label: "Muzeum Małopolski Zachodniej w Wygiełzowie", distance: 12, icon: FaMapMarkerAlt },
    { label: "Energylandia", distance: 20, icon: FaMapMarkerAlt },
    { label: "Zatorland", distance: 22, icon: FaMapMarkerAlt },
    { label: "Park Gródek", distance: 28, icon: FaMapMarkerAlt },
    { label: "Muzeum Auschwitz-Birkenau", distance: 37, icon: FaMapMarkerAlt },
    { label: "Kopalnia Soli w Wieliczce", distance: 49, icon: FaMapMarkerAlt },

  ],
  en: [
    { label: "Tenczyn Castle", distance: 3, icon: FaMapMarkerAlt },
    { label: "Museum of Western Małopolska (Wygiełzów)", distance: 12, icon: FaMapMarkerAlt },
    { label: "Energylandia", distance: 20, icon: FaMapMarkerAlt },
    { label: "Zatorland", distance: 22, icon: FaMapMarkerAlt },
    { label: "Park Gródek", distance: 28, icon: FaMapMarkerAlt },
    { label: "Auschwitz-Birkenau Museum", distance: 37, icon: FaMapMarkerAlt },
    { label: "Wieliczka Salt Mine", distance: 49, icon: FaMapMarkerAlt },

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

const buildDirectionsEmbed = (origin: string, avoidTolls = false) => {
  const originQ = encodeURIComponent(origin);
  const destQ = encodeURIComponent(DESTINATION);
  const avoidParam = avoidTolls ? "&avoid=tolls" : "";
  const cacheBust = `&_cb=${Date.now()}`;
  // Klasyczny embed kierunku saddr->daddr; avoid=tolls dla wariantu darmowego.
  return `https://www.google.com/maps?output=embed&f=d&source=embed&saddr=${originQ}&daddr=${destQ}${avoidParam}${cacheBust}`;
};

export default function JakDojechacPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const nearby = NEARBY[loc];
  const attractions = ATTRACTIONS[loc];
  const [mapSrc, setMapSrc] = useState<string>(MAP_SRC);
  const [activeOrigin, setActiveOrigin] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"attractions" | "routes">("routes");
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => activeOrigin ?? "", [activeOrigin]);
  const currentList = useMemo(
    () => (activeTab === "routes" ? nearby : attractions),
    [activeTab, nearby, attractions]
  );

  useEffect(() => {
    const el = mapWrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Ustaw domyślną trasę po zmianie zakładki
  useEffect(() => {
    const first = currentList[0];
    if (first) {
      setActiveOrigin(first.label);
      setMapSrc(buildDirectionsEmbed(first.label, false));
      setShouldLoadMap(true);
    }
  }, [activeTab, currentList]);

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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("routes")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                activeTab === "routes"
                  ? "bg-white/15 ring-amber-300/70 text-white"
                  : "bg-white/5 ring-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              Dojazdy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("attractions")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                activeTab === "attractions"
                  ? "bg-white/15 ring-amber-300/70 text-white"
                  : "bg-white/5 ring-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              Atrakcje
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            <motion.div className="space-y-3" variants={fadeUp}>
              <h2 className="text-2xl font-semibold">
                {activeTab === "routes" ? copy.nearbyTitle : "Atrakcje w okolicy"}
              </h2>
              <div className="h-[1px] w-full bg-white/15" />
              <ul className="space-y-3 text-gray-100">
                {currentList.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.label === selectedLabel;
                  return (
                    <li
                      key={item.label}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveOrigin(item.label);
                          setMapSrc(buildDirectionsEmbed(item.label, false));
                          setShouldLoadMap(true);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 ring-1 transition ${
                          isActive
                            ? "bg-white/10 ring-amber-300/70 text-white"
                            : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className="inline-flex items-center gap-3 font-semibold text-left">
                          <Icon className="text-amber-300 h-4 w-4 shrink-0" />
                          {item.label}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-white/80">
                          <span>
                            {item.distance} {copy.unit}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40"
              variants={fadeUp}
              ref={mapWrapperRef}
            >
              {!shouldLoadMap ? (
                <div className="flex h-[320px] items-center justify-center bg-black/50 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={() => setShouldLoadMap(true)}
                    className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
                  >
                    Załaduj mapę
                  </button>
                </div>
              ) : (
                <iframe
                  title={copy.mapTitle}
                  src={mapSrc}
                  loading="lazy"
                  className="w-full h-[320px] border-0"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </motion.div>
          </div>
        </Card>

        <Card variant="solid" className="overflow-hidden p-0">
          <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black">
            <div className="relative w-full h-[260px] sm:h-[340px] md:h-[420px] lg:h-[480px]">
              <Image
                src="/atrakcje.webp"
                alt="Atrakcje w okolicy"
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </Card>

      </motion.div>
    </main>
  );
}
