#!/usr/bin/env node
/**
 * Przeskalowanie zdjęć galerii do rozsądnej szerokości.
 *
 * Przy output:"export" Next ma wymuszone images.unoptimized:true i NIE skaluje
 * niczego — telefon pobiera plik dokładnie taki, jaki leży w public/. Zdjęcia
 * z aparatu (do 6000 px, do 4,8 MB) były więc serwowane do kafelków o szerokości
 * ~344 px. Efekt: puste prostokąty przez kilka sekund na łączu mobilnym.
 *
 * 1600 px to kompromis: kafelek potrzebuje ~700 px, a lightbox (sizes="100vw")
 * na typowym laptopie ~1440–1600 px.
 *
 * Oryginały trafiają do media-src/ (gitignore) — a że pliki są też śledzone
 * przez git, powrót jest możliwy na dwa sposoby.
 */
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, renameSync, unlinkSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { execFileSync } from "node:child_process";

const KATALOGI = [
  "public/galeria/Projekt_MARS/webp",
  "public/galeria/Sciezka_filmowa/webp",
  "public/galeria/Wystawa/HarryPotter_TheExhibition/webp",
  "public/galeria/Ogolne/webp",
  "public/galeria/Wydarzenia/webp",
];
const MAX_SZEROKOSC = 1600;
const JAKOSC = 80;
const KOPIA = "media-src/galeria";

function szerokosc(plik) {
  try {
    const out = execFileSync("ffprobe", ["-v","error","-select_streams","v:0",
      "-show_entries","stream=width","-of","csv=p=0", plik], { encoding: "utf8" });
    return parseInt(out.trim(), 10) || 0;
  } catch { return 0; }
}

let przed = 0, po = 0, zmienione = 0, pominiete = 0;

for (const kat of KATALOGI) {
  if (!existsSync(kat)) continue;
  const kopiaKat = join(KOPIA, kat.replace("public/galeria/", ""));
  mkdirSync(kopiaKat, { recursive: true });

  for (const nazwa of readdirSync(kat)) {
    if (!nazwa.toLowerCase().endsWith(".webp")) continue;
    const plik = join(kat, nazwa);
    const rozmiar = statSync(plik).size;
    const w = szerokosc(plik);
    przed += rozmiar;

    if (w && w <= MAX_SZEROKOSC) { po += rozmiar; pominiete++; continue; }

    const zapas = join(kopiaKat, nazwa);
    if (!existsSync(zapas)) copyFileSync(plik, zapas);

    const png = join(kopiaKat, nazwa + ".tmp.png");
    const wynik = join(kopiaKat, nazwa + ".tmp.webp");
    try {
      execFileSync("dwebp", ["-quiet", plik, "-o", png]);
      execFileSync("cwebp", ["-quiet","-q",String(JAKOSC),"-m","6","-resize",String(MAX_SZEROKOSC),"0", png, "-o", wynik]);
      const nowy = statSync(wynik).size;
      if (nowy < rozmiar) { renameSync(wynik, plik); po += nowy; zmienione++; }
      else { unlinkSync(wynik); po += rozmiar; pominiete++; }
    } catch (e) {
      console.error(`[galeria] pominięto ${nazwa}: ${e.message.slice(0, 60)}`);
      po += rozmiar; pominiete++;
    } finally { if (existsSync(png)) unlinkSync(png); }
  }
}

const mb = (b) => (b / 1048576).toFixed(1);
console.log(`[galeria] przeskalowano ${zmienione}, pominięto ${pominiete}`);
console.log(`[galeria] ${mb(przed)} MB → ${mb(po)} MB  (-${mb(przed - po)} MB, -${((1 - po / przed) * 100).toFixed(0)}%)`);
console.log(`[galeria] oryginały: ${KOPIA}/`);
