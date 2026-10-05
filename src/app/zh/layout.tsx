import { I18nProvider } from "../i18n-provider";

// Analogicznie do src/app/en/layout.tsx i src/app/pt/layout.tsx: wymusza
// chiński już na etapie prerenderu. Bez tego pliku trasy /zh/* budowały się
// z polskiego słownika — zmierzone: 0 znaków CJK w statycznym HTML KAŻDEJ
// trasy /zh/*, chiński pojawiał się dopiero po hydracji.
export default function ZhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nProvider initialLocale="zh">{children}</I18nProvider>;
}
