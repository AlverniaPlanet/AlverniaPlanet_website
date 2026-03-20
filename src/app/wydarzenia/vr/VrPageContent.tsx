"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import {
  DOME_VR_SCENES_BY_KEY,
  VR_DOME_ORDER,
  VR_DOME_TITLES,
  VR_UI,
  type VrDomeKey,
} from "./vrData";

function isVrDomeKey(value: string | null): value is VrDomeKey {
  return Boolean(value && VR_DOME_ORDER.includes(value as VrDomeKey));
}

export default function VrPageContent() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const ui = VR_UI[loc];
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedDome = searchParams.get("dome");
  const initialDome: VrDomeKey = isVrDomeKey(requestedDome) ? requestedDome : "k1";
  const [activeDome, setActiveDome] = useState<VrDomeKey>(initialDome);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [yaw, setYaw] = useState(DOME_VR_SCENES_BY_KEY[initialDome][0]?.initialYaw ?? 50);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ pointerId: number | null; startX: number; startYaw: number }>({
    pointerId: null,
    startX: 0,
    startYaw: 50,
  });

  const scenes = useMemo(() => DOME_VR_SCENES_BY_KEY[activeDome] ?? [], [activeDome]);
  const activeScene = scenes[sceneIndex] ?? scenes[0];
  const eventsHref = getLocalizedPath("/wydarzenia", loc);
  const pageBaseHref = getLocalizedPath("/wydarzenia/vr", loc);

  useEffect(() => {
    if (!isVrDomeKey(requestedDome)) {
      return;
    }

    setActiveDome((current) => (current === requestedDome ? current : requestedDome));
    setSceneIndex(0);
  }, [requestedDome]);

  useEffect(() => {
    setSceneIndex(0);
    setYaw(DOME_VR_SCENES_BY_KEY[activeDome][0]?.initialYaw ?? 50);
  }, [activeDome]);

  useEffect(() => {
    const currentDome = searchParams.get("dome");

    if (currentDome === activeDome) {
      return;
    }

    router.replace(`${pageBaseHref}?dome=${activeDome}`, { scroll: false });
  }, [activeDome, pageBaseHref, router, searchParams]);

  useEffect(() => {
    setYaw(activeScene?.initialYaw ?? 50);
  }, [activeScene]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight" && scenes.length > 1) {
        setSceneIndex((current) => (current + 1) % scenes.length);
      }
      if (event.key === "ArrowLeft" && scenes.length > 1) {
        setSceneIndex((current) => (current - 1 + scenes.length) % scenes.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scenes.length]);

  const wrapPercent = (value: number) => {
    const wrapped = value % 100;
    return wrapped < 0 ? wrapped + 100 : wrapped;
  };

  const previousScene = () => setSceneIndex((current) => (current - 1 + scenes.length) % scenes.length);
  const nextScene = () => setSceneIndex((current) => (current + 1) % scenes.length);

  return (
    <main className="relative min-h-screen px-4 py-16 text-white sm:py-20">
      <div className="ap-shell space-y-8">
        <ScrollMotionItem strength="soft" delay={40} className="ap-deferred-section">
          <header className="space-y-5 text-center">
            <p className="ap-type-kicker">{ui.pageKicker}</p>
            <h1 className="ap-type-hero-title">{ui.pageTitle}</h1>
            <p className="ap-type-hero-subtitle mx-auto max-w-4xl">{ui.pageIntro}</p>
            <div className="flex justify-center">
              <PrimaryButton href={eventsHref}>{ui.backToEvents}</PrimaryButton>
            </div>
          </header>
        </ScrollMotionItem>

        <ScrollMotionItem strength="strong" delay={80} className="ap-deferred-section">
          <Card variant="solid" motion="off" className="overflow-hidden">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {VR_DOME_ORDER.map((domeKey) => {
                  const isActive = domeKey === activeDome;

                  return (
                    <button
                      key={domeKey}
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                        isActive
                          ? "border-[#7ef6ff]/72 bg-[#09192f] text-white"
                          : "border-white/12 bg-white/[0.03] text-white/72 hover:border-[#7ef6ff]/44 hover:text-white"
                      }`}
                      onClick={() => {
                        setActiveDome(domeKey);
                        setSceneIndex(0);
                      }}
                    >
                      {VR_DOME_TITLES[loc][domeKey]}
                    </button>
                  );
                })}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/52">
                  {ui.catalogLabel}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {VR_DOME_TITLES[loc][activeDome]}
                </h2>
                <p className="mt-3 text-base text-white/72">{ui.hint}</p>
              </div>

              {activeScene ? (
                <>
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.42)]">
                    <div
                      key={activeScene.id}
                      ref={viewportRef}
                      className={`relative aspect-[16/9] overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                      onPointerDown={(event) => {
                        dragRef.current = {
                          pointerId: event.pointerId,
                          startX: event.clientX,
                          startYaw: yaw,
                        };
                        setIsDragging(true);
                        event.currentTarget.setPointerCapture(event.pointerId);
                      }}
                      onPointerMove={(event) => {
                        const rect = viewportRef.current?.getBoundingClientRect();
                        if (!rect || rect.width <= 0) {
                          return;
                        }

                        if (!isDragging || dragRef.current.pointerId !== event.pointerId) {
                          return;
                        }

                        const deltaX = event.clientX - dragRef.current.startX;
                        const deltaYaw = (deltaX / rect.width) * 100;
                        setYaw(wrapPercent(dragRef.current.startYaw - deltaYaw));
                      }}
                      onPointerUp={(event) => {
                        if (dragRef.current.pointerId === event.pointerId) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                          dragRef.current.pointerId = null;
                          setIsDragging(false);
                        }
                      }}
                      onPointerCancel={() => {
                        dragRef.current.pointerId = null;
                        setIsDragging(false);
                      }}
                      onPointerLeave={() => {
                        if (!isDragging) {
                          return;
                        }
                        dragRef.current.pointerId = null;
                        setIsDragging(false);
                      }}
                      style={{ touchAction: "none" }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url("${encodeURI(activeScene.src)}")`,
                          backgroundRepeat: "repeat-x",
                          backgroundSize: "auto 200%",
                          backgroundPosition: `${yaw}% 0%`,
                          backgroundColor: "#02040c",
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_58%,rgba(2,6,18,0.2)_74%,rgba(2,6,18,0.58)_100%)]" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/58 via-transparent to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {scenes.length > 1 ? (
                      <>
                        <button
                          type="button"
                          aria-label={ui.previousLabel}
                          onClick={previousScene}
                          className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/35 text-2xl text-white/88 transition duration-300 hover:border-[#7ef6ff]/56 hover:bg-black/55"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label={ui.nextLabel}
                          onClick={nextScene}
                          className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/14 bg-black/35 text-2xl text-white/88 transition duration-300 hover:border-[#7ef6ff]/56 hover:bg-black/55"
                        >
                          ›
                        </button>
                      </>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-white/62">
                      {ui.scenesLabel}
                    </p>
                    <p className="text-sm text-white/52">
                      {sceneIndex + 1} / {scenes.length}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {scenes.map((scene, index) => {
                      const isActive = index === sceneIndex;

                      return (
                        <button
                          key={scene.id}
                          type="button"
                          className={`rounded-full border px-3 py-2 text-sm font-medium transition duration-300 ${
                            isActive
                              ? "border-[#7ef6ff]/72 bg-[#09192f] text-white"
                              : "border-white/12 bg-white/[0.03] text-white/72 hover:border-[#7ef6ff]/44 hover:text-white"
                          }`}
                          onClick={() => setSceneIndex(index)}
                        >
                          {scene.title}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 text-center text-white/68">
                  {ui.emptyLabel}
                </div>
              )}

              <div className="flex justify-center">
                <Link
                  href={`${pageBaseHref}?dome=${activeDome}`}
                  className="text-sm text-white/42 transition-colors duration-300 hover:text-white/68"
                >
                  {pageBaseHref}?dome={activeDome}
                </Link>
              </div>
            </div>
          </Card>
        </ScrollMotionItem>
      </div>
    </main>
  );
}
