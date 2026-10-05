import { I18nProvider } from "../i18n-provider";

// Analogicznie do src/app/en/layout.tsx i src/app/pt/layout.tsx: wymusza
// niemiecki już na etapie prerenderu. Bez tego pliku trasy /de/* budowały się
// z polskiego słownika (globalny provider w root layoutcie startuje z "pl",
// a właściwy język ustawiał się dopiero w useEffect po hydracji) — czyli
// wyeksportowany HTML był polski, a niemiecki pojawiał się dopiero po
// uruchomieniu JavaScriptu. Zmierzone przed poprawką: 0 znaków niemieckiej
// treści w statycznym HTML wszystkich tras /de/*.
export default function DeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nProvider initialLocale="de">{children}</I18nProvider>;
}
