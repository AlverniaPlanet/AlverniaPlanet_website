"use client";

import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";
import { VR_UI } from "./vrData";

// Fallback dla <Suspense> wokół VrPageContent: tamten komponent używa
// useSearchParams(), więc bez granicy Suspense cała strona wypadała
// z prerenderu (statyczny HTML bez H1 i treści). Ten nagłówek to kopia
// 1:1 nagłówka z VrPageContent — prerenderuje się do HTML, a po hydracji
// płynnie zastępuje go pełny widok (te same klasy = zero przeskoku).
export default function VrHeaderFallback() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  const ui = VR_UI[loc];
  const eventsHref = getLocalizedPath("/wydarzenia", loc);

  return (
    <main className="relative min-h-screen px-4 py-16 text-white sm:py-20">
      <div className="ap-shell space-y-8">
        <header className="space-y-5 text-center">
          <p className="ap-type-kicker">{ui.pageKicker}</p>
          <h1 className="ap-type-hero-title">{ui.pageTitle}</h1>
          <p className="ap-type-hero-subtitle mx-auto max-w-4xl">{ui.pageIntro}</p>
          <div className="flex justify-center">
            <PrimaryButton href={eventsHref}>{ui.backToEvents}</PrimaryButton>
          </div>
        </header>
      </div>
    </main>
  );
}
