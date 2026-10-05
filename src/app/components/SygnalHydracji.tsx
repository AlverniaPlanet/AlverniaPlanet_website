"use client";

import { useEffect } from "react";

/**
 * Ogłasza, że React skończył uwadniać drzewo.
 *
 * Skrypt z `<head>` (patrz layout.tsx, „ap-img-loaded") oznacza wczytane
 * zdjęcia i wchodzące sekcje atrybutami. Robił to NATYCHMIAST, więc gdy
 * zdjęcie było w pamięci podręcznej, atrybut pojawiał się w DOM-ie zanim React
 * zdążył się uwodnić — a wtedy React widzi w HTML-u atrybut, którego sam nie
 * wyrenderował, i przerywa uwadnianie całego poddrzewa:
 *
 *   „A tree hydrated but some attributes of the server rendered HTML didn't
 *    match the client properties."
 *
 * Kosztuje to nie tylko ostrzeżenie w konsoli: React porzuca uwodnione węzły
 * i renderuje gałąź od nowa po stronie klienta.
 *
 * Efekt w komponencie klienckim uruchamia się PO zatwierdzeniu uwodnienia,
 * więc to najwcześniejszy moment, w którym wolno dotykać drzewa Reacta.
 * Skrypt czeka na to zdarzenie i dopiero wtedy wypisuje zebrane atrybuty.
 */
export default function SygnalHydracji() {
  useEffect(() => {
    window.dispatchEvent(new Event("ap:hydrated"));
  }, []);

  return null;
}
