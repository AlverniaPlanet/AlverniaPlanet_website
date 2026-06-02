import CategoryView from "../CategoryView";
import { findCategoryBySlug } from "../galleryData";

export default function Page() {
  const category = findCategoryBySlug("ogolne");
  if (!category) return null;
  return <CategoryView category={category} />;
}
