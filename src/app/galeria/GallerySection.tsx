"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const BLUR_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

const MOSAIC_PATTERN = [
  "md:col-span-6 md:row-span-2",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-1",
  "md:col-span-3 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
  "md:col-span-4 md:row-span-1",
];

function getMosaicClass(index: number) {
  return MOSAIC_PATTERN[index % MOSAIC_PATTERN.length];
}

type GallerySectionProps = {
  images: string[];
  captions: string[];
  fallbackCaption: string;
  loadingText: string;
  errorText: string;
};

export default function GallerySection({
  images,
  captions,
  fallbackCaption,
  loadingText,
  errorText,
}: GallerySectionProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isLightboxOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [isLightboxOpen]);

  const getCaption = (index: number) =>
    captions[index] ?? `${fallbackCaption} ${index + 1}`;

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-12 md:auto-rows-[132px] lg:auto-rows-[152px]">
        {images.map((src, i) => {
          const caption = getCaption(i);
          return (
            <li key={src} className={`group ${getMosaicClass(i)}`}>
              <GalleryTile
                src={src}
                alt={caption}
                loadingText={loadingText}
                errorText={errorText}
                onClick={() => {
                  setLightboxIndex(i);
                  setIsLightboxOpen(true);
                }}
                priority={i === 0}
              />
            </li>
          );
        })}
      </ul>
      {isLightboxOpen && (
        <Lightbox
          items={images}
          index={lightboxIndex}
          caption={getCaption(lightboxIndex)}
          onClose={() => setIsLightboxOpen(false)}
          onChange={(i) => setLightboxIndex(i)}
        />
      )}
    </>
  );
}

type LightboxProps = {
  items: string[];
  index: number;
  caption?: string;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
};

function Lightbox({ items, index, caption, onClose, onChange }: LightboxProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onChange]);

  const next = () => onChange((index + 1) % items.length);
  const prev = () => onChange((index - 1 + items.length) % items.length);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full max-w-[min(86vw,120rem)] h-[80vh]"
          style={{
            animation: "galleryLightboxEnter 220ms cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          <Image
            src={items[index]}
            alt={caption ?? "photo"}
            fill
            className="object-contain select-none"
            sizes="100vw"
            priority
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white/90 text-sm px-4 py-2">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">{caption}</span>
              <span className="text-white/70 text-xs">
                {index + 1} / {items.length}
              </span>
            </div>
          </div>

          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 ring-1 ring-white/20"
          >
            ✕
          </button>
          <button
            aria-label="Previous"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 ring-1 ring-white/20"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 ring-1 ring-white/20"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

type GalleryTileProps = {
  src: string;
  alt: string;
  loadingText: string;
  errorText: string;
  onClick: () => void;
  priority?: boolean;
};

function GalleryTile({
  src,
  alt,
  loadingText,
  errorText,
  onClick,
  priority,
}: GalleryTileProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <figure
      onClick={() => {
        if (!errored) onClick();
      }}
      className="ap-interactive-surface group flex h-full cursor-zoom-in flex-col overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
    >
      <div className="relative aspect-[4/3] md:flex-1 md:aspect-auto md:min-h-0">
        {!loaded && !errored && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/5 animate-pulse text-xs text-white/70">
            {loadingText}
          </div>
        )}

        {errored ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-[#f77828]">
            {errorText}
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1280px) 320px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
        )}
      </div>
    </figure>
  );
}
