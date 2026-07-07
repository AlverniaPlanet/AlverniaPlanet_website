# Formularz kontaktowy (/kontakt) → e-mail

Strona jest **statyczna** (`output: "export"`), więc formularz kontaktowy nie ma
serwera Next w runtime. Wysyła POST na endpoint z `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`.
Backendem jest **Google Apps Script**, który wysyła maila na `rezerwacje@alverniaplanet.com`.

Przepływ:

```
/kontakt (statyczny)  ──POST (form-urlencoded, no-cors)──▶  Google Apps Script  ──MailApp──▶  rezerwacje@alverniaplanet.com
```

## 1. Utwórz skrypt
1. Wejdź na **https://script.google.com** (zalogowany na konto, z którego ma wychodzić mail — najlepiej firmowe Google Workspace Alvernia Planet).
2. **Nowy projekt**.
3. Wklej całą zawartość pliku [`contact-form.gs`](contact-form.gs) (nadpisz przykładowy `myFunction`).
4. (Opcjonalnie) zmień `RECIPIENT`, jeśli mail ma iść gdzie indziej.
5. Zapisz (ikona dyskietki).

## 2. Wdróż jako Web App
1. Prawy górny róg: **Wdróż → Nowe wdrożenie**.
2. Typ (koło zębate) → **Aplikacja internetowa**.
3. Ustaw:
   - **Wykonuj jako:** *Ja* (Twoje konto),
   - **Kto ma dostęp:** *Wszyscy* (Anyone).
4. **Wdróż** → przy pierwszym razie **autoryzuj** skrypt (zgoda na wysyłkę maila w Twoim imieniu).
5. Skopiuj **URL aplikacji internetowej** (kończy się na `/exec`).

> Test: wejdź tym URL-em w przeglądarce — powinno wyświetlić „Alvernia Planet contact endpoint OK" (to `doGet`).

## 3. Wskaż endpoint we froncie
W `.env.local`:

```env
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Po zmianie **zrestartuj `next dev`** (zmienne `NEXT_PUBLIC_` wczytują się przy starcie),
a na produkcji **przebuduj i wdróż** (`next build` → deploy `out/`).

## 4. Test end-to-end
Wejdź na `/kontakt`, wyślij testową wiadomość — powinna dojść na `rezerwacje@alverniaplanet.com`.
W mailu jest `reply-to` ustawiony na adres nadawcy, więc odpowiadasz mu bezpośrednio „Odpowiedz".

## Uwagi
- Formularz wysyła w trybie `no-cors` (statyczny front + Apps Script), więc przeglądarka nie
  odczyta odpowiedzi serwera — komunikat „Wysłano" pojawia się, gdy żądanie wyszło poprawnie.
  Realną dostawę potwierdzasz odbiorem maila.
- Limit Apps Script (darmowe konto Gmail): ~100 maili/dobę; Google Workspace: ~1500/dobę —
  dla formularza kontaktowego z zapasem.
- Gdyby mail wpadał do spamu: dodaj nadawcę do kontaktów albo rozważ wysyłkę przez firmowy
  adres w Google Workspace.
