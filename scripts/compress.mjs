#!/usr/bin/env node
/**
 * Prekompresja Brotli dla statycznego eksportu.
 *
 * Hosting (LH.pl, Apache współdzielony) NIE ma mod_brotli — konfiguracja w
 * .htaccess jest owinięta w <IfModule mod_brotli.c> i po cichu pomijana, więc
 * produkcja serwuje wyłącznie gzip. Zamiast czekać na moduł, kompresujemy pliki
 * tutaj, a .htaccess podmienia je regułą przepisania, gdy przeglądarka wyśle
 * `Accept-Encoding: br`. Wymaga tylko mod_rewrite + mod_headers, które działają.
 *
 * Plik .br powstaje TYLKO wtedy, gdy jest realnie mniejszy od oryginału —
 * inaczej niepotrzebnie zwiększalibyśmy liczbę plików do wgrania przez FTP.
 */
import { readdirSync, statSync, readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { brotliCompressSync, constants } from "node:zlib";

const KATALOG = "out";
const ROZSZERZENIA = new Set([".js", ".css", ".html", ".svg", ".json", ".txt", ".xml"]);
const MIN_BAJTOW = 1024; // poniżej 1 KB narzut nagłówków zjada zysk

// .htaccess leży w korzeniu repo, a nie w public/, więc `next build` NIGDY nie
// kopiuje go do out/. Wgranie samego out/ na FTP zostawiało na serwerze STARY
// plik — czyli reguły Brotli poniżej nigdy by nie zadziałały, a prekompresja
// byłaby bezużyteczna. Kopiujemy go tutaj, żeby deploy był jednym katalogiem.
function skopiujHtaccess() {
  const zrodlo = ".htaccess";
  if (!existsSync(zrodlo)) {
    console.warn("[brotli] UWAGA: brak .htaccess w korzeniu — reguły .br nie trafią na serwer");
    return;
  }
  writeFileSync(join(KATALOG, ".htaccess"), readFileSync(zrodlo));
  console.log("[brotli] skopiowano .htaccess do out/");
}

if (!existsSync(KATALOG)) {
  console.error(`[brotli] BŁĄD: brak katalogu ${KATALOG}/ — najpierw \`next build\``);
  process.exit(1);
}

// `next build` kopiuje public/ w całości, razem z metadanymi Findera. Pliki
// .DS_Store nie mają na serwerze żadnej funkcji, a wyliczają nazwy plików
// w katalogu — łącznie z tymi, których nigdzie nie podlinkowano. Są w
// .gitignore, więc nie ma ich w repozytorium, ale na dysku powstają same
// i tą drogą trafiały do eksportu. Usuwamy je po każdym budowaniu.
function usunSmieciSystemowe() {
  let ile = 0;
  let bajty = 0;
  for (const sciezka of pliki(KATALOG)) {
    if (!sciezka.endsWith(".DS_Store")) continue;
    bajty += statSync(sciezka).size;
    unlinkSync(sciezka);
    ile += 1;
  }
  if (ile) console.log(`[brotli] usunięto ${ile} plików .DS_Store (${Math.round(bajty / 1024)} KB)`);
}

function* pliki(katalog) {
  for (const wpis of readdirSync(katalog, { withFileTypes: true })) {
    const sciezka = join(katalog, wpis.name);
    if (wpis.isDirectory()) yield* pliki(sciezka);
    else yield sciezka;
  }
}

let zrobione = 0, pominiete = 0, usuniete = 0;
let przed = 0, po = 0;
const start = Date.now();

for (const sciezka of pliki(KATALOG)) {
  if (sciezka.endsWith(".br")) continue;
  if (!ROZSZERZENIA.has(extname(sciezka))) continue;

  const rozmiar = statSync(sciezka).size;
  const cel = `${sciezka}.br`;

  if (rozmiar < MIN_BAJTOW) {
    // stary .br mógł zostać po poprzednim buildzie — usuwamy, żeby Apache
    // nie podał nieaktualnej treści
    if (existsSync(cel)) { unlinkSync(cel); usuniete++; }
    pominiete++;
    continue;
  }

  const dane = readFileSync(sciezka);
  const skompresowane = brotliCompressSync(dane, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_SIZE_HINT]: dane.length,
    },
  });

  if (skompresowane.length >= rozmiar) {
    if (existsSync(cel)) { unlinkSync(cel); usuniete++; }
    pominiete++;
    continue;
  }

  writeFileSync(cel, skompresowane);
  zrobione++;
  przed += rozmiar;
  po += skompresowane.length;
}

const kb = (b) => (b / 1024).toFixed(1);
console.log(`[brotli] skompresowano ${zrobione} plików w ${((Date.now() - start) / 1000).toFixed(1)} s`);
console.log(`[brotli] ${kb(przed)} KB → ${kb(po)} KB  (-${kb(przed - po)} KB, -${((1 - po / przed) * 100).toFixed(0)}%)`);
if (pominiete) console.log(`[brotli] pominięto ${pominiete} plików (za małe lub bez zysku)`);
if (usuniete) console.log(`[brotli] usunięto ${usuniete} nieaktualnych plików .br`);

usunSmieciSystemowe();
skopiujHtaccess();
