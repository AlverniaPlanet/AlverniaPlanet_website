#!/usr/bin/env node
/**
 * Sprawdza, czy KAŻDA nazwa usługi i kategorii, na którą powołuje się kod,
 * naprawdę istnieje w panelu Bookero (wg content/prices.lock.json).
 *
 * PO CO: BookeroEmbed dopasowuje usługę przez RÓWNOŚĆ tekstu po normalizacji.
 * Gdy nazwa się nie zgadza, widżet nie zgłasza błędu — po cichu zaznacza
 * PIERWSZĄ pozycję listy (`select_first_service: 1` w konfiguracji panelu).
 * Skutek jest niewidoczny w kodzie i w testach: klient klika „FILMWORLD 79 zł",
 * a w koszyku ma „Projekt: MARS 69 zł". Dokładnie to działo się na produkcji.
 *
 * Dlatego ten skrypt kończy build błędem. Lepiej nie wdrożyć niż wdrożyć lejek,
 * który po cichu sprzedaje nie ten bilet.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK = resolve(ROOT, "content/prices.lock.json");
const BOOKING = resolve(ROOT, "src/lib/booking.ts");

if (!existsSync(LOCK)) {
  console.error("\n[ceny] BŁĄD: brak content/prices.lock.json — uruchom najpierw scripts/fetch-prices.mjs\n");
  process.exit(1);
}

const lock = JSON.parse(readFileSync(LOCK, "utf8"));
const source = readFileSync(BOOKING, "utf8");

/** Ta sama normalizacja co w BookeroEmbed: bez ogonków, bez ceny w nawiasie. */
const norm = (v) =>
  (v ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[°º˚]/g, "°")
    .replace(/\*/g, "")
    .replace(/[łŁ]/g, "l")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\((?:od\s+)?[\d.,\s]+z[łl]\)/g, " ")
    .replace(/\s*\([^()]*\)\s*$/, " ")
    .replace(/\s+/g, " ")
    .trim();

const services = new Set(lock.services.map((s) => norm(s.name)));
const categories = new Set(lock.services.map((s) => norm(s.category)));

// Ucinanie końcowego dopisku w nawiasie sprawia, że dwie RÓŻNE pozycje panelu
// mogłyby znormalizować się do tej samej nazwy — wtedy deep link trafiałby
// w losową z nich. Wyłapujemy to tutaj, zamiast pozwolić na ciche pomyłki.
const kolizje = new Map();
for (const s of lock.services) {
  for (const surowa of [s.name, s.category]) {
    if (!surowa) continue;
    const k = norm(surowa);
    if (!k) continue;
    if (!kolizje.has(k)) kolizje.set(k, new Set());
    kolizje.get(k).add(surowa);
  }
}
const sklejone = [...kolizje].filter(([, v]) => v.size > 1);
if (sklejone.length) {
  console.error("\n[ceny] BŁĄD: pozycje panelu sklejają się po normalizacji —");
  console.error("       deep link trafiłby w przypadkową z nich.\n");
  for (const [k, v] of sklejone) console.error(`  ✗ "${k}"  <-  ${[...v].map((x) => `"${x}"`).join(", ")}`);
  console.error("");
  process.exit(1);
}

// Nazwy usług: literały w obiektach *_BOOKING_SERVICES i stałych *_SERVICE.
const serviceLiterals = new Set();
for (const m of source.matchAll(/^\s*(?:normal|reduced|group)\s*:\s*"([^"]+)"/gm)) serviceLiterals.add(m[1]);
for (const m of source.matchAll(/_BOOKING_SERVICE\s*(?::\s*string)?\s*=\s*\n?\s*"([^"]+)"/g)) serviceLiterals.add(m[1]);

// Nazwy kategorii: stałe *_BOOKING_CATEGORY z literałem tekstowym.
const categoryLiterals = new Set();
for (const m of source.matchAll(/_BOOKING_CATEGORY\s*=\s*"([^"]+)"/g)) categoryLiterals.add(m[1]);

/**
 * Usługi ŚWIADOMIE nieobecne w panelu — wydarzenia, które się zakończyły.
 * Nie chowamy ich pod dywan: build wypisuje ostrzeżenie, żeby przy reaktywacji
 * wydarzenia ktoś pamiętał, że nazwę trzeba najpierw odtworzyć w Bookero.
 * Komponent korzystający z takiej usługi MUSI być wygaszany datą.
 */
const WYGASLE = new Map([
  [
    "Noc Filmożerców (49,00 zł)",
    "Wieczór Filmożerców 14–15.08.2026 — wydarzenie minęło, usługa zdjęta z panelu; SummerPromoBumper wygasa sam po EVENT_PROMO_END",
  ],
]);

const missingServices = [...serviceLiterals].filter((v) => !services.has(norm(v)) && !WYGASLE.has(v));
for (const [nazwa, powod] of WYGASLE) {
  if (serviceLiterals.has(nazwa) && !services.has(norm(nazwa))) {
    console.warn(`[ceny] UWAGA: „${nazwa}" nie istnieje w panelu — ${powod}`);
  }
}
const missingCategories = [...categoryLiterals].filter((v) => !categories.has(norm(v)));

if (missingServices.length || missingCategories.length) {
  console.error("\n[ceny] BŁĄD: kod odwołuje się do usług/kategorii, których NIE MA w panelu Bookero.");
  console.error("       Deep link cicho zaznaczyłby pierwszą pozycję listy — czyli nie ten bilet.\n");
  for (const v of missingCategories) console.error(`  ✗ kategoria: "${v}"`);
  for (const v of missingServices) console.error(`  ✗ usługa:    "${v}"`);
  console.error("\n  Dostępne w panelu:");
  for (const c of [...categories]) console.error(`     [kategoria] ${c}`);
  for (const s of [...new Set(lock.services.map((x) => x.name))]) console.error(`     ${s}`);
  console.error("");
  process.exit(1);
}

console.log(
  `[ceny] spójność OK — ${serviceLiterals.size} usług i ${categoryLiterals.size} kategorii z kodu istnieje w panelu.`,
);
