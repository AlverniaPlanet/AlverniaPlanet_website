"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  readConsent,
  type ConsentState,
} from "@/lib/consent";

// ---------------------------------------------------------------------------
// Warunkowe ładowanie trackerów wg zgody:
//   - GA4 + GTM  -> tylko gdy `analytics` = granted,
//   - Meta Pixel -> tylko gdy `marketing` = granted.
// Do tego aktualizacja Google Consent Mode v2 na każdą zmianę zgody.
// Domyślny stan „denied" ustawia inline-skrypt beforeInteractive w layoutcie,
// więc zanim tu cokolwiek zrobimy, żaden cookie analityczny/reklamowy nie leci.
// ---------------------------------------------------------------------------

type AnyFn = (...args: unknown[]) => void;

interface TrackWindow extends Window {
  dataLayer?: unknown[];
  gtag?: AnyFn;
  fbq?: AnyFn & { callMethod?: AnyFn; queue?: unknown[]; loaded?: boolean; version?: string; push?: AnyFn };
  _fbq?: unknown;
}

function getGtag(w: TrackWindow): AnyFn {
  if (typeof w.gtag === "function") return w.gtag;
  w.dataLayer = w.dataLayer || [];
  const fn: AnyFn = (...args: unknown[]) => {
    // gtag używa obiektu `arguments`, nie tablicy — odwzorowujemy 1:1.
    (w.dataLayer as unknown[]).push(args.length === 1 ? args[0] : args);
  };
  w.gtag = fn;
  return fn;
}

function loadGa(w: TrackWindow, gaId: string) {
  // GA4 (gtag.js) — czysta analityka, bez GTM.
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
  const gtag = getGtag(w);
  gtag("js", new Date());
  gtag("config", gaId);
}

// Google Tag Manager to MENEDŻER TAGÓW — może uruchamiać także tagi
// marketingowe (Meta Ads, Google Ads, remarketing), których Google Consent
// Mode nie zawsze zablokuje. Dlatego ładujemy go dopiero przy zgodzie
// „marketing", a NIE przy samej analityce. UWAGA: tagi w kontenerze GTM
// powinny mieć skonfigurowane ustawienia zgody (Consent Mode) po stronie GTM.
function loadGtm(w: TrackWindow, gtmId: string) {
  w.dataLayer = w.dataLayer || [];
  (w.dataLayer as unknown[]).push({ "gtm.start": Date.now(), event: "gtm.js" });
  const g = document.createElement("script");
  g.async = true;
  g.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(g);
}

function loadMetaPixel(w: TrackWindow, pixelId: string) {
  /* eslint-disable */
  // Standardowy snippet Meta Pixel.
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(w, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  w.fbq?.("init", pixelId);
  // Initial PageView odpalamy TU ręcznie — MetaPixelPageViewTracker w tym
  // momencie ma jeszcze fbq=undefined (pixel ładowany po zgodzie), więc pomija
  // pierwszy widok i obsłuży dopiero kolejne nawigacje SPA. Nie usuwać.
  w.fbq?.("track", "PageView");
}

export default function ConsentTrackers({
  gaId,
  gtmId,
  metaPixelId,
}: {
  gaId: string;
  gtmId: string;
  metaPixelId: string;
}) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const loaded = useRef({ ga: false, gtm: false, meta: false });

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!consent) return; // brak decyzji = zostaje default „denied"
    const w = window as TrackWindow;
    const gtag = getGtag(w);

    // Odzwierciedl aktualny wybór w Consent Mode v2.
    gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });

    // Analityka: tylko GA4 (gtag). GTM celowo nie jest tu ładowany.
    if (consent.analytics && !loaded.current.ga) {
      loaded.current.ga = true;
      loadGa(w, gaId);
    }

    // Marketing: Meta Pixel oraz GTM (może zawierać tagi marketingowe).
    if (consent.marketing) {
      if (gtmId && !loaded.current.gtm) {
        loaded.current.gtm = true;
        loadGtm(w, gtmId);
      }
      if (!loaded.current.meta) {
        loaded.current.meta = true;
        loadMetaPixel(w, metaPixelId);
      } else {
        // Ponowna zgoda po wcześniejszym cofnięciu — wznów wysyłkę pixela.
        w.fbq?.("consent", "grant");
      }
    } else if (loaded.current.meta) {
      // Cofnięcie zgody po załadowaniu pixela — zatrzymaj wysyłkę.
      w.fbq?.("consent", "revoke");
    }
  }, [consent, gaId, gtmId, metaPixelId]);

  return null;
}
