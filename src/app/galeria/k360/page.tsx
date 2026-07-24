import type { Metadata } from "next";

// Kategorie galerii istnieją tylko po polsku — canonical wskazuje na siebie
// (bez hreflang), a tytuł odróżnia stronę od głównej galerii.
export const metadata: Metadata = {
  title: "Galeria: Kino 360, Alvernia Planet",
  alternates: { canonical: "/galeria/k360" },
};

import CategoryView from "../CategoryView";
import { findCategoryBySlug } from "../galleryData";

export default function Page() {
  const category = findCategoryBySlug("k360");
  if (!category) return null;
  return <CategoryView category={category} />;
}
