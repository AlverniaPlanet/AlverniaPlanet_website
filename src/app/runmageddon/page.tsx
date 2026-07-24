import type { Metadata } from "next";
import { languageAlternates } from "@/lib/seo";
import RunmageddonArchiveNotice from "./RunmageddonArchiveNotice";

export const metadata: Metadata = {
  title: "Runmageddon Kraków Alvernia Planet 09-12.04.2026 zakończony, Alvernia Planet",
  description:
    "Archiwum wydarzenia Runmageddon Kraków Alvernia Planet z 09-12 kwietnia 2026. Zapisy i aktywności specjalne są zamknięte.",
  alternates: languageAlternates("/runmageddon", "pl"),
};

export default function RunmageddonPage() {
  return <RunmageddonArchiveNotice />;
}
