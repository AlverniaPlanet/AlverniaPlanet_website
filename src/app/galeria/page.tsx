"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/app/i18n-provider";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import {
  GALLERY_CATEGORIES,
  GALLERY_HUB_LABELS,
  type Locale,
} from "./galleryData";

const BLUR_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

export default function GalleryPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const labels = GALLERY_HUB_LABELS[loc];

  return (
    <main className="relative min-h-screen text-white px-4 py-16 sm:py-20">
      <div className="ap-shell ap-page-stack">
        <header className="space-y-5 text-center ap-page-intro-stagger">
          <p className="ap-type-kicker">{labels.tag}</p>
          <h1 className="ap-type-hero-title">{labels.title}</h1>
          <p className="ap-type-hero-subtitle mx-auto max-w-5xl">{labels.subtitle}</p>
          <div className="mx-auto h-[1px] w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </header>

        <ScrollMotionItem strength="strong" delay={40} className="ap-deferred-section">
          <section aria-label={labels.title}>
            <Card variant="solid" motion="off">
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {GALLERY_CATEGORIES.map((category, index) => {
                  const title = category.title[loc];
                  const intro = category.intro[loc];
                  const eyebrow = category.hubTagline[loc];
                  const count = category.images.length;
                  return (
                    <li key={category.slug}>
                      <Link
                        href={`/galeria/${category.slug}`}
                        aria-label={`${title}, ${labels.morePhotos}`}
                        className="ap-interactive-surface group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={category.cover}
                            alt={title}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
                            priority={index < 3}
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
                            aria-hidden="true"
                          />
                          <span className="ap-glass-pill absolute left-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                            {eyebrow}
                          </span>
                          <span className="ap-glass-pill absolute right-3 top-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold text-white/85">
                            {labels.photoCountLabel(count)}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                          {/* h3, nie h2: tytuł karty kategorii, podrzędny
                              wobec H1 "Galeria" — oszczędne użycie nagłówków. */}
                          <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                            {title}
                          </h3>
                          <p className="text-sm leading-relaxed text-white/72">{intro}</p>
                          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7ef6ff] transition group-hover:text-white">
                            {labels.morePhotos}
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              aria-hidden="true"
                              className="transition-transform group-hover:translate-x-0.5"
                            >
                              <path
                                d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        </ScrollMotionItem>
      </div>
    </main>
  );
}
