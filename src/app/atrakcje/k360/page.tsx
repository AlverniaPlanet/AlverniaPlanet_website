import type { Metadata } from "next";
import K360Content from "./K360Content";

export const metadata: Metadata = {
  title: "Kino K360 — Alvernia Planet",
  description: "Immersyjna kino K360 w kopułach Alvernia Planet.",
};

export default function K360Page() {
  return <K360Content />;
}
