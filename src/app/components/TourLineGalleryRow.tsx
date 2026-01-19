"use client";

import { useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Przewiń w lewo"
        onClick={() => scrollBy(-320)}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/15 shadow-lg hover:bg-black/80 transition"
      >
        <Chevron direction="left" />
      </button>
      <button
        type="button"
        aria-label="Przewiń w prawo"
        onClick={() => scrollBy(320)}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/15 shadow-lg hover:bg-black/80 transition"
      >
        <Chevron direction="right" />
      </button>

      <div className="overflow-x-auto pb-2" ref={scrollRef}>
        <div className="flex gap-4 sm:gap-6 min-w-max pr-2 sm:pr-4">
          {items.map((item) => (
            <Card
              key={item.title}
              variant="glass"
              dense
              className="w-[280px] sm:w-[320px] flex-shrink-0 h-full bg-white/8 ring-white/15 border border-white/12 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
            >
              <div className="flex flex-col h-full gap-4">
                <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.35)] aspect-[16/10]">
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
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{item.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  const rotate = direction === "left" ? "rotate-180" : "";
  return (
    <svg
      className={`h-4 w-4 text-white ${rotate}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3l6 7-6 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
