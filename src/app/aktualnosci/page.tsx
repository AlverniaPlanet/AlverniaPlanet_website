"use client";

import { NEWS_COPY, NewsSectionBlock } from "@/app/components/newsContent";
import { useI18n } from "@/app/i18n-provider";
import type { Locale } from "@/lib/localizedRoutes";

export default function NewsPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;

  return (
    <main className="relative min-h-screen px-4 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[72rem]">
        <NewsSectionBlock news={NEWS_COPY[loc]} />
      </div>
    </main>
  );
}
