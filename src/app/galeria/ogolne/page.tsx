import type { Metadata } from "next";

// Kategorie galerii istnieją tylko po polsku — canonical wskazuje na siebie
// (bez hreflang), a tytuł odróżnia stronę od głównej galerii.
export const metadata: Metadata = {
  title: "Galeria: Ogólne, Alvernia Planet",
  alternates: { canonical: "/galeria/ogolne" },
};

import CategoryView from "../CategoryView";
import { findCategoryBySlug } from "../galleryData";

export default function Page() {
  const category = findCategoryBySlug("ogolne");
  if (!category) return null;
  return <CategoryView category={category} />;
}
