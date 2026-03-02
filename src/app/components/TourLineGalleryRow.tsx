"use client";

import { useEffect, useRef } from "react";
import Card from "@/app/components/Card";
import Image from "next/image";

type Item = {
  title: string;
  body: string;
  image: string;
};

type Props = {
  items: Item[];
};

export default function TourLineGalleryRow({ items }: Props) {
  const loopItems = [...items, ...items];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let frameId: number | null = null;
    let halfWidth = 0;
    let offset = 0;
    let boostVelocity = 0;
    let lastTime = 0;
    let lastPaintTime = 0;
    let isVisible = false;
    const baseSpeed = window.matchMedia("(max-width: 640px)").matches ? 22 : 18;
    const minFrameMs = 1000 / 45;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));

    const normalizeOffset = () => {
      if (halfWidth <= 0) {
        return;
      }
      offset = ((offset % halfWidth) + halfWidth) % halfWidth;
    };

    const recalculateWidth = () => {
      halfWidth = track.scrollWidth / 2;
      normalizeOffset();
    };

    const animate = (time: number) => {
      if (!isVisible) {
        frameId = null;
        return;
      }

      if (lastPaintTime && time - lastPaintTime < minFrameMs) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      lastPaintTime = time;

      if (!lastTime) {
        lastTime = time;
      }
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      offset += (baseSpeed + boostVelocity) * deltaSeconds;
      normalizeOffset();
      track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;

      boostVelocity *= Math.pow(0.94, deltaSeconds * 60);
      if (Math.abs(boostVelocity) < 0.2) {
        boostVelocity = 0;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (frameId !== null || !isVisible) return;
      lastTime = 0;
      lastPaintTime = 0;
      frameId = window.requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (!isVisible) return;

      const horizontalDelta = event.deltaX;
      const absX = Math.abs(horizontalDelta);
      const absY = Math.abs(event.deltaY);

      // React only to near-pure horizontal gestures; never block normal page scroll.
      if (absX < 1.2 || absY > 0.6 || absX <= absY * 2) {
        return;
      }

      boostVelocity = clamp(boostVelocity + horizontalDelta * 0.48, -640, 640);
    };

    recalculateWidth();
    const resizeObserver = new ResizeObserver(recalculateWidth);
    resizeObserver.observe(track);
    resizeObserver.observe(container);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "160px 0px",
      },
    );
    visibilityObserver.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
        return;
      }
      if (isVisible) {
        startAnimation();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("wheel", handleWheel);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAnimation();
    };
  }, [items.length]);

  return (
    <div
      ref={containerRef}
      className="relative mt-2 overflow-hidden rounded-2xl"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[color:var(--ap-surface)] to-transparent sm:w-16"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[color:var(--ap-surface)] to-transparent sm:w-16"
        aria-hidden="true"
      />

      <div
        ref={trackRef}
        className="flex min-w-max gap-5 py-2 will-change-transform sm:gap-6"
      >
        {loopItems.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="w-[336px] shrink-0 sm:w-[392px]"
          >
            <Card
              variant="solid"
              dense
              motion="off"
              className="h-full border border-white/12 bg-white/8 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] ring-white/15"
            >
              <div className="flex h-full flex-col gap-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 80vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-200 sm:text-base">{item.body}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
