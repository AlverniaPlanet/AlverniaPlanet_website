/* --- Przewijanie BEZ kotwic w adresie -----------------------------------------
   Decyzja obiektu (05.10.2026): podstrona nie ma adresów sekcji — przyciski
   przewijają do celu, ale pasek adresu zostaje `/mars-colonization`,
   bez `#mars-misja` czy `#mars-zapis`. Dlatego sekcje NIE mają `id` (byłyby
   adresowalne), a cel wskazuje atrybut `data-cel-przewiniecia`.

   Osobny moduł, a nie funkcja w `page.tsx`: plik strony Next.js nie może
   eksportować niczego poza komponentem i konfiguracją, a z tej funkcji
   korzysta też sekcja „Dla kogo" (`DlaKogo.tsx`).

   Płynność bierze się z `scroll-behavior` korzenia w `globals.css` — tam też
   „ogranicz ruch" przełącza na skok, a `scroll-padding-top` odsuwa cel spod
   przyklejonego paska. Fokus idzie za przewinięciem (sekcja ma
   `tabIndex={-1}`), inaczej klawiatura zostałaby w miejscu, z którego
   przyszło kliknięcie. */
export type CelPrzewiniecia = "misja" | "zapis" | "b2b";

export function przewinDo(cel: CelPrzewiniecia) {
  const sekcja = document.querySelector<HTMLElement>(`[data-cel-przewiniecia="${cel}"]`);
  if (!sekcja) return;
  sekcja.scrollIntoView({ block: "start" });
  sekcja.focus({ preventScroll: true });
}
