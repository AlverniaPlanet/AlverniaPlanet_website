// ---------------------------------------------------------------------------
// Supabase Edge Function: leads
// Bezpieczny zapis leadów do tabeli `Lead` (dokładnie taka nazwa, nie `leads`).
//
// Dlaczego Edge Function, a nie Next.js API Route?
//   Projekt jest statyczny (output: "export"), więc nie ma serwera Next.js
//   w runtime. Ta funkcja to backend po stronie Supabase.
//
// Bezpieczeństwo:
//   - Klucz service-role czytany jest wyłącznie z ENV tej funkcji
//     (patrz getServiceRoleKey). NIGDY nie trafia do frontendu ani do repo.
//   - RLS na tabeli `Lead` zostaje włączone; publiczny użytkownik nie może
//     czytać ani pisać bezpośrednio. Insert idzie wyłącznie tędy (service_role).
//
// Deploy: nazwij funkcję dokładnie `leads` i wdróż z wyłączonym „Verify JWT".
// ---------------------------------------------------------------------------

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

// Pełna treść zgody na kontakt zapisywana w kolumnie consent_text.
// Musi być identyczna z treścią checkboxa B na stronie /aplikacje/identyfikacja.
const CONSENT_TEXT =
  "Wyrażam zgodę na kontakt ze strony Alvernia Planet w celu przedstawienia informacji o ofercie Alvernia Planet. Wiem, że zgodę mogę wycofać w dowolnym momencie.";

// Dozwolone originy (CORS). Dostosuj do swoich domen.
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://alverniaplanet.com",
  "https://www.alverniaplanet.com",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
    "Vary": "Origin",
  };
}

// Klucz service-role z ENV funkcji — próbujemy trzech źródeł, żeby działało
// niezależnie od tego, czy projekt ma stary czy nowy system kluczy API:
//   1) SUPABASE_SERVICE_ROLE_KEY — auto-wstrzykiwany przez Supabase (legacy).
//   2) SUPABASE_SECRET_KEYS — JSON { "default": "sb_secret_..." } (nowe klucze).
//   3) LEAD_SERVICE_KEY — sekret ustawiony ręcznie (Edge Functions → Secrets).
// Żadne z nich nie jest w repo ani we froncie.
function getServiceRoleKey(): string | null {
  const direct = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (direct) return direct;

  const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeysRaw) {
    try {
      const parsed = JSON.parse(secretKeysRaw) as Record<string, string>;
      if (parsed.default) return parsed.default;
    } catch (error) {
      console.error("[leads] Invalid SUPABASE_SECRET_KEYS JSON:", error);
    }
  }

  const custom = Deno.env.get("LEAD_SERVICE_KEY");
  if (custom) return custom;

  console.error(
    "[leads] Brak service-role key (SUPABASE_SERVICE_ROLE_KEY / SUPABASE_SECRET_KEYS.default / LEAD_SERVICE_KEY).",
  );
  return null;
}

const LeadSchema = z.object({
  source: z.enum(["mars", "identyfikacja"]),
  first_name: z.string().trim().min(2, "Imię musi mieć minimum 2 znaki."),
  last_name: z.string().trim().min(2, "Nazwisko musi mieć minimum 2 znaki."),
  email: z.string().trim().toLowerCase().email("Niepoprawny adres email."),
  consent_contact: z.literal(true, {
    errorMap: () => ({ message: "Zgoda na kontakt jest wymagana." }),
  }),
  // Wejście/atrakcja wybrana przez gościa (np. "Kino 360", "MARS", "FILMWORLD", "VIP").
  entrance: z.string().trim().min(1).max(60).optional(),
  page_url: z.string().url().optional(),
});

export default {
  async fetch(req: Request) {
    const cors = corsHeaders(req.headers.get("Origin"));

    // Preflight CORS
    if (req.method === "OPTIONS") {
      return new Response("ok", { status: 200, headers: cors });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Parsowanie JSON
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Nieprawidłowy JSON." }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Walidacja (zod)
    const parsed = LeadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Błędne dane.", issues: parsed.error.flatten() }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }
    const data = parsed.data;

    // Konfiguracja backendu (URL auto-wstrzykiwany, klucz z getServiceRoleKey).
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = getServiceRoleKey();
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Brak konfiguracji Supabase." }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Klient z service_role — TYLKO po stronie serwera (ta funkcja) — omija RLS.
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Insert dokładnie pod istniejące kolumny tabeli `Lead`.
    // (czas zgody = created_at, ustawiany domyślnie przez bazę)
    const { error } = await supabase.from("Lead").insert({
      source: data.source,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      consent_contact: data.consent_contact,
      consent_text: CONSENT_TEXT,
      entrance: data.entrance ?? null,
      status: "new",
      page_url: data.page_url ?? null,
    });

    if (error) {
      console.error("[leads] Supabase insert error:", error);
      return new Response(JSON.stringify({ error: "Błąd zapisu do bazy." }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 201,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
