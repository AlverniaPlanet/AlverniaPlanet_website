import type { Metadata } from "next";
import WystawaContent from "./WystawaContent";

export const metadata: Metadata = {
  title: "Wystawa tematyczna — Alvernia Planet",
  description: "Zapowiedź Harry Potter: The Exhibition w Alvernia Planet.",
};

export default function WystawaPage() {
  return <WystawaContent />;
}
