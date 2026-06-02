"use client";

import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import GallerySection from "./GallerySection";
import {
  GALLERY_HUB_LABELS,
  type GalleryCategory,
  type Locale,
} from "./galleryData";

type Props = {
  category: GalleryCategory;
};

export default function CategoryView({ category }: Props) {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const labels = GALLERY_HUB_LABELS[loc];
  const title = category.title[loc];
  const intro = category.intro[loc];
  const eyebrow = category.hubTagline[loc];

  return (
    <main className="relative min-h-screen text-white px-4 py-16 sm:py-20">
      <div className="ap-shell ap-page-stack">
        <header className="space-y-5 text-center ap-page-intro-stagger">
          <p className="ap-type-kicker">{eyebrow}</p>
          <h1 className="ap-type-hero-title">{title}</h1>
          <p className="ap-type-hero-subtitle mx-auto max-w-5xl">{intro}</p>

          <div className="flex flex-col items-center gap-2">
            <Link
              href="/galeria"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:bg-white/10 hover:text-white"
              aria-label={labels.backToHubAria}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M11.5 7h-9M6 3.5 2.5 7 6 10.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {labels.backToHub}
            </Link>
            <span className="text-xs text-white/55">
              {labels.photoCountLabel(category.images.length)}
            </span>
          </div>

          <div className="mx-auto h-[1px] w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <ScrollMotionItem strength="strong" delay={40} className="ap-deferred-section">
          <Card variant="solid" motion="off">
            <GallerySection
              images={category.images}
              captions={category.captions[loc]}
              fallbackCaption={`${title} • ${labels.photoLabel}`}
              loadingText={labels.loadingImage}
              errorText={labels.imageError}
            />
          </Card>
        </ScrollMotionItem>
      </div>
    </main>
  );
}
