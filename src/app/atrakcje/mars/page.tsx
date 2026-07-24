import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import MarsLandingContent from "./MarsLandingContent";

const marsAssetDirectory = path.join(process.cwd(), "public", "mars");
const supportedAssetExtensions = [
  ".png",
  ".webp",
  ".jpg",
  ".jpeg",
  ".avif",
  ".gif",
];

const surfaceAssetExtensions = [".webp", ".avif", ".jpg", ".jpeg", ".png"];

function getMarsAssets() {
  try {
    const assets = fs
      .readdirSync(marsAssetDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) =>
        supportedAssetExtensions.includes(path.extname(fileName).toLowerCase()),
      );

    const planetAssets = [...assets].sort((a, b) => {
      const extensionDiff =
        supportedAssetExtensions.indexOf(path.extname(a).toLowerCase()) -
        supportedAssetExtensions.indexOf(path.extname(b).toLowerCase());

      return extensionDiff || a.localeCompare(b, "pl");
    });
    const marsAsset =
      planetAssets.find((fileName) => fileName.toLowerCase().includes("planet")) ??
      planetAssets.find((fileName) => fileName.toLowerCase().includes("mars")) ??
      planetAssets[0] ??
      null;

    const surfaceAsset =
      assets
        .filter((fileName) =>
          surfaceAssetExtensions.includes(path.extname(fileName).toLowerCase()),
        )
        .sort((a, b) => {
          const aName = a.toLowerCase();
          const bName = b.toLowerCase();
          const aScore = Number(
            aName.includes("podloga") || aName.includes("floor"),
          );
          const bScore = Number(
            bName.includes("podloga") || bName.includes("floor"),
          );
          const aExt = surfaceAssetExtensions.indexOf(path.extname(a).toLowerCase());
          const bExt = surfaceAssetExtensions.indexOf(path.extname(b).toLowerCase());

          return bScore - aScore || aExt - bExt || a.localeCompare(b, "pl");
        })[0] ?? null;

    return {
      marsAsset: marsAsset ? `/mars/${encodeURIComponent(marsAsset)}` : null,
      surfaceAsset: surfaceAsset
        ? `/mars/${encodeURIComponent(surfaceAsset)}`
        : null,
    };
  } catch {
    return { marsAsset: null, surfaceAsset: null };
  }
}

// Uwaga: do lipca 2026 strona miała tu robots: noindex — relikt z fazy
// koncepcji, przez który publiczna atrakcja była niewidoczna dla Google.
export const metadata: Metadata = {
  title: "Projekt MARS, Alvernia Planet",
  description:
    "Projekt MARS w Alvernia Planet: wciel się w astronautę i przeżyj misję marsjańską pod kopułami pod Krakowem. Bilety online.",
  alternates: { canonical: "/atrakcje/mars" },
};

export default function MarsPage() {
  const { marsAsset, surfaceAsset } = getMarsAssets();

  return (
    <MarsLandingContent marsAsset={marsAsset} surfaceAsset={surfaceAsset} />
  );
}
