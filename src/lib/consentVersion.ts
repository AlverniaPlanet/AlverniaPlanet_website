// Wersja zgody na cookies — świadomie TRZYMANA POZA `lib/consent.ts`.
//
// `lib/consent.ts` jest oznaczony "use client", więc gdy komponent serwerowy
// (RootLayout) importował stąd stałą, Next podstawiał zamiast liczby proxy
// klienckie. W statycznym HTML lądowało wtedy porównanie:
//   if (c && c.v === function(){throw Error("Attempted to call ...")})
// czyli warunek ZAWSZE fałszywy — Consent Mode startował jako "denied"
// nawet dla użytkowników, którzy wcześniej wyrazili zgodę.
//
// Ten moduł nie ma "use client", więc importują go bezpiecznie i serwer,
// i klient. Podbij wartość, jeśli zmienią się kategorie lub zakres zgody
// (wymusi ponowne pytanie użytkownika).
export const CONSENT_VERSION = 1;
