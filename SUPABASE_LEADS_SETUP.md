# Podpięcie leadów do Supabase (Edge Function)

Projekt jest **statyczny** (`next.config.mjs` → `output: "export"`), więc zapis leadów
idzie przez **Supabase Edge Function `leads`**, a NIE przez Next.js API Route
(w statycznym eksporcie nie ma serwera Next w runtime).

Przepływ:

```
Frontend (statyczny)  ──POST──▶  Edge Function (backend)  ──insert (service_role)──▶  tabela Lead
        publishable key            zod + service_role                 RLS ON
```

> **Stan wdrożenia:** funkcja jest wdrożona pod slugiem **`bright-api`** (nie `leads`).
> Front celuje w nią przez `NEXT_PUBLIC_SUPABASE_LEADS_FN=bright-api` (patrz sekcja 2).
> Jeśli kiedyś wdrożysz ją jako `leads`, ustaw ten sam var na `leads` (lub usuń — domyślnie `leads`).

---

## 0. ⚠️ Zrotuj klucz (WAŻNE)
Stary `sb_secret_...` (service_role) został przypadkowo wklejony w czacie — **zroluj go**:
Supabase → **Settings → API keys → odśwież** service_role / secret. Stary przestanie działać.
Po rotacji zaktualizuj sekret `LEAD_SERVICE_KEY` (sekcja 1).

## 1. Sekrety — tylko po stronie Supabase
Ten projekt korzysta z **nowego systemu kluczy API** — `SUPABASE_SERVICE_ROLE_KEY` **NIE** jest
tu auto-wstrzykiwany (funkcja zwracała `500 „Brak konfiguracji"`). Dlatego klucz podajemy jawnie
jako sekret funkcji **`LEAD_SERVICE_KEY`** (nazwa bez prefiksu `SUPABASE_`, bo ten jest zarezerwowany):

```bash
# CLI:
supabase secrets set LEAD_SERVICE_KEY="sb_secret_...(service-role)" --project-ref sejtwwnspgryyyikittm
# lub w Dashboard → Edge Functions → Secrets → Add new secret
```

Funkcja czyta klucz z trzech źródeł (patrz `getServiceRoleKey` w `index.ts`):
`SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_SECRET_KEYS.default` → `LEAD_SERVICE_KEY`.
Klucz service-role/secret **nigdy** nie trafia do `.env.local`, `src/`, komponentów ani buildu frontu.

## 2. Front — `.env.local` (tylko publiczne klucze)
```env
NEXT_PUBLIC_SUPABASE_URL=https://sejtwwnspgryyyikittm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key ze Supabase → Settings → API keys>
NEXT_PUBLIC_SUPABASE_LEADS_FN=bright-api   # slug wdrożonej funkcji (domyślnie "leads")
```
Wszystkie są jawne i bezpieczne w przeglądarce. `.env.local` jest w `.gitignore`.
Po zmianie `.env.local` zrestartuj `next dev` (zmienne `NEXT_PUBLIC_` wczytują się przy starcie).

## 3. Deploy funkcji
Bez interaktywnego `login` — przez Personal Access Token (Dashboard → konto → Access Tokens):
```bash
export SUPABASE_ACCESS_TOKEN="sbp_...(token)"
npx supabase functions deploy leads --no-verify-jwt --project-ref sejtwwnspgryyyikittm
```
Albo w Dashboard → Edge Functions → *Deploy a new function* → Via Editor (wklej `index.ts`, „Verify JWT" OFF).
`--no-verify-jwt` / „Verify JWT OFF" jest konieczne — publishable key nie jest tokenem JWT.
`zod` i `@supabase/supabase-js` pobiera sama funkcja (Deno `npm:`), nie projekt Next.

## 4. RLS
Tabela `Lead` ma włączone RLS. **Nie** dodawaj polityk `SELECT` ani `INSERT` dla roli `anon`.
Publiczny użytkownik nie czyta leadów; insert idzie wyłącznie przez Edge Function (service_role, omija RLS).

## 5. Test endpointu (curl)
```bash
curl -i -X POST "https://sejtwwnspgryyyikittm.supabase.co/functions/v1/bright-api" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "identyfikacja",
    "first_name": "Jan",
    "last_name": "Kowalski",
    "email": "jan@gmail.com",
    "consent_contact": true,
    "page_url": "http://localhost:3000/aplikacje/identyfikacja"
  }'
```
Oczekiwane: `HTTP/2 201` + `{"ok":true}` i nowy wiersz w Table Editor → `Lead`.

Kody błędów: `400` (błędne dane / brak zgody), `404` (zły slug / niewdrożona), `405` (zła metoda),
`500` (brak klucza service-role albo błąd bazy). Kolumny insertu = dokładnie kolumny tabeli
(`source, first_name, last_name, email, consent_contact, consent_text, entrance, status, page_url`;
`id` i `created_at` ustawia baza — bez `consent_given_at`).

`entrance` = wybrana atrakcja/wejście z kiosku identyfikacji (np. „Kino 360", „MARS", „FILMWORLD", „VIP").
Kolumnę dodaj w bazie: `alter table "Lead" add column if not exists entrance text;`

## 6. Zgody (dwa osobne checkboxy na /aplikacje/identyfikacja)
- **A (wymagana):** „Akceptuję wejście na teren obiektu Alvernia Planet i obowiązujące na nim zasady." — steruje flow identyfikacji.
- **B (opcjonalna):** „Wyrażam zgodę na kontakt ze strony Alvernia Planet…" — steruje zapisem leada.

Lead trafia do tabeli `Lead` **tylko** gdy zaznaczono B. Jeśli B nie jest zaznaczone,
identyfikacja działa dalej, ale rekord leadowy nie jest zapisywany.
Treść `CONSENT_TEXT` w funkcji jest identyczna z treścią checkboxa B.
