"use client";

import { useEffect, useState } from "react";
import {
  EXIT_POINT,
  KOPULY,
  MAP_HEIGHT,
  MAP_SRC,
  MAP_WIDTH,
  ROUTE_SEGMENTS,
} from "./mapData";
import styles from "./MapaContent.module.css";

function toPath(points: ReadonlyArray<readonly [number, number]>) {
  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
}

// Klikalne kopuły: te z trasy zwiedzania + K3 i K4.
const INTERACTIVE = new Set(["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K9", "K11"]);

export default function MapaContent() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = KOPULY.find((k) => k.id === activeId) ?? null;

  // Blokada przewijania tła, gdy otwarte jest okienko, + zamykanie Esc.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const hotspots = KOPULY.filter((k) => INTERACTIVE.has(k.id));

  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <p className={styles.kicker}>Alvernia Planet</p>
        <h1 className={styles.title}>Mapa zwiedzania</h1>
        <p className={styles.lead}>
          Dotknij świecącej kopuły, aby zobaczyć jej opis. Linia pokazuje trasę
          wycieczki, od strefy startowej K5/K6 aż po wyjście między K11 a K4.
        </p>
      </div>

      <div className={styles.stage}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          role="img"
          aria-label="Mapa zwiedzania Alvernia Planet"
        >
          <defs>
            <filter id="mapaGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <image href={MAP_SRC} x={0} y={0} width={MAP_WIDTH} height={MAP_HEIGHT} />

          {/* Trasa zwiedzania */}
          <g filter="url(#mapaGlow)">
            {ROUTE_SEGMENTS.map((seg, i) => (
              <path
                key={i}
                d={toPath(seg)}
                className={styles.routeLine}
                fill="none"
              />
            ))}
          </g>

          {/* Oznaczenie wyjścia */}
          <g className={styles.exit}>
            <circle
              cx={EXIT_POINT[0]}
              cy={EXIT_POINT[1]}
              r={26}
              className={styles.exitDot}
            />
            <text
              x={EXIT_POINT[0]}
              y={EXIT_POINT[1] - 42}
              className={styles.exitText}
              textAnchor="middle"
            >
              WYJŚCIE
            </text>
          </g>

          {/* Klikalne kopuły, pulsujące pierścienie (nazwy są już na mapie) */}
          {hotspots.map((k) => {
            const isActive = k.id === activeId;
            return (
              <g
                key={k.id}
                className={styles.hotspot}
                onClick={() => setActiveId(k.id)}
                role="button"
                tabIndex={0}
                aria-label={`Kopuła ${k.id}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(k.id);
                  }
                }}
              >
                {/* niewidzialna, większa strefa dotyku */}
                <circle cx={k.x} cy={k.y} r={k.r} className={styles.touch} />
                <circle
                  cx={k.x}
                  cy={k.y}
                  r={k.r}
                  className={`${styles.ring} ${isActive ? styles.ringActive : ""}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Okienko z informacją o kopule */}
      {active && (
        <div
          className={styles.overlay}
          onClick={() => setActiveId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.sheetClose}
              onClick={() => setActiveId(null)}
              aria-label="Zamknij"
            >
              ×
            </button>
            <span className={styles.sheetTag}>
              {active.stop != null
                ? `Trasa zwiedzania${active.stopLabel ? ` · ${active.stopLabel}` : ""}`
                : "Kopuła"}
            </span>
            <h2 className={styles.sheetTitle}>{active.title}</h2>
            <p className={styles.sheetDesc}>{active.desc}</p>
          </div>
        </div>
      )}
    </main>
  );
}
