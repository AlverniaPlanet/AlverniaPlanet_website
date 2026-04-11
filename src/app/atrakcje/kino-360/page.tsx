import type { Metadata } from "next";
import Kino360Content from "./Kino360Content";

export const metadata: Metadata = {
  title: "Kino Sferyczne 3D 360° — Alvernia Planet",
  description: "Immersyjne Kino Sferyczne 3D 360° w kopułach Alvernia Planet.",
};

export default function Kino360Page() {
  return <Kino360Content />;
}
