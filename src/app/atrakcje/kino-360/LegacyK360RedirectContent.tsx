/* eslint-disable @next/next/no-sync-scripts */
"use client";

import { useEffect } from "react";

export default function LegacyK360RedirectContent({
  targetPath,
}: {
  targetPath: string;
}) {
  useEffect(() => {
    window.location.replace(targetPath);
  }, [targetPath]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--ap-bg)] px-6 text-center text-[color:var(--ap-text)]">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(targetPath)});`,
        }}
      />
      <div className="max-w-md space-y-4">
        <p className="text-sm uppercase tracking-[0.24em] text-white/55">Projekcja K360</p>
        <h1 className="text-3xl font-semibold text-white">Przekierowanie…</h1>
        <p className="text-white/72">Za chwilę przejdziesz do aktualnej strony Projekcji K360.</p>
        <a
          href={targetPath}
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/8"
        >
          Przejdź teraz
        </a>
      </div>
    </main>
  );
}
