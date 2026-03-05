"use client";

import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { motion, type Variants } from "framer-motion";
import { FaPlane, FaTrain, FaCity, FaMapMarkerAlt, FaBus } from "react-icons/fa";
import { useI18n } from "@/app/i18n-provider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

const MAP_SRC =
  "https://www.google.com/maps?q=Alvernia+Planet,+Nieporaz,+Ferdynanda+Wspania%C5%82ego+1&output=embed";
const DESTINATION = "Alvernia Planet, Ferdynanda Wspaniałego 1, Nieporaz";

type Locale = "pl" | "en" | "pt";
type NearbyItem = {
  label: string;
  distance: number;
  icon: React.ComponentType<{ className?: string }>;
};

type BusRoute = {
  origin: string;
  heading: string;
  from: string;
  stop: string;
  schedule: string;
  scheduleUrl?: string;
};

const COPY: Record<
  Locale,
  {
    tag: string;
    title: string;
    subtitle: string;
    nearbyTitle: string;
    attractionsTitle: string;
    tabRoutes: string;
    tabBuses: string;
    tabAttractions: string;
    loadMap: string;
    mapTitle: string;
    attractionsCaption: string;
    busesTitle: string;
    busesSubtitle: string;
    busFromLabel: string;
    busStopLabel: string;
    busScheduleLabel: string;
    busScheduleLink: string;
    unit: string;
  }
