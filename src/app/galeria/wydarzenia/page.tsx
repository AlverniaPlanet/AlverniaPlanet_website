import type { Metadata } from "next";

// Kategorie galerii istnieją tylko po polsku — canonical wskazuje na siebie
// (bez hreflang), a tytuł odróżnia stronę od głównej galerii.
export const metadata: Metadata = {
  title: "Galeria: Wydarzenia, Alvernia Planet",
  alternates: { canonical: "/galeria/wydarzenia" },
};

import CategoryView from "../CategoryView";
import { findCategoryBySlug } from "../galleryData";

export default function Page() {
  const category = findCategoryBySlug("wydarzenia");
  if (!category) return null;
  return <CategoryView category={category} />;
}
