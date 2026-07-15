// Angielski alias podstrony filmu Kina 360 — ta sama zawartość co kanoniczna
// /atrakcje/kino-360/[slug]; język ustala I18nProvider po prefiksie /en.
export const dynamicParams = false;
export {
  default,
  generateStaticParams,
  generateMetadata,
} from "../../../../atrakcje/kino-360/[slug]/page";