> = {
  pl: {
    tag: "Dojazd",
    title: "Jak dojechać",
    subtitle: "Obiekt zlokalizowany przy autostradzie A4, pomiędzy Krakowem i Katowicami.",
    nearbyTitle: "W pobliżu",
    attractionsTitle: "Atrakcje w okolicy",
    tabRoutes: "Dojazdy",
    tabBuses: "Busy",
    tabAttractions: "Atrakcje",
    loadMap: "Załaduj mapę",
    mapTitle: "Mapa dojazdu – Alvernia Planet",
    attractionsCaption: "Atrakcje w okolicy • mapa orientacyjna",
    busesTitle: "Busy dojazdowe",
    busesSubtitle: "Połączenia z okolicznych dworców kolejowych.",
    busFromLabel: "Skąd:",
    busStopLabel: "Najbliższy przystanek:",
    busScheduleLabel: "Rozkład:",
    busScheduleLink: "Zobacz rozkład",
    unit: "km",
  },
  en: {
    tag: "Getting here",
    title: "How to get here",
    subtitle: "Located by the A4 highway between Kraków and Katowice.",
    nearbyTitle: "Nearby",
    attractionsTitle: "Attractions nearby",
    tabRoutes: "Routes",
    tabBuses: "Buses",
    tabAttractions: "Attractions",
    loadMap: "Load map",
    mapTitle: "Directions map – Alvernia Planet",
    attractionsCaption: "Nearby attractions • overview map",
    busesTitle: "Shuttle buses",
    busesSubtitle: "Connections from nearby railway stations.",
    busFromLabel: "From:",
    busStopLabel: "Nearest stop:",
    busScheduleLabel: "Timetable:",
    busScheduleLink: "View timetable",
    unit: "km",
  },
  pt: {
    tag: "Como chegar",
    title: "Como chegar",
    subtitle: "Localizado junto à autoestrada A4, entre Cracóvia e Katowice.",
    nearbyTitle: "Nas proximidades",
    attractionsTitle: "Atrações nas proximidades",
    tabRoutes: "Rotas",
    tabBuses: "Autocarros",
    tabAttractions: "Atrações",
    loadMap: "Carregar mapa",
    mapTitle: "Mapa de acesso – Alvernia Planet",
    attractionsCaption: "Atrações nas proximidades • mapa geral",
    busesTitle: "Autocarros de ligação",
    busesSubtitle: "Ligações a partir de estações ferroviárias próximas.",
    busFromLabel: "Origem:",
    busStopLabel: "Paragem mais próxima:",
    busScheduleLabel: "Horário:",
    busScheduleLink: "Ver horários",
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
  pt: [
    { label: "Estação ferroviária de Krzeszowice", distance: 9, icon: FaTrain },
    { label: "Aeroporto de Cracóvia-Balice", distance: 15, icon: FaPlane },
    { label: "Cracóvia", distance: 25, icon: FaCity },
    { label: "Katowice", distance: 47, icon: FaCity },
    { label: "Aeroporto de Katowice-Pyrzowice", distance: 73, icon: FaPlane },
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
  pt: [
    { label: "Castelo de Tenczyn", distance: 3, icon: FaMapMarkerAlt },
    { label: "Museu da Pequena Polónia Ocidental (Wygiełzów)", distance: 12, icon: FaMapMarkerAlt },
    { label: "Energylandia", distance: 20, icon: FaMapMarkerAlt },
    { label: "Zatorland", distance: 22, icon: FaMapMarkerAlt },
    { label: "Parque Gródek", distance: 28, icon: FaMapMarkerAlt },
    { label: "Museu de Auschwitz-Birkenau", distance: 37, icon: FaMapMarkerAlt },
    { label: "Mina de Sal de Wieliczka", distance: 49, icon: FaMapMarkerAlt },

  ],
};

const BUS_ROUTES: Record<Locale, BusRoute[]> = {
  pl: [
    {
      origin: "Trzebinia PKP",
      heading: "M-Bus: Trzebinia PKP → Alwernia",
      from: "Trzebinia – PKP",
      stop: "Alwernia – Szkoła / Alwernia – Spalona",
      schedule:
        "Aktualny rozkład na stronie przewoźnika M-Bus.",
      scheduleUrl: "https://www.matysikserwis.pl/m-bus/",
    },
    {
      origin: "Krzeszowice Dworzec Komunikacyjny",
      heading: "MAGOMA: Krzeszowice → Alwernia",
      from: "Krzeszowice – Dworzec Komunikacyjny",
      stop: "Nieporaz (na trasie) / Alwernia – Szkoła",
      schedule:
        "Aktualny rozkład na stronie Gminy Alwernia.",
      scheduleUrl:
        "https://www.alwernia.pl/mieszkaniec/kominukacja-w-gminie-alwernia/rozklady-jazdy-do-krzeszowic.html",
    },
  ],
  en: [
    {
      origin: "Trzebinia PKP",
      heading: "M-Bus: Trzebinia PKP → Alwernia",
      from: "Trzebinia – PKP",
      stop: "Alwernia – School / Alwernia – Spalona",
      schedule:
        "Current timetable on the M-Bus carrier website.",
      scheduleUrl: "https://www.matysikserwis.pl/m-bus/",
    },
    {
      origin: "Krzeszowice Dworzec Komunikacyjny",
      heading: "MAGOMA: Krzeszowice → Alwernia",
      from: "Krzeszowice – Dworzec Komunikacyjny (bus station)",
      stop: "Nieporaz (on route) / Alwernia – School",
      schedule:
        "Current timetable on the Municipality of Alwernia website.",
      scheduleUrl:
        "https://www.alwernia.pl/mieszkaniec/kominukacja-w-gminie-alwernia/rozklady-jazdy-do-krzeszowic.html",
    },
  ],
  pt: [
    {
      origin: "Trzebinia PKP",
      heading: "M-Bus: Trzebinia PKP → Alwernia",
      from: "Trzebinia – PKP",
      stop: "Alwernia – Escola / Alwernia – Spalona",
      schedule:
        "Horário atualizado no site do operador M-Bus.",
      scheduleUrl: "https://www.matysikserwis.pl/m-bus/",
    },
    {
      origin: "Krzeszowice Dworzec Komunikacyjny",
      heading: "MAGOMA: Krzeszowice → Alwernia",
      from: "Krzeszowice – Dworzec Komunikacyjny (terminal de autocarros)",
      stop: "Nieporaz (no trajeto) / Alwernia – Escola",
      schedule:
        "Horário atualizado no site da Câmara de Alwernia.",
      scheduleUrl:
        "https://www.alwernia.pl/mieszkaniec/kominukacja-w-gminie-alwernia/rozklady-jazdy-do-krzeszowic.html",
    },
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
  const buses = BUS_ROUTES[loc];
  const [mapSrc, setMapSrc] = useState<string>(MAP_SRC);
  const [activeOrigin, setActiveOrigin] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"attractions" | "routes" | "buses">("routes");
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOrigin = useMemo(() => activeOrigin ?? "", [activeOrigin]);
  const isBusesTab = activeTab === "buses";
  const mapHeightClass = isBusesTab ? "h-[300px]" : "h-[320px]";
  const currentList = useMemo(
    () => (activeTab === "routes" ? nearby : activeTab === "attractions" ? attractions : []),
    [activeTab, nearby, attractions]
  );
  const mapOrigins = useMemo(() => {
    if (activeTab === "routes") return nearby.map((item) => item.label);
    if (activeTab === "attractions") return attractions.map((item) => item.label);
    return buses.map((route) => route.origin);
  }, [activeTab, nearby, attractions, buses]);

  const setOrigin = useCallback((origin: string) => {
    setActiveOrigin(origin);
    setMapSrc(buildDirectionsEmbed(origin, false));
    setShouldLoadMap(true);
  }, []);

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
    const first = mapOrigins[0];
    if (first) setOrigin(first);
  }, [activeTab, mapOrigins, setOrigin]);

  return (
    <main className="relative min-h-screen px-4 py-12 sm:py-16 ap-page-intro-stagger">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fade}
        className="ap-shell ap-page-stack"
      >
        <header className="text-center space-y-5">
          <motion.p className="ap-type-kicker" variants={fadeUp}>
            {copy.tag}
          </motion.p>
          <motion.h1 className="ap-type-hero-title" variants={fadeUp}>
            {copy.title}
          </motion.h1>
          <motion.p className="ap-type-hero-subtitle max-w-5xl mx-auto" variants={fadeUp}>
            {copy.subtitle}
          </motion.p>
          <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <Card variant="solid" className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("routes")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                activeTab === "routes"
                  ? "bg-white/15 ring-[color:var(--ap-accent)] text-white"
                  : "bg-white/5 ring-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              {copy.tabRoutes}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("buses")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                activeTab === "buses"
                  ? "bg-white/15 ring-[color:var(--ap-accent)] text-white"
                  : "bg-white/5 ring-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              {copy.tabBuses}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("attractions")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                activeTab === "attractions"
                  ? "bg-white/15 ring-[color:var(--ap-accent)] text-white"
                  : "bg-white/5 ring-white/10 text-white/80 hover:bg-white/10"
              }`}
            >
              {copy.tabAttractions}
            </button>
          </div>

          <div
            className={`mt-3 sm:mt-4 grid gap-6 items-start ${
              isBusesTab ? "lg:grid-cols-[1.35fr_0.85fr]" : "md:grid-cols-2"
            }`}
          >
            <motion.div className="space-y-3" variants={fadeUp}>
              {activeTab === "buses" ? (
                <>
                  <h2 className="text-2xl font-semibold">{copy.busesTitle}</h2>
                  <p className="text-white/70 text-sm">{copy.busesSubtitle}</p>
                  <div className="h-[1px] w-full bg-white/15" />
                  <ul className="space-y-3 text-gray-100">
                    {buses.map((route) => {
                      const isActive = route.origin === selectedOrigin;
                      return (
                        <li key={route.heading}>
                          <button
                            type="button"
                            onClick={() => setOrigin(route.origin)}
                            className={`w-full rounded-2xl px-4 py-3 text-left ring-1 transition ${
                              isActive
                                ? "bg-white/10 ring-[color:var(--ap-accent)] text-white"
                                : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                            }`}
                            aria-pressed={isActive}
                          >
                            <span className="inline-flex items-center gap-3 font-semibold">
                              <FaBus className="text-[color:var(--ap-accent)] h-4 w-4 shrink-0" />
                              {route.heading}
                            </span>
                            <span className="mt-2 block text-sm text-white/75 space-y-1">
                              <span className="block">
                                <span className="text-white/60">{copy.busFromLabel}</span> {route.from}
                              </span>
                              <span className="block">
                                <span className="text-white/60">{copy.busStopLabel}</span> {route.stop}
                              </span>
                              <span className="block">
                                <span className="text-white/60">{copy.busScheduleLabel}</span>{" "}
                                {route.schedule}
                              </span>
                              {route.scheduleUrl ? (
                                <span className="block pt-2">
                                  <PrimaryButton
                                    href={route.scheduleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="sm"
                                    className="text-white"
                                  >
                                    {copy.busScheduleLink}
                                  </PrimaryButton>
                                </span>
                              ) : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">
                    {activeTab === "routes" ? copy.nearbyTitle : copy.attractionsTitle}
                  </h2>
                  <div className="h-[1px] w-full bg-white/15" />
                  <ul className="space-y-3 text-gray-100">
                    {currentList.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.label === selectedOrigin;
                      return (
                        <li key={item.label}>
                          <button
                            type="button"
                            onClick={() => setOrigin(item.label)}
                            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 ring-1 transition ${
                              isActive
                                ? "bg-white/10 ring-[color:var(--ap-accent)] text-white"
                                : "bg-white/5 ring-white/10 hover:bg-white/10 hover:ring-white/20"
                            }`}
                            aria-pressed={isActive}
                          >
                            <span className="inline-flex items-center gap-3 font-semibold text-left">
                              <Icon className="text-[color:var(--ap-accent)] h-4 w-4 shrink-0" />
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
                </>
              )}
            </motion.div>

            <motion.div
              className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black/40"
              variants={fadeUp}
              ref={mapWrapperRef}
            >
              {!shouldLoadMap ? (
                <div className={`flex ${mapHeightClass} items-center justify-center bg-black/50 backdrop-blur-[2px]`}>
                  <button
                    type="button"
                    onClick={() => setShouldLoadMap(true)}
                    className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ap-accent)]"
                  >
                    {copy.loadMap}
                  </button>
                </div>
              ) : (
                <iframe
                  title={copy.mapTitle}
                  src={mapSrc}
                  loading="lazy"
                  className={`w-full ${mapHeightClass} border-0`}
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </motion.div>
          </div>
        </Card>

        <Card variant="solid" className="overflow-hidden p-0">
          <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black">
            <div className="relative w-full h-[280px] sm:h-[360px] md:h-auto md:aspect-[16/9]">
              <Image
                src="/atrakcje.webp"
                alt="Atrakcje w okolicy"
                fill
                sizes="100vw"
                className="object-contain object-center"
                priority={false}
              />
            </div>
          </div>
          <p className="px-6 py-4 text-center text-xs uppercase tracking-[0.28em] text-white/60">
            {copy.attractionsCaption}
          </p>
        </Card>

      </motion.div>
    </main>
  );
}
