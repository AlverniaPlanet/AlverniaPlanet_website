import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Layout tylko dla /aplikacje/identyfikacja (techniczna podstrona kiosku).
//
// Cel: strona ma DZIAŁAĆ normalnie po wejściu w link (bez hasła, bez blokad,
// bez przekierowań), ale NIE ma być indeksowana ani proponowana w Google
// i innych wyszukiwarkach.
//
// Dlaczego layout, a nie metadata w page.tsx?
//   page.tsx jest komponentem klienckim ("use client"), a komponent kliencki
//   nie może eksportować `metadata`. Ten layout to server component, więc może.
//
// Zakres: dotyczy wyłącznie tego segmentu (i ewentualnych podścieżek, których
// tu nie ma). Docelowo, aby objąć całe /aplikacje/, wystarczy przenieść ten
// plik do src/app/aplikacje/layout.tsx.
//
// Efekt w statycznym HTML (output: "export"):
//   <meta name="robots" content="noindex, nofollow">
//   <meta name="googlebot" content="noindex, nofollow">
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function IdentyfikacjaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
