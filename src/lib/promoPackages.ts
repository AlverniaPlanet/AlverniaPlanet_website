import {
  ALL_ATTRACTIONS_BOOKING_SERVICES,
} from "@/lib/booking";

import { type Locale } from "@/lib/localizedRoutes";

// Zrodlo prawdy dla listy jezykow to wspolny typ Locale (pl/en/pt/de/zh).
export type PromoLocale = Locale;

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
  service?: string;
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
      // Cena normalna, nie ulgowa: pasek pokazuje 119 zł jako cenę główną,
      // więc koszyk musi otworzyć się na tej samej taryfie.
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.normal,
      heroLead: "Jeden bilet",
      heroHighlight: "Wszystkie atrakcje",
      promoStripLabel: "Taniej niż osobno",
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
      // Cena normalna, nie ulgowa: pasek pokazuje 119 zł jako cenę główną,
      // więc koszyk musi otworzyć się na tej samej taryfie.
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.normal,
      heroLead: "One ticket",
      heroHighlight: "All attractions",
      promoStripLabel: "Cheaper than separately",
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
      // Cena normalna, nie ulgowa: pasek pokazuje 119 zł jako cenę główną,
      // więc koszyk musi otworzyć się na tej samej taryfie.
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.normal,
      heroLead: "Um bilhete",
      heroHighlight: "Todas as atrações",
      promoStripLabel: "Mais barato do que em separado",
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
  de: [
    {
      badge: "Paket",
      title: "Ticket für alle Attraktionen",
      subtitle:
        "Drei Filmabenteuer an einem Tag. Betreten Sie das größte 360°-Kino Europas, spielen Sie die Hauptrolle in einer Mars-Mission und entdecken Sie die Filmkuppeln mit echten Filmkulissen – alles mit einem einzigen Ticket, günstiger als einzeln.",
      details: ["Drei Attraktionen zu einem Preis", "Gültig an einem Tag"],
      priceLabel: "Regulärer Preis",
      price: "119,00 PLN",
      savings: "Sie sparen 78,00 PLN",
      savingsPercent: "40%",
      reducedPriceLabel: "Ermäßigter Preis",
      reducedPrice: "99,00 PLN",
      reducedSavings: "Sie sparen 68,00 PLN",
      reducedSavingsPercent: "41%",
      button: "Ticket kaufen",
      // Cena normalna, nie ulgowa: pasek pokazuje 119 PLN jako cenę główną,
      // więc koszyk musi otworzyć się na tej samej taryfie.
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.normal,
      heroLead: "Ein Ticket",
      heroHighlight: "Alle Attraktionen",
      promoStripLabel: "Günstiger als einzeln",
      promoStripPrice: "Schon ab 99 PLN",
      tilesIntro: "zum Aktionspreis, darunter:",
      tiles: [
        {
          verb: "Entdecken",
          title: "Filmpfad",
          body: "Ein Rundgang hinter die Kulissen: Filmsets, Requisiten und die Technik, mit der Kino gemacht wird.",
          accent: "cyan",
        },
        {
          verb: "Erleben",
          title: "Kino 360",
          body: "Europas größte Projektionskuppel – Bild und Ton rund um Sie herum.",
          accent: "red",
        },
        {
          verb: "Mitspielen",
          title: "Projekt: MARS",
          body: "Drehen Sie Ihren eigenen Kurzfilm in einer professionellen Mars-Kulisse.",
          accent: "orange",
        },
      ],
    },
  ],
  zh: [
    {
      badge: "套票",
      title: "全项目通票",
      subtitle:
        "一天畅享三段电影之旅。走进欧洲最大的 360° 影院，在火星任务中担纲主角，漫游拥有真实拍摄场景的电影穹顶——一票全含，比单独购买更划算。",
      details: ["三大项目，一个价格", "限当日使用"],
      priceLabel: "全价票",
      price: "119.00 PLN",
      savings: "立省 78.00 PLN",
      savingsPercent: "40%",
      reducedPriceLabel: "优惠票",
      reducedPrice: "99.00 PLN",
      reducedSavings: "立省 68.00 PLN",
      reducedSavingsPercent: "41%",
      button: "购买门票",
      // Cena normalna, nie ulgowa: pasek pokazuje 119 PLN jako cenę główną,
      // więc koszyk musi otworzyć się na tej samej taryfie.
      service: ALL_ATTRACTIONS_BOOKING_SERVICES.normal,
      heroLead: "一张门票",
      heroHighlight: "畅玩全部项目",
      promoStripLabel: "比单独购买更划算",
      promoStripPrice: "99 PLN 起",
      tilesIntro: "享优惠价，包含：",
      tiles: [
        {
          verb: "探索",
          title: "电影之路",
          body: "深入幕后的参观路线：拍摄场景、道具，以及支撑电影的技术。",
          accent: "cyan",
        },
        {
          verb: "体验",
          title: "Kino 360 影院",
          body: "欧洲最大的投影穹顶，画面与声音将您环绕。",
          accent: "red",
        },
        {
          verb: "出演",
          title: "Projekt: MARS",
          body: "在专业的火星布景中拍摄属于您自己的短片。",
          accent: "orange",
        },
      ],
    },
  ],
};
