"use client";

import { useEffect } from "react";

const IOS_URL = "https://apps.apple.com/pl/app/marsapp/id6775477060?l=pl";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.alverniaplanet.marsvideo";
// Ścieżka względna, nie pełny adres z www: .htaccess przekierowuje www -> bez www
// (301), więc twardy link z www robiłby zbędny dodatkowy skok.
const HOME_URL = "/";

// Wykrycie systemu i natychmiastowe przekierowanie, odpala się jeszcze PRZED
// hydracją Reacta (inline <script>), więc QR działa praktycznie bez mignięcia.
// To jest tylko zapas: na produkcji (Apache) przekierowanie robi .htaccess
// wcześniej, zanim ten plik w ogóle zostanie podany.
const REDIRECT_SCRIPT = `(function(){try{
  var ua = navigator.userAgent || "";
  var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/i.test(ua);
  var url = ios ? ${JSON.stringify(IOS_URL)} : android ? ${JSON.stringify(ANDROID_URL)} : ${JSON.stringify(HOME_URL)};
  window.location.replace(url);
}catch(e){}})();`;

export default function QrRedirectContent() {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const ios =
      /iPhone|iPad|iPod/i.test(ua) ||
      (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    const android = /Android/i.test(ua);
    const url = ios ? IOS_URL : android ? ANDROID_URL : HOME_URL;
    window.location.replace(url);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0c0704] px-6 text-center">
      {/* Przekierowanie wykonuje się natychmiast, przed hydracją Reacta */}
      <script dangerouslySetInnerHTML={{ __html: REDIRECT_SCRIPT }} />

      <div className="w-full max-w-sm space-y-7">
        <div className="space-y-2">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-[#ff9357]">
            Alvernia Planet
          </p>
          <h1 className="text-3xl font-black text-white">MarsApp</h1>
          <p className="text-sm text-white/65">
            Otwieramy aplikację dopasowaną do Twojego urządzenia…
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={IOS_URL}
            className="block rounded-full bg-[linear-gradient(135deg,#c2410c,#f77828,#ff9357)] px-6 py-3 text-sm font-extrabold text-[#2a1206] shadow-[0_10px_28px_rgba(247,120,40,0.4)] transition hover:brightness-110"
          >
            Pobierz w App Store
          </a>
          <a
            href={ANDROID_URL}
            className="block rounded-full border border-[#f77828]/45 bg-white/[0.05] px-6 py-3 text-sm font-bold text-white transition hover:border-[#f77828] hover:bg-white/10"
          >
            Pobierz w Google Play
          </a>
          <a
            href={HOME_URL}
            className="block rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/35 hover:text-white"
          >
            Przejdź do strony głównej
          </a>
        </div>

        <p className="text-xs text-white/40">
          Jeśli nic się nie dzieje, wybierz opcję ręcznie powyżej.
        </p>
      </div>
    </main>
  );
}
