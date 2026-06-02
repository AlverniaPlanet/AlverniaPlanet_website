import CategoryView from "../CategoryView";
import { findCategoryBySlug } from "../galleryData";

export default function Page() {
  const category = findCategoryBySlug("harry-potter");
  if (!category) return null;
  return <CategoryView category={category} />;
}
