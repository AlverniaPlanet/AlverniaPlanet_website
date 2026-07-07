"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// /aplikacje/mars-brief — brief gościa dla MARS: coś pomiędzy aplikacją
// a prezentacją. Przepływ: slajd tytułowy (z muzyką w pętli) -> klik -> film.
// Slajd projektowany pod 1920x1080, kanwa skalowana do ekranu (letterbox).
//
// Sterowanie:
//   - lewy klik / strzałka w prawo / spacja  -> dalej (slajd -> film)
//   - prawy klik / strzałka w lewo           -> wstecz (film -> slajd)
//   - pierwszy klik/klawisz                   -> start prezentacji i dźwięku
//
// Film hostujemy poza repo (unlisted YouTube/Vimeo) i wpinamy przez
// VIDEO_EMBED_URL — nie trzymamy ciężkiego pliku w statycznym buildzie.
// ---------------------------------------------------------------------------

const STAGE_W = 1920;
const STAGE_H = 1080;
const MARS = "247, 120, 40"; // akcent Marsa (#f77828)

// --- Marquee „ZAGRAJ FILM" (dolny pas slajdu 1) ---------------------------
function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const chunk = (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="flex items-center gap-6 pr-6 text-[30px] font-extrabold uppercase leading-none tracking-[0.14em]">
          <span style={{ color: `rgb(${MARS})` }}>ZAGRAJ</span>
          <span className="text-white">FILM</span>
          <span className="text-white">●</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="flex overflow-hidden">
      <div className={`flex ${reverse ? "mb-marq-rev" : "mb-marq"}`}>
        {chunk}
        {chunk}
      </div>
    </div>
  );
}

// --- Slajd 1: dom + „MARS" + marquee --------------------------------------
function Slide1() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* TŁO: PODMIEŃ na docelowy render (teraz zdjęcie z galerii MARS) */}
      <Image
        src="/galeria/Projekt_MARS/webp/MARS_1.webp"
        alt=""
        fill
        priority
        sizes="1920px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/75" />

      {/* Logo */}
      <Image
        src="/Loga/Logo_negatyw.svg"
        alt="Alvernia Planet"
        width={841}
        height={295}
        priority
        className="absolute left-1/2 top-[64px] w-[230px] -translate-x-1/2"
      />

      {/* Tytuł */}
      <h1
        className="absolute left-1/2 top-[560px] -translate-x-1/2 -translate-y-1/2 text-[320px] font-black leading-none tracking-[-0.02em] text-white"
        style={{ textShadow: `0 0 90px rgba(${MARS}, 0.55), 0 8px 40px rgba(0,0,0,0.55)` }}
      >
        MARS
      </h1>

      {/* Podpis pod „MARS" — informacja, że to briefing */}
      <div className="absolute left-1/2 top-[772px] flex -translate-x-1/2 flex-col items-center gap-4">
        <span
          className="block h-px w-[140px]"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${MARS}, 0.85), transparent)` }}
        />
        <span className="text-[27px] font-semibold uppercase tracking-[0.42em] text-white/75">
          Briefing
        </span>
      </div>

      {/* Dolny marquee (dwa rzędy, przeciwne kierunki) */}
      <div className="absolute inset-x-0 bottom-[70px] space-y-1">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </div>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// Film briefingu (unlisted YouTube). enablejsapi=1 pozwala sterować odtwarzaczem
// z naszych przycisków (Odtwórz / Pauza / Od początku) przez postMessage.
const VIDEO_ID = "CdyInqZwopo";
const VIDEO_EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}?enablejsapi=1&autoplay=1&rel=0&modestbranding=1&playsinline=1`;

// 0 = slajd tytułowy (z muzyką), 1 = film. Klik dalej odpala film.
const LAST_INDEX = 1;

