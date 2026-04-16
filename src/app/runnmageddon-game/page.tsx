import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gra Runmageddon zakończona — Alvernia Planet",
  description: "Akcja Runmageddon Game zakończyła się 12 kwietnia 2026.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RunnmageddonGameClosedPage() {
  return (
    <main className="relative min-h-screen px-4 py-12 sm:py-16">
      <div className="ap-shell">
        <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/10 bg-[color:var(--ap-surface-contrast)] px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-10">
          <p className="ap-type-kicker">Akcja zakończona</p>
          <h1 className="ap-type-hero-title">Gra Runmageddon została zamknięta</h1>
          <p className="ap-type-hero-subtitle mx-auto max-w-2xl">
            Zbieranie wyników zakończyło się 12 kwietnia 2026. Gra, Bingo i zapisy do wydarzenia nie są już aktywne.
          </p>
          <p className="mt-4 text-sm text-[color:var(--ap-text-muted)]">
            This campaign has ended. The game is no longer available.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/runmageddon"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--ap-accent)] px-6 py-3 text-sm font-semibold text-[color:var(--ap-accent-contrast)] ring-1 ring-[color:var(--ap-accent-ring)] shadow-[var(--ap-accent-shadow)] transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ap-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ap-bg)]"
            >
              Wróć do strony Runmageddon
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
