"use client";

import { useState } from "react";

export default function FloatingPromo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[1200] flex flex-col items-end gap-2">
      {open && (
        <div className="rounded-2xl bg-black/70 px-4 py-3 ring-1 ring-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md text-sm sm:text-base text-white/90 scale-105 sm:scale-115 origin-bottom-right">
          <div className="font-semibold text-white">Kod rabatowy</div>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 font-semibold tracking-wide ring-1 ring-white/15">
            🎁 <span className="text-white/90">kod</span>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`h-11 w-11 sm:h-[52px] sm:w-[52px] md:h-[56px] md:w-[56px] rounded-full bg-black/65 text-white font-bold ring-1 ring-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-white/15 hover:scale-[1.03] active:scale-95 transition ${
          open ? "rotate-[8deg]" : ""
        }`}
        aria-label="Pokaż kod rabatowy"
      >
        🎄
      </button>
    </div>
  );
}
