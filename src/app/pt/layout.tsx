import { I18nProvider } from "../i18n-provider";

// Analogicznie do src/app/en/layout.tsx: wymusza portugalski już na etapie
// prerenderu, żeby statyczny HTML tras /pt/* nie był polskim duplikatem.
export default function PtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nProvider initialLocale="pt">{children}</I18nProvider>;
}
