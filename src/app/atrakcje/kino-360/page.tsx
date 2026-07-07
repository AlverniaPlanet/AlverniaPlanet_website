import type { Metadata } from "next";
import K360Content from "./K360Content";

export const metadata: Metadata = {
  title: "Kino 360, Alvernia Planet",
  description:
    "Kino 360 w Alvernia Planet, największe kino fulldome w Europie. Kopuła 48 m, obraz 360° dookoła widza, seans ok. 30 minut. Bilety od 39 zł.",
};

export default function Kino360Page() {
  return <K360Content />;
}
