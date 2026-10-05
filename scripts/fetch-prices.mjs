#!/usr/bin/env node
/**
 * Pobiera katalog usług i cen z panelu Bookero i zapisuje go do
 * content/prices.lock.json.
 *
 * DLACZEGO TAK, A NIE RĘCZNIE W KODZIE:
 * Bookero jest jedynym miejscem, w którym klient realnie płaci. Trzymanie cen i
 * nazw usług osobno w kodzie oznaczało, że dwie listy mogły się rozjechać — i
 * rozjechały się: 11 z 18 nazw w src/lib/booking.ts nie istniało w panelu, przez
 * co „Kup pakiet" i FILMWORLD wysyłały klienta na bilet MARS za 69 zł.
 *
 * DLACZEGO SNAPSHOT W REPO, A NIE POBIERANIE W PRZEGLĄDARCE:
 *  - ceny zostają w źródle HTML (SEO, brak mignięcia przy ładowaniu),
 *  - klucz/identyfikator nie jest potrzebny w runtime,
 *  - build działa, gdy Bookero chwilowo nie odpowiada,
 *  - `git diff` pokazuje wprost „119.00 → 109.00", a `git revert` cofa cenę,
 *  - plik jest INTERFEJSEM: jeśli kiedyś źródłem stanie się Supabase, zmienia
 *    się tylko ten skrypt, a nie komponenty.
 *
 * Świadomie BEZ znacznika czasu w pliku — inaczej każdy build brudziłby repo.
 * Datą obserwacji ceny jest data commita.
 *
 * Endpoint jest wewnętrznym API wtyczki Bookero, nie oficjalnym API partnerskim.
 * Dlatego walidacja jest ostra: przy zmianie kształtu odpowiedzi build ma PAŚĆ,
 * a nie po cichu opublikować puste ceny.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCK = resolve(ROOT, "content/prices.lock.json");

const PLUGIN_ID = process.env.BOOKERO_PLUGIN_ID || "8iWKMAEWtI0P";
const ENDPOINT = `https://plugin.bookero.pl/plugin-api/v2/init?bookero_id=${PLUGIN_ID}`;
const TIMEOUT_MS = 20000;

function fail(msg) {
  console.error(`\n[ceny] BŁĄD: ${msg}\n`);
  process.exit(1);
}

/** Walidacja kształtu odpowiedzi — celowo szczegółowa, bo API jest nieudokumentowane.
 *
 *  ZWRACA `{ problems, snapshot }` zamiast kończyć proces. Decyzję, czy to ma
 *  zatrzymać build, podejmuje `main()` — bo zależy ona od czegoś, czego ta
 *  funkcja nie wie: czy w repo leży użyteczny snapshot. */
function validate(payload) {
  const problems = [];
  if (!payload || typeof payload !== "object") problems.push("odpowiedź nie jest obiektem");
  if (payload?.result !== 1) problems.push(`result != 1 (jest: ${payload?.result})`);
  const list = payload?.services_list;
  if (!Array.isArray(list)) problems.push("brak tablicy services_list");
  else if (list.length < 15) problems.push(`services_list ma tylko ${list.length} pozycji (spodziewane 15+)`);

  const services = [];
  (Array.isArray(list) ? list : []).forEach((s, i) => {
    const where = `services_list[${i}]`;
    if (typeof s?.id !== "number") return problems.push(`${where}: brak liczbowego id`);
    if (typeof s?.name !== "string" || !s.name.trim()) return problems.push(`${where}: brak nazwy`);
    if (typeof s?.price !== "string" || !/^\d+\.\d{2}$/.test(s.price))
      return problems.push(`${where} („${s.name}"): cena w nieoczekiwanym formacie: ${JSON.stringify(s.price)}`);
    if (typeof s?.category?.id !== "number" || typeof s?.category?.name !== "string")
      return problems.push(`${where} („${s.name}"): brak kategorii`);
    services.push({
      id: s.id,
      name: s.name.trim(),
      // grosze jako liczba całkowita — ceny nigdy we float
      priceGrosze: Math.round(parseFloat(s.price) * 100),
      categoryId: s.category.id,
      category: s.category.name.trim(),
      published: s.published === 1,
      ordering: typeof s.ordering === "number" ? s.ordering : 0,
    });
  });

  return {
    problems,
    snapshot: {
      source: "bookero:/plugin-api/v2/init",
      pluginId: PLUGIN_ID,
      currency: typeof payload?.default_currency === "string" ? payload.default_currency : "PLN",
      services: services.sort((a, b) => a.categoryId - b.categoryId || a.ordering - b.ordering || a.id - b.id),
    },
  };
}

