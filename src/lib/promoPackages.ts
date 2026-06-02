import {
  COMBINED_PROMO_BOOKING_CATEGORY,
  K360_MARS_PROMO_BOOKING_CATEGORY,
} from "@/lib/booking";

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

// Both promo packages, in a fixed order, shown on every attraction page.
export const PROMO_PACKAGES: Record<PromoLocale, PromoPackage[]> = {
  pl: [
    {
      badge: "Pakiet",
      title: "K360 + Projekt: MARS",
      subtitle:
        "Pakiet promocyjny łączący projekcję K360 z Projektem MARS — dwie atrakcje w jednej cenie.",
      details: ["Dwie atrakcje w jednym dniu"],
      priceLabel: "Cena normalna",
      price: "89,00 zł",
      savings: "Oszczędzasz 29,00 zł",
      savingsPercent: "25%",
      reducedPriceLabel: "Cena ulgowa",
      reducedPrice: "79,00 zł",
      reducedSavings: "Oszczędzasz 19,00 zł",
      reducedSavingsPercent: "19%",
      button: "Wybierz pakiet",
      category: K360_MARS_PROMO_BOOKING_CATEGORY,
    },
    {
      badge: "Pakiet",
      title: "Ścieżka + Projekcja K360",
      subtitle:
        "Jeden duży pakiet promocyjny, który łączy zwiedzanie Ścieżki filmowej z projekcją K360.",
      details: ["Około 3 godzin łącznie ze zwiedzaniem i seansem"],
      priceLabel: "Cena normalna",
      price: "119,00 zł",
      savings: "Oszczędzasz 9,00 zł",
      savingsPercent: "7%",
      reducedPriceLabel: "Cena ulgowa",
      reducedPrice: "99,00 zł",
      reducedSavings: "Oszczędzasz 9,00 zł",
      reducedSavingsPercent: "8%",
      button: "Wybierz pakiet",
      category: COMBINED_PROMO_BOOKING_CATEGORY,
    },
  ],
  en: [
    {
      badge: "Package",
      title: "K360 + Mars Project",
      subtitle:
        "Promotional package combining the K360 projection with the Mars Project — two attractions at one price.",
      details: ["Two attractions in a single day"],
      priceLabel: "Standard price",
      price: "89.00 PLN",
      savings: "You save 29.00 PLN",
      savingsPercent: "25%",
      reducedPriceLabel: "Reduced price",
      reducedPrice: "79.00 PLN",
      reducedSavings: "You save 19.00 PLN",
      reducedSavingsPercent: "19%",
      button: "Choose package",
      category: K360_MARS_PROMO_BOOKING_CATEGORY,
    },
    {
      badge: "Package",
      title: "Film Path + K360 projection",
      subtitle:
        "One large promotional package that combines the Film Path visit with a K360 projection.",
      details: ["About 3 hours in total with the visit and screening"],
      priceLabel: "Standard price",
      price: "119.00 PLN",
      savings: "You save 9.00 PLN",
      savingsPercent: "7%",
      reducedPriceLabel: "Reduced price",
      reducedPrice: "99.00 PLN",
      reducedSavings: "You save 9.00 PLN",
      reducedSavingsPercent: "8%",
      button: "Choose package",
      category: COMBINED_PROMO_BOOKING_CATEGORY,
    },
  ],
  pt: [
    {
      badge: "Pacote",
      title: "K360 + Projeto MARS",
      subtitle:
        "Pacote promocional que combina a projeção K360 com o Projeto Mars — duas atrações num só preço.",
      details: ["Duas atrações no mesmo dia"],
      priceLabel: "Preço normal",
      price: "89,00 PLN",
      savings: "Poupa 29,00 PLN",
      savingsPercent: "25%",
      reducedPriceLabel: "Preço reduzido",
      reducedPrice: "79,00 PLN",
      reducedSavings: "Poupa 19,00 PLN",
      reducedSavingsPercent: "19%",
      button: "Escolher pacote",
      category: K360_MARS_PROMO_BOOKING_CATEGORY,
    },
    {
      badge: "Pacote",
      title: "Percurso + Projeção K360",
      subtitle:
        "Um grande pacote promocional que junta a visita ao Percurso de filmagem com a projeção no K360.",
      details: ["Cerca de 3 horas no total com visita e sessão"],
      priceLabel: "Preço normal",
      price: "119,00 PLN",
      savings: "Poupa 9,00 PLN",
      savingsPercent: "7%",
      reducedPriceLabel: "Preço reduzido",
      reducedPrice: "99,00 PLN",
      reducedSavings: "Poupa 9,00 PLN",
      reducedSavingsPercent: "8%",
      button: "Escolher pacote",
      category: COMBINED_PROMO_BOOKING_CATEGORY,
    },
  ],
};
