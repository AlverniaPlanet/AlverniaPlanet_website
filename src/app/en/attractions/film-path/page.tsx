import type { Metadata } from "next";
import LegacyRedirectContent from "@/app/components/LegacyRedirectContent";

const TARGET_PATH = "/en/groups";

export const metadata: Metadata = {
  title: "Film path: Alvernia Planet",
  alternates: { canonical: TARGET_PATH },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegacyRedirectContent targetPath={TARGET_PATH} label="Film path" />;
}
