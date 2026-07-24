import type { Metadata } from "next";

// Kategorie galerii istnieją tylko po polsku — canonical wskazuje na siebie
// (bez hreflang), a tytuł odróżnia stronę od głównej galerii.
export const metadata: Metadata = {
  title: "Galeria: Harry Potter: The Exhibition, Alvernia Planet",
  alternates: { canonical: "/galeria/harry-potter" },
};

import CategoryView from "../CategoryView";
import { findCategoryBySlug } from "../galleryData";

export default function Page() {
  const category = findCategoryBySlug("harry-potter");
  if (!category) return null;
  return <CategoryView category={category} />;
}