async function main() {
  let payload = null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(ENDPOINT, { signal: ctrl.signal, headers: { accept: "application/json" } });
    clearTimeout(t);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    payload = await res.json();
  } catch (err) {
    // Sieć padła. Snapshot ratuje build; jego brak NIE MOŻE przejść po cichu.
    if (existsSync(LOCK)) {
      console.warn(`[ceny] Bookero nie odpowiada (${err.message}) — używam snapshotu z repo.`);
      return;
    }
    fail(`Bookero nie odpowiada (${err.message}) i nie ma snapshotu ${LOCK}. Nie publikuję pustych cen.`);
  }

  const { problems, snapshot: next } = validate(payload);

  /* Odpowiedź jest do niczego. Ta sama zasada co przy padniętej sieci wyżej,
     i z tego samego powodu, który stoi w nagłówku pliku: „build działa, gdy
     Bookero chwilowo nie odpowiada". Wcześniej ta ścieżka obsługiwała WYŁĄCZNIE
     brak odpowiedzi — a Bookero odpowiada poprawnym HTTP 200 z PUSTĄ listą
     usług (stan od 2026-10-02, konto wygaszone po przejściu sprzedaży do
     Iksorisa). Build padał wtedy mimo nienaruszonego snapshotu w repo.

     Niezmiennik, którego ten skrypt pilnuje, jest nietknięty: przy złej
     odpowiedzi NIE dochodzimy do `writeFileSync`, więc snapshot nigdy nie
     zostaje nadpisany śmieciem. Zmienia się tylko to, czy brak świeżych danych
     ma zatrzymać wdrożenie — a nie ma, dopóki jest z czego korzystać.

     Ostrzeżenie jest GŁOŚNE i celowo powtarza się przy każdym budowaniu: potok
     cen wisi na wygaszonym dostawcy i ktoś musi w końcu zdecydować, czy
     przepiąć go na Iksorisa, czy wyciąć z `npm run build`. */
  if (problems.length) {
    if (existsSync(LOCK)) {
      console.warn(
        `\n[ceny] UWAGA: odpowiedź Bookero jest nieużyteczna:\n  - ${problems.join("\n  - ")}\n` +
        `[ceny] Snapshot ${LOCK} ZOSTAJE bez zmian — build idzie dalej na nim.\n` +
        `[ceny] Jeśli Bookero zostało wygaszone na stałe, potok cen trzeba przepiąć albo wyciąć.\n`,
      );
      return;
    }
    fail(`odpowiedź Bookero ma nieoczekiwany kształt i nie ma snapshotu ${LOCK}:\n  - ${problems.join("\n  - ")}`);
  }

  const serialized = JSON.stringify(next, null, 2) + "\n";
  const previous = existsSync(LOCK) ? readFileSync(LOCK, "utf8") : null;

  if (previous === serialized) {
    console.log(`[ceny] bez zmian — ${next.services.length} usług.`);
    return;
  }

  if (previous) {
    // Pokaż CO się zmieniło; cicha zmiana ceny to ostatnia rzecz, jakiej chcemy.
    const before = new Map(JSON.parse(previous).services.map((s) => [s.id, s]));
    const after = new Map(next.services.map((s) => [s.id, s]));
    for (const [id, s] of after) {
      const b = before.get(id);
      if (!b) console.log(`[ceny] NOWA USŁUGA: „${s.name}" — ${(s.priceGrosze / 100).toFixed(2)} ${next.currency}`);
      else if (b.priceGrosze !== s.priceGrosze)
        console.log(`[ceny] ZMIANA CENY: „${s.name}" ${(b.priceGrosze / 100).toFixed(2)} → ${(s.priceGrosze / 100).toFixed(2)} ${next.currency}`);
      else if (b.name !== s.name) console.log(`[ceny] ZMIANA NAZWY: „${b.name}" → „${s.name}"`);
    }
    for (const [id, b] of before) if (!after.has(id)) console.log(`[ceny] USUNIĘTA USŁUGA: „${b.name}"`);
  }

  writeFileSync(LOCK, serialized, "utf8");
  console.log(`[ceny] zapisano ${next.services.length} usług do content/prices.lock.json`);
}

await main();
