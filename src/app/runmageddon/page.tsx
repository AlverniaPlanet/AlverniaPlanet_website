import type { Metadata } from "next";
import RunmageddonContent from "./RunmageddonContent";

export const metadata: Metadata = {
  title: "Runmageddon Kraków Alvernia Planet 09-12.04.2026 — Alvernia Planet",
  description:
    "Runmageddon Kraków Alvernia Planet już 09-12 kwietnia 2026. Sprawdź oficjalny link wydarzenia i zapisy.",
};

export default function RunmageddonPage() {
  return <RunmageddonContent />;
}
