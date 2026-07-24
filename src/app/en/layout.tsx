import { I18nProvider } from "../i18n-provider";

// Nadpisuje globalny (polski) kontekst i18n dla całego drzewa /en/*, dzięki
// czemu statyczny HTML tych tras prerenderuje się od razu po angielsku.
// Wcześniej język ustawiał się dopiero w useEffect po stronie klienta, więc
// w wyeksportowanym HTML strony /en/* były po polsku i Google klasyfikował
// je jako "duplikat bez canonicala". Nawigacja i stopka (renderowane w root
// layoutcie, poza tym providerem) przełączają się nadal po hydracji.
export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nProvider initialLocale="en">{children}</I18nProvider>;
}
