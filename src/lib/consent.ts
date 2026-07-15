"use client";

// ---------------------------------------------------------------------------
// Zgoda na cookies (RODO / ePrivacy). Model + trwałe zapamiętanie wyboru
// + zdarzenia do synchronizacji banera z ładowaniem trackerów.
//
// Kategorie:
//   - necessary  — zawsze aktywne (działanie strony), nie wymaga zgody,
//   - analytics  — Google Analytics / GTM,
//   - marketing  — Meta Pixel (i reklamowe sygnały Google Consent Mode).
//
// Żaden tracker nie ładuje się, dopóki użytkownik nie wyrazi zgody w danej
// kategorii (patrz ConsentTrackers). Domyślnie wszystko poza necessary = OFF.
// ---------------------------------------------------------------------------

export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

export type ConsentState = {
  v: number;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

// Podbij, jeśli zmienią się kategorie/zakres — wymusi ponowne pytanie o zgodę.
export const CONSENT_VERSION = 1;
const STORAGE_KEY = "ap-cookie-consent";

export const CONSENT_CHANGE_EVENT = "ap:consent-change";
export const OPEN_SETTINGS_EVENT = "ap:open-cookie-settings";

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState> | null;
    if (!parsed || parsed.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      ts: typeof parsed.ts === "number" ? parsed.ts : 0,
    };
  } catch {
    return null;
  }
}

export function writeConsent(categories: ConsentCategories): ConsentState {
  const state: ConsentState = {
    v: CONSENT_VERSION,
    necessary: true,
    analytics: categories.analytics === true,
    marketing: categories.marketing === true,
    ts: Date.now(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* np. tryb prywatny bez localStorage — zgoda zadziała do przeładowania */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
  return state;
}

/** Otwórz baner ustawień cookies (np. z linku w stopce). */
export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}