export default function MarsBriefPage() {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [ready, setReady] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Panel administracyjny (tylko slajd 1): sterowanie podkładem.
  const [panelOpen, setPanelOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [volume, setVolume] = useState(0.7);

  // Pierwszy gest użytkownika uruchamia prezentację i dźwięk (polityka autoplay).
  const start = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    audioRef.current?.play().catch(() => {});
  }, []);

  // Sterowanie odtwarzaczem YouTube przez postMessage (wymaga enablejsapi=1).
  const ytCommand = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  }, []);

  // Skalowanie kanwy 1920x1080 do ekranu (letterbox), z zapasem na resize.
  useEffect(() => {
    const compute = () =>
      setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    compute();
    setReady(true);
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Muzyka slajdu 1 (pętla): gra na slajdzie 1, o ile włączona w panelu.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (started && index === 0 && musicOn) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [started, index, musicOn]);

  // Głośność podkładu z panelu.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, LAST_INDEX));
    setHintVisible(false);
  }, []);
  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    setHintVisible(false);
  }, []);

  useEffect(() => {
    const NAV_KEYS = ["ArrowRight", "ArrowLeft", " ", "Enter", "PageDown", "PageUp"];
    const onKey = (event: KeyboardEvent) => {
      // Pierwszy gest = start (dźwięk), bez przewijania.
      if (!startedRef.current && NAV_KEYS.includes(event.key)) {
        event.preventDefault();
        start();
        return;
      }
      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        prev();
      } else if (event.key === "Home") {
        setIndex(0);
      } else if (event.key === "End") {
        setIndex(LAST_INDEX);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, start]);

  return (
    <main
      className="fixed inset-0 flex touch-none select-none items-center justify-center overflow-hidden bg-black"
      onClick={() => {
        if (!startedRef.current) {
          start();
          return;
        }
        next();
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        if (!startedRef.current) {
          start();
          return;
        }
        prev();
      }}
    >
      {/* Muzyka slajdu 1 (pętla) */}
      <audio ref={audioRef} src="/aplikacje/mars-brief/Slajd1.mp3" loop preload="auto" />

      {/* Slajd tytułowy — kanwa 1920x1080 skalowana do ekranu */}
      {index === 0 ? (
        <div
          className="relative shrink-0 overflow-hidden bg-black text-white transition-opacity duration-300"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "center",
            opacity: ready ? 1 : 0,
          }}
        >
          <div className="mb-slide absolute inset-0">
            <Slide1 />
          </div>
        </div>
      ) : null}

      {/* Film — osadzony odtwarzacz (unlisted YouTube/Vimeo) */}
      {index === 1 ? (
        <div className="mb-slide absolute inset-0 bg-black">
          {VIDEO_EMBED_URL ? (
            <iframe
              ref={iframeRef}
              src={VIDEO_EMBED_URL}
              title="MARS — film"
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center px-8 text-center">
              <div className="max-w-xl text-white/70">
                <p className="text-lg font-semibold text-white">Tu pojawi się film</p>
                <p className="mt-2 text-sm">
                  Wklej adres osadzenia (unlisted YouTube/Vimeo) do stałej{" "}
                  <code className="rounded bg-white/10 px-1">VIDEO_EMBED_URL</code> w page.tsx.
                </p>
              </div>
            </div>
          )}

          {/* Powrót do slajdu tytułowego */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            className="absolute left-6 top-6 z-30 rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:bg-black/70"
          >
            ← Wstecz
          </button>

          {/* Sterowanie filmem (nasze przyciski; natywne kontrolki YT jako zapas) */}
          <div
            className="absolute left-1/2 top-6 z-30 flex -translate-x-1/2 items-center gap-2"
            onClick={(event) => event.stopPropagation()}
            onContextMenu={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => ytCommand("playVideo")}
              className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur transition hover:bg-black/70 hover:text-white"
            >
              ▶ Odtwórz
            </button>
            <button
              type="button"
              onClick={() => ytCommand("pauseVideo")}
              className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur transition hover:bg-black/70 hover:text-white"
            >
              ⏸ Pauza
            </button>
            <button
              type="button"
              onClick={() => {
                ytCommand("seekTo", [0, true]);
                ytCommand("playVideo");
              }}
              className="rounded-full border border-white/20 bg-black/50 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur transition hover:bg-black/70 hover:text-white"
            >
              ↺ Od początku
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/10 px-5 py-2 text-[13px] text-white/70 backdrop-blur transition-opacity duration-700 ${
          hintVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        Lewy klik / → dalej · Prawy klik / ← wstecz
      </div>

      {/* Panel administracyjny (róg) — tylko slajd 1, po starcie */}
      {started && index === 0 ? (
        <div
          className="absolute right-6 top-6 z-40"
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Panel administracyjny"
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen((value) => !value)}
            className={`flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition ${
              panelOpen
                ? "border-white/40 bg-white/15 text-white"
                : "border-white/20 bg-black/50 text-white/75 hover:bg-black/70 hover:text-white"
            }`}
          >
            <GearIcon className="h-5 w-5" />
          </button>

          {panelOpen ? (
            <div className="mt-3 w-64 rounded-2xl border border-white/15 bg-black/80 p-4 text-white shadow-2xl backdrop-blur-md">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">
                Podkład — slajd 1
              </p>

              <button
                type="button"
                onClick={() => setMusicOn((value) => !value)}
                className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                {musicOn ? "⏸  Zatrzymaj" : "▶  Odtwórz"}
              </button>

              <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                <span>Głośność</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(parseFloat(event.target.value))}
                aria-label="Głośność podkładu"
                className="w-full accent-[#f77828]"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Bramka startu — pierwszy klik uruchamia prezentację i dźwięk */}
      {!started ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-5 text-white">
            <span className="mb-pulse flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/10 text-[24px]">
              ▶
            </span>
            <span className="text-[17px] font-medium tracking-[0.28em] text-white/85">KLIKNIJ, ABY ROZPOCZĄĆ</span>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes mb-slide-in { from { opacity: 0; } to { opacity: 1; } }
        .mb-slide { animation: mb-slide-in 0.45s ease both; }
        @keyframes mb-pulse { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.08); opacity: 1; } }
        .mb-pulse { animation: mb-pulse 1.8s ease-in-out infinite; }
        @keyframes mb-marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mb-marq-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .mb-marq { animation: mb-marq 60s linear infinite; }
        .mb-marq-rev { animation: mb-marq-rev 60s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .mb-slide, .mb-marq, .mb-marq-rev, .mb-pulse { animation: none; }
        }
      `}</style>
    </main>
  );
}
