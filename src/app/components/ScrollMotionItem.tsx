"use client";

import { type CSSProperties, type ReactNode } from "react";

type ScrollMotionStrength = "soft" | "strong";

type ScrollMotionItemProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  strength?: ScrollMotionStrength;
  float?: boolean;
};

/* Wejście treści przy przewijaniu.

   Komponent sam NICZEGO nie liczy: dokłada tylko atrybut `data-ap-reveal`
   i opóźnienie. Resztą zajmują się skrypt w <head> (jeden IntersectionObserver
   dla całej strony, który po wejściu elementu w kadr dokłada klasę `is-visible`
   i przestaje go obserwować) oraz CSS (przejście krycia i przesunięcia).

   Dzięki temu w trakcie przewijania nie działa żaden JavaScript liczony co
   klatkę, a animowane są wyłącznie właściwości obsługiwane przez kompozytor —
   to ta sama zasada, która wyszła z diagnozy mikrodrgań.

   Style wejścia są celowo ograniczone do podstrony /wydarzenia
   (`.events-page` w globals.css). Komponent jest używany w czterdziestu
   miejscach serwisu, więc bez tego ograniczenia zmiana dotknęłaby wszystkich
   podstron naraz. */
export default function ScrollMotionItem({
  children,
  className,
  delay = 0,
  strength = "soft",
  float = false,
}: ScrollMotionItemProps) {
  void float;

  return (
    <div
      className={className ?? ""}
      data-ap-reveal={strength}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
