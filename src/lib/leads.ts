// Helper klienta: wysyła leada do Supabase Edge Function `leads` (backend).
// NIE zapisuje bezpośrednio do bazy — insert robi funkcja brzegowa service-rolem.
// We froncie używamy tylko publicznych zmiennych (URL + anon/publishable key).

export type LeadSource = "mars" | "identyfikacja";

export type LeadInput = {
  source: LeadSource;
  first_name: string;
  last_name: string;
  email: string;
  consent_contact: boolean;
  entrance?: string; // wybrana atrakcja/wejście, np. "Kino 360", "MARS", "FILMWORLD", "VIP"
  page_url?: string;
};

export type SubmitLeadResult = { ok: true } | { ok: false; error: string };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Slug funkcji brzegowej z Dashboard → Edge Functions (domyślnie "leads").
// Ustaw NEXT_PUBLIC_SUPABASE_LEADS_FN, jeśli funkcja ma inny slug (np. "bright-api").
const LEADS_FN = process.env.NEXT_PUBLIC_SUPABASE_LEADS_FN || "leads";

export async function submitLead(input: LeadInput): Promise<SubmitLeadResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { ok: false, error: "Brak konfiguracji Supabase (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)." };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${LEADS_FN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // anon/publishable key jest publiczny — bezpieczny we froncie.
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: data.error ?? `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Błąd sieci." };
  }
}
