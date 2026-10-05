# System sprzedaży biletów — Bookero ↔ Iksoris

Serwis obsługuje **dwa** systemy biletowe. Przełączenie to zmiana **jednej stałej**:

```ts
// src/lib/booking.ts
export const SYSTEM_SPRZEDAZY: SystemSprzedazy = "bookero";  // ← "bookero" | "iksoris"
```

Stan na 01.09.2026: **`"iksoris"`** — Iksoris odpowiada (wszystkie adresy HTTP 200).

Osadzony widget Bookero został **usunięty całkowicie** z `/rezerwuj` i `/grupy` —
Iksoris jest osobnym serwisem i nie da się go zagnieździć, więc obie strony kierują
tam przyciskiem. Komponenty `BookeroEmbed` i `bookeroRuntime` zostają w repo na
wypadek powrotu, ale nic ich już nie renderuje.

---

## Jak przywrócić Iksorisa

1. Sprawdź, czy Iksoris odpowiada — musi zwracać **200**, nie 423:
   ```bash
   curl -sS -o /dev/null -w "%{http_code}\n" https://bilety.alverniaplanet.com
   ```
2. Zmień stałą na `"iksoris"` w `src/lib/booking.ts`.
3. `npm run build` i wgraj `out/`.

Nic więcej. Wszystkie ~130 miejsc wywołania przechodzą przez wspólne API
(`buildBookingPath`, `bookingHomeHref`, `bookingPortalHref`, `heroBookingHref`),
a `<BookingLink>` sam wybiera `<Link>` dla tras wewnętrznych i `<a>` dla adresów
zewnętrznych.

---

## Deep linki Iksorisa (zweryfikowane w panelu, wrzesień 2026)

Format: `https://bilety.alverniaplanet.com/rezerwacja/termin.html?idl=0&idg=0&idw=N&d=3`

| `idw` | atrakcja | pełny adres |
|---|---|---|
| 1 | Bilet na wszystkie atrakcje | `…/rezerwacja/termin.html?idl=0&idg=0&idw=1&d=3` |
| 2 | Kino 360 | `…/rezerwacja/termin.html?idl=0&idg=0&idw=2&d=3` |
| 3 | Filmworld | `…/rezerwacja/termin.html?idl=0&idg=0&idw=3&d=3` |
| 4 | Projekt: MARS | `…/rezerwacja/termin.html?idl=0&idg=0&idw=4&d=3` |

Dodatkowo:

| przeznaczenie | adres |
|---|---|
| Główne CTA „Kup bilet" (navbar, stopka, czat) | `https://bilety.alverniaplanet.com` |
| Hero na stronie głównej — lista wydarzeń (`d=3`) | `https://bilety.alverniaplanet.com/rezerwacja/wydarzenie.html?d=3` |
| Hero na `/grupy` — ścieżka edukacyjna (`d=4`) | `https://bilety.alverniaplanet.com/rezerwacja/wydarzenie.html?d=4` |

### Mapowanie usługi → `idw`

Atrakcję rozpoznajemy po **nazwie usługi z panelu Bookero** (funkcja
`iksorisAttractionFor` w `booking.ts`). Kolejność testów ma znaczenie:

1. zawiera `dla nauczycieli` → **null** (strona główna) — bilet 0 zł nie może
   trafić na płatny pakiet 119 zł
2. zaczyna się od `BILET NA WSZYSTKIE ATRAKCJE` → `idw=1`
3. zaczyna się od `Kino 360` → `idw=2`
4. zaczyna się od `Filmworld` → `idw=3`
5. zaczyna się od `Projekt: MARS` → `idw=4`
6. w pozostałych przypadkach → **null** (strona główna)

⚠️ Punkt 2 **musi** wyprzedzać punkt 3: nazwa
`BILET NA WSZYSTKIE ATRAKCJE - One Step Beyond` zawiera tytuł seansu Kino 360.
Przetestowane na wszystkich 25 nazwach usług z panelu — 0 błędów.

---

## Czego Iksoris NIE odtwarza

Mapowanie jest **stratne**. Cztery linki adresują wyłącznie atrakcję:

| funkcja pod Bookero | pod Iksorisem |
|---|---|
| bilet normalny / ulgowy / grupowy | brak rozróżnienia |
| konkretny seans K360 (4 filmy) | wszystkie → `idw=2` |
| liczba biletów (`quantity`) | brak |
| automatyczny wybór (`autopick`) | brak |
| promocja pon./wt. (`promoday`) | **brak — mechanizm znika** |
| bilet nauczycielski 0 zł | brak — kierowany na stronę główną |
| Noc Filmożerców | brak — kierowany na stronę główną |
| rezerwacja grupowa | **brak — brak linku do grup** |

---

## Znane blokery (stan 01.09.2026)

1. **Iksoris zwracał HTTP 423 „Przerwa techniczna"** — strona główna i deep linki.
   To był powód powrotu na Bookero.
2. **`/grupy` sprzedaje wyłącznie przez widget Bookero** (kategoria „Bilet grupowy").
   Iksoris nie ma odpowiednika — potrzebny osobny link do rezerwacji grupowej.
3. **`/rezerwuj` (+ `/en/reserve`, `/pt/reservar`)** hostuje widget Bookero, jest
   kanoniczna i siedzi w sitemapie. Pod Iksorisem stawała się osierocona, ale dalej
   sprzedawała starym systemem.
4. **`.htaccess:28-30`** przekierowuje `/bilety → /rezerwuj`. Pod Iksorisem te stare
   adresy prowadziły do Bookero.
5. **`npm run build` zależy od API Bookero** (`scripts/fetch-prices.mjs` odpytuje
   `plugin.bookero.pl`). Po wyłączeniu Bookero build padnie — odciąć krok `prices`
   od `build` przed ostatecznym przejściem.
6. **`idl=0`** — nie potwierdzono, czy to identyfikator języka. Jeśli tak, wersje
   EN i PT kierują do polskiego interfejsu zakupu.
7. **GA4 nie ma konfiguracji cross-domain** — po przejściu na zewnętrzną domenę
   lejek rozjedzie się na dwie sesje.

---

## Pliki objęte przełącznikiem

| plik | co robi |
|---|---|
| `src/lib/booking.ts` | przełącznik + oba mapowania + wspólne API |
| `src/app/components/BookingLink.tsx` | wybiera `<Link>` albo `<a>` po kształcie adresu |
| `src/app/appbar.tsx` | CTA „Kup bilet!" w navbarze |
| `src/app/components/Footer.tsx` | „Bilety i rezerwacje" w 3 lokalach |
| `src/app/HomeClient.tsx` | hero, kafelki biletów, pakiet |
| `src/app/kontakt/page.tsx` | zewnętrzny portal (nowa karta) |
| `src/app/aplikacje/identyfikacja-online/page.tsx` | zewnętrzny portal (nowa karta) |
| `src/app/components/SimpleChatWidget.tsx` | akcje czatu (komponent nieużywany) |
| `src/app/components/FloatingBookingButton.tsx` | pływający przycisk (nierenderowany) |
