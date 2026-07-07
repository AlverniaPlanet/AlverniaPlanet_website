import {
  ALL_ATTRACTIONS_BOOKING_CATEGORY,
  ALL_ATTRACTIONS_BOOKING_SERVICES,
} from "@/lib/booking";

export type PromoLocale = "pl" | "en" | "pt";

export type PromoTile = {
  verb: string;
  title: string;
  body: string;
  accent: "cyan" | "red" | "orange";
};

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
  service?: string;
  autopick?: boolean;
  heroLead: string;
  heroHighlight: string;
  promoStripLabel: string;
  promoStripPrice: string;
  tilesIntro: string;
  tiles: PromoTile[];
};

// Jeden pakiet: bilet na wszystkie 3 atrakcje (K360 + MARS + Ścieżka).
// ⚠️ Zweryfikuj ceny normalny/oszczędności, założyłem 119,00 zł normalny / 99,00 zł ulgowy
//    co daje oszczędność ~50% względem 3 osobnych biletów (49 + 69 + 79 = 197 zł normalny).
export const PROMO_PACKAGES: Record<PromoLocale, PromoPackage[]> = {
  pl: [
    {
      badge: "Pakiet",
      title: "Bilet na wszystkie atrakcje",
      subtitle:
        "Trzy filmowe przygody w jeden dzień. Wejdź do największego kina 360 w Europie, zagraj główną rolę w marsjańskiej misji i zwiedź filmowe kopuły z planami zdjęciowymi, wszystko jednym biletem, taniej niż osobno.",
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
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.reduced,
      autopick: true,
      heroLead: "Jeden bilet",
      heroHighlight: "Wszystkie atrakcje",
      promoStripLabel: "Promocja do końca czerwca",
      promoStripPrice: "Już od 99 zł",
      tilesIntro: "w promocyjnej cenie, w tym:",
      tiles: [
        {
          verb: "Poznaj",
          title: "Ścieżkę filmową",
          body: "Zakulisowa trasa przez plany zdjęciowe, rekwizyty i technologię, której używa kino.",
          accent: "cyan",
        },
        {
          verb: "Przeżyj",
          title: "Kino 360",
          body: "Największa kopuła projekcyjna w Europie, obraz i dźwięk dookoła Ciebie.",
          accent: "red",
        },
        {
          verb: "Zagraj",
          title: "MARS",
          body: "Nakręć własny film na profesjonalnej, marsjańskiej scenografii.",
          accent: "orange",
        },
      ],
    },
  ],
  en: [
    {
      badge: "Package",
      title: "All-attractions ticket",
      subtitle:
        "Three cinematic adventures in one day. Step into Europe's largest 360° cinema, star in a Martian mission and explore the film domes with real movie sets, all on a single ticket, cheaper than buying separately.",
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
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.reduced,
      autopick: true,
      heroLead: "One ticket",
      heroHighlight: "All attractions",
      promoStripLabel: "Promo until end of June",
      promoStripPrice: "From 99 PLN",
      tilesIntro: "at the promo price, including:",
      tiles: [
        {
          verb: "Discover",
          title: "The Film Path",
          body: "A behind-the-scenes route through sets, props and the technology cinema runs on.",
          accent: "cyan",
        },
        {
          verb: "Experience",
          title: "K360 Cinema",
          body: "Europe's largest projection dome, image and sound all around you.",
          accent: "red",
        },
        {
          verb: "Play",
          title: "Project: MARS",
          body: "Shoot your own short film on a professional Martian set.",
          accent: "orange",
        },
      ],
    },
  ],
  pt: [
    {
      badge: "Pacote",
      title: "Bilhete para todas as atrações",
      subtitle:
        "Três aventuras de cinema num único dia. Entra no maior cinema 360° da Europa, protagoniza uma missão marciana e percorre as cúpulas de cinema com cenários reais, tudo num só bilhete, mais barato do que separado.",
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
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.reduced,
      autopick: true,
      heroLead: "Um bilhete",
      heroHighlight: "Todas as atrações",
      promoStripLabel: "Promo até final de junho",
      promoStripPrice: "A partir de 99 PLN",
      tilesIntro: "ao preço promocional, incluindo:",
      tiles: [
        {
          verb: "Descobre",
          title: "O Percurso de Cinema",
          body: "Um percurso pelos bastidores: cenários, adereços e a tecnologia que faz o cinema.",
          accent: "cyan",
        },
        {
          verb: "Vive",
          title: "Cinema K360",
          body: "A maior cúpula de projeção da Europa, imagem e som à tua volta.",
          accent: "red",
        },
        {
          verb: "Joga",
          title: "Projeto: MARS",
          body: "Grava a tua curta num cenário marciano profissional.",
          accent: "orange",
        },
      ],
    },
  ],
};
