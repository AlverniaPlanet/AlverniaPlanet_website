import type { Metadata } from "next";
import FilmPathContent from "./FilmPathContent";

export const metadata: Metadata = {
  title: "Ścieżka filmowa — Alvernia Planet",
  description: "Zwiedzanie i edukacja filmowa w kopułach Alvernia Planet.",
};

export default function Page() {
  return <FilmPathContent />;
}
