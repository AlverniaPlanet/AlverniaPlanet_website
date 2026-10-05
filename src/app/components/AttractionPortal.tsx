"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SolarIcon } from "@/app/components/SolarIcon";

/**
 * Portal (łuk) atrakcji — ten sam element, który jest w sekcji „Bilety" na
 * stronie głównej, wydzielony tak, żeby dał się użyć też na podstronach.
 *
 * Wideo ładuje się LENIWIE (IntersectionObserver, ~350 KB na portal), do tego
 * czasu widać poster. Bez tego trzy portale na podstronie ciągnęłyby ponad
 * megabajt przy pierwszym wejściu.
 */

type Atrakcja = "kino360" | "mars" | "filmworld";

const PORTALE: Record<Atrakcja, { kolor: string; mp4: string; webm: string; poster: string; ikona: ReactNode }> = {
  kino360: {
    kolor: "#ff7092",
    mp4: "/home/Bilet/kino360.mp4",
    webm: "/home/Bilet/kino360.webm",
    poster: "/home/Bilet/kino360.poster.webp",
    ikona: <SolarIcon name="clapperboard" />,
  },
  mars: {
    kolor: "#ff843d",
    mp4: "/home/Bilet/mars.mp4",
    webm: "/home/Bilet/mars.webm",
    poster: "/home/Bilet/mars.poster.webp",
    ikona: <SolarIcon name="rocket" />,
  },
  filmworld: {
    kolor: "#56ddea",
    mp4: "/home/Bilet/filmworld.mp4",
    webm: "/home/Bilet/filmworld.webm",
    poster: "/home/Bilet/filmworld.poster.webp",
    ikona: <SolarIcon name="videocamera" />,
  },
};

function PortalVideo({ mp4, webm, poster }: { mp4: string; webm: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Źródła dochodzą po zmianie stanu — bez load() wideo ich nie podłączy.
    if (load) ref.current?.load();
  }, [load]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full bg-[#070a16] object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      /* Plakat dopiero po wejściu w viewport, razem ze źródłami.
         Atrybut `poster` NIE podlega leniwemu ładowaniu — przeglądarka pobiera
         go natychmiast, nawet gdy <source> są odroczone. Trzy takie kafelki leżą
         3–5 ekranów niżej, a mimo to zabierały 99 KB z łącza dokładnie wtedy,
         gdy walczy o nie plakat hero. Ciemne tło niżej zakrywa pustkę do czasu
         wczytania. */
      poster={load ? poster : undefined}
      aria-hidden="true"
    >
      {load ? (
        <>
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </>
      ) : null}
    </video>
  );
}

export function AttractionPortal({
  attraction,
  className = "",
}: {
  attraction: Atrakcja;
  className?: string;
}) {
  const p = PORTALE[attraction];
  return (
    <div
      aria-hidden="true"
      className={`relative block w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: "4 / 5",
        borderRadius: "48% 48% 48% 48% / 34% 34% 34% 34%",
        boxShadow: `inset 0 0 0 2px ${p.kolor}, 0 0 34px ${p.kolor}44`,
      }}
    >
      <PortalVideo mp4={p.mp4} webm={p.webm} poster={p.poster} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(7,10,22,0.9) 3%, rgba(7,10,22,0.15) 42%, transparent 62%), radial-gradient(115% 75% at 50% 0%, ${p.kolor}26, transparent 62%)`,
        }}
      />
      <span
        className="absolute bottom-3.5 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center text-2xl"
        style={{ color: p.kolor, filter: `drop-shadow(0 0 7px ${p.kolor}99)` }}
      >
        <span
          className="absolute inset-0"
          style={{
            backgroundColor: "currentColor",
            WebkitMask: "url(/wspolne/ikony/frame.svg) center / contain no-repeat",
            mask: "url(/wspolne/ikony/frame.svg) center / contain no-repeat",
          }}
        />
        {p.ikona}
      </span>
    </div>
  );
}
