import type { Metadata } from "next";
import LegacyK360RedirectContent from "./LegacyK360RedirectContent";

const TARGET_PATH = "/atrakcje/k360";

export const metadata: Metadata = {
  title: "K360° — Alvernia Planet",
  alternates: {
    canonical: TARGET_PATH,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LegacyK360PageRedirect() {
  return <LegacyK360RedirectContent targetPath={TARGET_PATH} />;
}
