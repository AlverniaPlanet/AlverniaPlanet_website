import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Strona nie znaleziona | Alvernia Planet",
  description: "Strona, której szukasz, nie istnieje.",
};

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Błąd 404</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">Strona nie znaleziona</h1>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Przykro nam, ale nie udało się odnaleźć strony, której szukasz.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          Powrót do strony głównej
        </Link>
      </div>
    </main>
  );
}
