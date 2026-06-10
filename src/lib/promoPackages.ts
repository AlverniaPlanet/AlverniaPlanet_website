import { ALL_ATTRACTIONS_BOOKING_CATEGORY } from "@/lib/booking";

export type PromoLocale = "pl" | "en" | "pt";

export type PromoPackage = {
  badge: string;
  title: string;
  subtitle: string;
  details: string[];
  priceLabel: string;
  price: string;
  savings: string;
  savingsPercent: string;
  reducedPriceLabel: string;
  reducedPrice: string;
  reducedSavings: string;
  reducedSavingsPercent: string;
  button: string;
  category: string;
};

// Jeden pakiet: bilet na wszystkie 3 atrakcje (K360 + MARS + Ścieżka).
// ⚠️ Zweryfikuj ceny normalny/oszczędności — założyłem 119,00 zł normalny / 99,00 zł ulgowy
//    co daje oszczędność ~50% względem 3 osobnych biletów (49 + 69 + 79 = 197 zł normalny).
export const PROMO_PACKAGES: Record<PromoLocale, PromoPackage[]> = {
  pl: [
    {
      badge: "Pakiet",
      title: "Bilet na wszystkie atrakcje",
      subtitle:
        "Jeden bilet, trzy atrakcje: Kino K360, Projekt: MARS i Ścieżka filmowa — najtaniej i najwygodniej.",
      details: ["Trzy atrakcje w jednej cenie", "Ważny w jednym dniu"],
      priceLabel: "Cena normalna",
      price: "119,00 zł",
      savings: "Oszczędzasz 78,00 zł",
      savingsPercent: "40%",
      reducedPriceLabel: "Cena ulgowa",
      reducedPrice: "99,00 zł",
      reducedSavings: "Oszczędzasz 68,00 zł",
      reducedSavingsPercent: "41%",
      button: "Kup bilet",
      category: ALL_ATTRACTIONS_BOOKING_CATEGORY,
    },
  ],
  en: [
    {
      badge: "Package",
      title: "All-attractions ticket",
      subtitle:
        "One ticket, three attractions: K360 Cinema, Mars Project and the Film Path — the cheapest and most convenient option.",
      details: ["Three attractions, one price", "Valid on a single day"],
      priceLabel: "Standard price",
      price: "119.00 PLN",
      savings: "You save 78.00 PLN",
      savingsPercent: "40%",
      reducedPriceLabel: "Reduced price",
      reducedPrice: "99.00 PLN",
      reducedSavings: "You save 68.00 PLN",
      reducedSavingsPercent: "41%",
      button: "Buy ticket",
      category: ALL_ATTRACTIONS_BOOKING_CATEGORY,
    },
  ],
  pt: [
    {
      badge: "Pacote",
      title: "Bilhete para todas as atrações",
      subtitle:
        "Um bilhete, três atrações: Cinema K360, Projeto MARS e Percurso de filmagem — a opção mais económica e prática.",
      details: ["Três atrações num só preço", "Válido num único dia"],
      priceLabel: "Preço normal",
      price: "119,00 PLN",
      savings: "Poupa 78,00 PLN",
      savingsPercent: "40%",
      reducedPriceLabel: "Preço reduzido",
      reducedPrice: "99,00 PLN",
      reducedSavings: "Poupa 68,00 PLN",
      reducedSavingsPercent: "41%",
      button: "Comprar bilhete",
      category: ALL_ATTRACTIONS_BOOKING_CATEGORY,
    },
  ],
};
