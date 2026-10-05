"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONSENT_CHANGE_EVENT,
  readConsent,
  type ConsentState,
} from "@/lib/consent";

// ---------------------------------------------------------------------------
// Reakcja na zgodę użytkownika:
//   - GA4 (gtag.js)  -> ładowany ZAWSZE w <head> (RootLayout), tutaj tylko
//                       podnosimy `analytics_storage` przez consent update,
//   - Meta Pixel     -> ładowany dopiero przy `marketing` = granted,
//   - GTM            -> ładowany dopiero przy `marketing` = granted.
//
// GA4 celowo NIE jest już ładowany z tego komponentu — model to Consent Mode v2
// „advanced": tag jest na stronie od pierwszej klatki, ale dopóki nie ma zgody,
// `analytics_storage`/`ad_*` = 'denied', czyli zero cookies analitycznych i
// reklamowych (tylko bezcookie'owe pingi). Powody:
//   1) Google musi WIDZIEĆ tag na stronie (weryfikacja „Nie wykryliśmy tagu"),
//   2) `window.gtag` musi istnieć zanim wystartuje widżet Bookero, który sam
//      wypycha eventy e-commerce (view_cart / add_to_cart / begin_checkout /
//      purchase) — patrz konfiguracja Bookero: GA4 = ON, GTM = „nie używam".
// Gdyby trzeba było wrócić do wariantu „basic" (gtag.js dopiero po zgodzie),
// oba są w git history — ale wtedy Google znów nie wykryje tagu.
//
// Meta Pixel zostaje za bramką zgody: nie ma odpowiednika Consent Mode i od
// razu ustawia własne cookies (_fbp).
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
  // Awaryjny stub — normalnie gtag() definiuje inline-skrypt w <head> (RootLayout),
  // który wykonuje się przed hydracją, więc tu praktycznie nie wchodzimy.
  // UWAGA: gtag/GTM przetwarza z dataLayer WYŁĄCZNIE wpisy typu `arguments`;
  // zwykła tablica jest cicho ignorowana, dlatego push(arguments), nie push(args).
  w.dataLayer = w.dataLayer || [];
  const fn = function () {
    // eslint-disable-next-line prefer-rest-params
    (w.dataLayer as unknown[]).push(arguments);
  } as unknown as AnyFn;
  w.gtag = fn;
  return fn;
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
  gtmId,
  metaPixelId,
}: {
  gtmId: string;
  metaPixelId: string;
}) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const loaded = useRef({ gtm: false, meta: false });

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

    // Odzwierciedl aktualny wybór w Consent Mode v2. To JEDYNE miejsce, które
    // przełącza GA4 z pingów bezcookie'owych na pełny pomiar — działa od razu,
    // bez przeładowania strony (gtag.js już siedzi na stronie z <head>).
    gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });

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
  }, [consent, gtmId, metaPixelId]);

  return null;
}
