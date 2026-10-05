"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Siatka bezpieczeństwa na nawigację klienta z nieaktualnym payloadem RSC.
//
// Przy `output: "export"` Next generuje obok każdej trasy plik `<trasa>.txt` z
// listą hashowanych chunków /_next/static/**. Po wdrożeniu stare chunki znikają
// z serwera. Jeśli przeglądarka ma jeszcze w cache STARY payload, klik w menu
// próbuje dociągnąć nieistniejące pliki i React wywala się z komunikatem
// „Application error: a client-side exception has occurred".
//
// Właściwa naprawa jest w .htaccess (payloady .txt dostały max-age=0 +
// must-revalidate, tak jak HTML). Ten komponent ratuje użytkowników, którzy
// mają stary payload w cache SPRZED tej poprawki: robi jedno automatyczne
// przeładowanie, bo świeży dokument HTML zawsze wskazuje na aktualne chunki.
//
// Przeładowanie jest jednorazowe na sesję — inaczej błąd, którego reload nie
// naprawia, zapętliłby stronę. Za drugim razem pokazujemy komunikat i przyciski.
// ---------------------------------------------------------------------------

const RELOAD_FLAG = "ap-error-reloaded";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    let alreadyTried = true;
    try {
      alreadyTried = window.sessionStorage.getItem(RELOAD_FLAG) === "1";
      if (!alreadyTried) window.sessionStorage.setItem(RELOAD_FLAG, "1");
    } catch {
      /* tryb prywatny bez sessionStorage — nie przeładowujemy, żeby nie zapętlić */
    }

    if (!alreadyTried) {
      setReloading(true);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    console.error("Błąd aplikacji:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-24">
      <div className="ap-tile ap-tile-lg w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold text-[color:var(--ap-text)]">
          {reloading ? "Odświeżam stronę…" : "Coś poszło nie tak"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--ap-text-dim)]">
          {reloading
            ? "Za chwilę wczytamy najnowszą wersję serwisu."
            : "Nie udało się wczytać tej podstrony. Spróbuj ponownie albo odśwież stronę."}
        </p>

        {!reloading ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="ap-primary-button inline-flex items-center justify-center rounded-[var(--ap-btn-radius)] bg-[color:var(--ap-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--ap-accent-contrast)]"
            >
              Spróbuj ponownie
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-[var(--ap-btn-radius)] border border-[color:var(--ap-border-strong)] px-5 py-2.5 text-sm font-semibold text-[color:var(--ap-text)] transition hover:bg-white/10"
            >
              Odśwież stronę
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
