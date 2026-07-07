import type { Metadata } from "next";
import LegacyRedirectContent from "@/app/components/LegacyRedirectContent";

const TARGET_PATH = "/pt/groups";

export const metadata: Metadata = {
  title: "Percurso de filmagem, Alvernia Planet",
  alternates: { canonical: TARGET_PATH },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirectContent targetPath={TARGET_PATH} label="Percurso de filmagem" />;
}
