"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import { bookingHomeHref } from "@/lib/booking";
import { trackEvent } from "@/lib/analytics";
import { openCookieSettings } from "@/lib/consent";
import { getLocalizedPath, isBareChromeRoute, type Locale,
  INTL_LOCALES,
} from "@/lib/localizedRoutes";
type LinkItem = { label: string; href: string };
type Section = { title: string; links: LinkItem[] };
type PolicyLink = { label: string; href: string; highlight?: boolean };

const RUNMAGEDDON_SOCIAL_POLICY_LINKS = {
  rodo: "/stopka/RUNMAGEDDON/klauzula_rodo_social_runmageddon%20+%20JS.docx.pdf",
  contest: "/stopka/RUNMAGEDDON/regulamin_konkurs_social_runmageddon%20+%20JS.docx.pdf",
  stories: "/stopka/RUNMAGEDDON/regulamin_stories_obcy_runmageddon%20+%20JS.docx.pdf",
} as const;

const RUNMAGEDDON_FOOTER_POLICIES: Record<Locale, PolicyLink[]> = {
  pl: [
    { label: "Regulamin gry Runmageddon", href: "/stopka/runmageddon-game-regulamin.pdf", highlight: true },
    {
      label: "Polityka prywatności gry Runmageddon",
      href: "/stopka/runmageddon-game-polityka-prywatnosci.pdf",
      highlight: true,
    },
    {
      label: "Regulamin konkursu social Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.contest,
      highlight: true,
    },
    {
      label: "Klauzula RODO social Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.rodo,
      highlight: true,
    },
    {
      label: "Regulamin stories Obcy Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.stories,
      highlight: true,
    },
  ],
  en: [
    { label: "Runmageddon game rules", href: "/stopka/runmageddon-game-regulamin.pdf", highlight: true },
    {
      label: "Runmageddon game privacy policy",
      href: "/stopka/runmageddon-game-polityka-prywatnosci.pdf",
      highlight: true,
    },
    {
      label: "Runmageddon social contest rules",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.contest,
      highlight: true,
    },
    {
      label: "Runmageddon social GDPR clause",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.rodo,
      highlight: true,
    },
    {
      label: 'Runmageddon "Alien" stories rules',
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.stories,
      highlight: true,
    },
  ],
  pt: [
    { label: "Regulamento do jogo Runmageddon", href: "/stopka/runmageddon-game-regulamin.pdf", highlight: true },
    {
      label: "Política de privacidade do jogo Runmageddon",
      href: "/stopka/runmageddon-game-polityka-prywatnosci.pdf",
      highlight: true,
    },
    {
      label: "Regulamento do concurso social Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.contest,
      highlight: true,
    },
    {
      label: "Cláusula GDPR social Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.rodo,
      highlight: true,
    },
    {
      label: 'Regulamento dos stories "Alien" Runmageddon',
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.stories,
      highlight: true,
    },
  ],
  de: [
    { label: "Spielregeln Runmageddon", href: "/stopka/runmageddon-game-regulamin.pdf", highlight: true },
    {
      label: "Datenschutzerklärung zum Runmageddon-Spiel",
      href: "/stopka/runmageddon-game-polityka-prywatnosci.pdf",
      highlight: true,
    },
    {
      label: "Teilnahmebedingungen Social-Media-Gewinnspiel Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.contest,
      highlight: true,
    },
    {
      label: "DSGVO-Hinweis Social Media Runmageddon",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.rodo,
      highlight: true,
    },
    {
      label: "Regeln der Runmageddon-Stories „Alien“",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.stories,
      highlight: true,
    },
  ],
  zh: [
    { label: "Runmageddon 游戏规则", href: "/stopka/runmageddon-game-regulamin.pdf", highlight: true },
    {
      label: "Runmageddon 游戏隐私政策",
      href: "/stopka/runmageddon-game-polityka-prywatnosci.pdf",
      highlight: true,
    },
    {
      label: "Runmageddon 社交媒体活动规则",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.contest,
      highlight: true,
    },
    {
      label: "Runmageddon 社交媒体 GDPR 条款",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.rodo,
      highlight: true,
    },
    {
      label: "Runmageddon「Alien」Stories 规则",
      href: RUNMAGEDDON_SOCIAL_POLICY_LINKS.stories,
      highlight: true,
    },
  ],
};

// Znaki akceptacji płatności. Pliki w public/logos/pay/ są PRZYCIĘTE do samego
// znaku (oryginały w media-src/logos/pay-oryginaly/). Wcześniej miały bardzo
// różne marginesy — Visa/Mastercard zajmowała 44% wysokości pliku, BLIK 100% —
// więc przy tej samej wysokości renderu loga wychodziły w różnych rozmiarach.
//
// Renderujemy je na BIAŁYCH kafelkach, nie wprost na ciemnym tle. Dwa powody:
// logo Blika przyszło jako JPG z wypalonym białym tłem (brak kanału alfa), a
// marki płatnicze w swoich wytycznych zwykle zabraniają przekolorowywania znaku.
//
// `fit` to maksymalna wysokość znaku w kafelku (% wysokości kafelka). Znaki
// „pełne" (czarny kwadrat BLIK, niebieska plakietka Visa Mobile, obrys Apple Pay)
// wyglądają na cięższe niż napisy, więc dostają mniej — tak, by wszystkie
// sześć miało podobną wagę optyczną. Szerokie napisy i tak ogranicza szerokość.
const PAYMENT_METHODS: { src: string; alt: string; w: number; h: number; fit: number }[] = [
  { src: "/wspolne/logotypy/pay/visa-mastercard.png", alt: "Visa i Mastercard", w: 113, h: 35, fit: 46 },
  { src: "/wspolne/logotypy/pay/blik.png", alt: "BLIK", w: 98, h: 64, fit: 58 },
  { src: "/wspolne/logotypy/pay/przelewy24.png", alt: "Przelewy24", w: 190, h: 64, fit: 48 },
  { src: "/wspolne/logotypy/pay/google-pay.png", alt: "Google Pay", w: 170, h: 64, fit: 48 },
  { src: "/wspolne/logotypy/pay/apple-pay.png", alt: "Apple Pay", w: 78, h: 50, fit: 58 },
  { src: "/wspolne/logotypy/pay/visa-mobile.png", alt: "Visa Mobile", w: 84, h: 36, fit: 50 },
];

const FOOTER_COPY: Record<
  Locale,
  {
    rights: string;
    paymentsLabel: string;
    designCredit: string;
    socials: string;
    ctaTitle: string;
    ctaSubtitle: string;
    phoneLabel: string;
    emailLabel: string;
    messengerLabel: string;
    phone: string;
    email: string;
    messengerHandle: string;
    booking: string;
    contact: string;
    addressTitle: string;
    addressLines: string[];
    policies: PolicyLink[];
    sections: Section[];
  }
> = {
  pl: {
    rights: "© {year} Alvernia Planet. Wszystkie prawa zastrzeżone.",
    paymentsLabel: "Bezpieczne płatności",
    designCredit: "Design i realizacja strony:",
    socials: "Wpadnij na nasze social media!",
    ctaTitle: "Masz pytania? Jesteśmy online.",
    ctaSubtitle: "Odpowiemy najszybciej, jak to możliwe. Napisz lub zadzwoń.",
    phoneLabel: "Telefon",
    emailLabel: "Email",
    messengerLabel: "Messenger",
    phone: "+48 510 831 277",
    email: "rezerwacje@alverniaplanet.com",
    messengerHandle: "@alverniaplanet",
    booking: "Rezerwuj wizytę",
    contact: "Kontakt",
    addressTitle: "Adres",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, Polska"],
    policies: [
      { label: "Regulamin", href: "/stopka/regulamin.pdf" },
      { label: "Regulamin przebywania", href: "/stopka/Regulamin-przebywania-na-terenie-alvernia-planet.html" },
      { label: "Zasady promocji 1000 biletów", href: "/stopka/zasady-promocji-1000-biletow.html", highlight: true },
      { label: "Polityka prywatności", href: "/stopka/polityka-prywatnosci.pdf" },
      { label: "Polityka cookies", href: "/stopka/polityka-cookies.pdf" },
      { label: "Ochrona małoletnich", href: "/stopka/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "Atrakcje",
        links: [
          { label: "FILMWORLD", href: "/atrakcje/filmworld" },
          { label: "Kino 360", href: "/atrakcje/kino-360" },
          { label: "Galeria", href: "/galeria" },
        ],
      },
      {
        title: "Plan wizyty",
        links: [
          { label: "Wydarzenia", href: "/wydarzenia" },
          { label: "Jak dojechać", href: "/jak-dojechac" },
          { label: "Grupy", href: "/grupy" },
          { label: "Runmageddon", href: "/runmageddon" },
          { label: "Bilety i rezerwacje", href: bookingHomeHref("pl") },
        ],
      },
      {
        title: "Szybki dostęp",
        links: [
          { label: "Strona główna", href: "/" },
          { label: "O Alvernia Planet", href: "/o-alvernia-planet" },
          { label: "Kontakt", href: "/kontakt" },
        ],
      },
    ],
  },
  en: {
    rights: "© {year} Alvernia Planet. All rights reserved.",
    paymentsLabel: "Secure payments",
    designCredit: "Design & implementation:",
    socials: "Follow us on social media!",
    ctaTitle: "Questions? We’re here.",
    ctaSubtitle: "We reply as fast as possible. Drop us a line or call.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    messengerLabel: "Messenger",
    phone: "+48 510 831 277",
    email: "rezerwacje@alverniaplanet.com",
    messengerHandle: "@alverniaplanet",
    booking: "Book your visit",
    contact: "Contact",
    addressTitle: "Address",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, Poland"],
    policies: [
      { label: "Terms & conditions", href: "/stopka/regulamin.pdf" },
      { label: "Stay regulations", href: "/stopka/Regulamin-przebywania-na-terenie-alvernia-planet.html" },
      { label: "1000 tickets promotion rules", href: "/stopka/zasady-promocji-1000-biletow.html", highlight: true },
      { label: "Privacy policy", href: "/stopka/polityka-prywatnosci.pdf" },
      { label: "Cookies policy", href: "/stopka/polityka-cookies.pdf" },
      { label: "Minors protection", href: "/stopka/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "Attractions",
        links: [
          { label: "FILMWORLD", href: "/atrakcje/filmworld" },
          { label: "K360 Cinema", href: "/atrakcje/kino-360" },
          { label: "Gallery", href: "/galeria" },
        ],
      },
      {
        title: "Plan your visit",
        links: [
          { label: "Events", href: "/wydarzenia" },
          { label: "Getting here", href: "/jak-dojechac" },
          { label: "Groups", href: "/grupy" },
          { label: "Runmageddon", href: "/runmageddon" },
          { label: "Tickets & bookings", href: bookingHomeHref("en") },
        ],
      },
      {
        title: "Quick access",
        links: [
          { label: "Home", href: "/" },
          { label: "About Alvernia Planet", href: "/o-alvernia-planet" },
          { label: "Contact", href: "/kontakt" },
        ],
      },
    ],
  },
  pt: {
    rights: "© {year} Alvernia Planet. Todos os direitos reservados.",
    paymentsLabel: "Pagamentos seguros",
    designCredit: "Design e implementação:",
    socials: "Segue-nos nas redes sociais!",
    ctaTitle: "Tem perguntas? Estamos online.",
    ctaSubtitle: "Respondemos o mais rápido possível. Escreve-nos ou liga.",
    phoneLabel: "Telefone",
    emailLabel: "Email",
    messengerLabel: "Messenger",
    phone: "+48 510 831 277",
    email: "rezerwacje@alverniaplanet.com",
    messengerHandle: "@alverniaplanet",
    booking: "Reservar visita",
    contact: "Contacto",
    addressTitle: "Morada",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, Polónia"],
    policies: [
      { label: "Regulamento", href: "/stopka/regulamin.pdf" },
      { label: "Regras de permanência", href: "/stopka/Regulamin-przebywania-na-terenie-alvernia-planet.html" },
      { label: "Regras da promoção 1000 bilhetes", href: "/stopka/zasady-promocji-1000-biletow.html", highlight: true },
      { label: "Política de privacidade", href: "/stopka/polityka-prywatnosci.pdf" },
      { label: "Política de cookies", href: "/stopka/polityka-cookies.pdf" },
      { label: "Proteção de menores", href: "/stopka/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "Atrações",
        links: [
          { label: "FILMWORLD", href: "/atrakcje/filmworld" },
          { label: "Cinema K360", href: "/atrakcje/kino-360" },
          { label: "Galeria", href: "/galeria" },
        ],
      },
      {
        title: "Planeie a visita",
        links: [
          { label: "Eventos", href: "/wydarzenia" },
          { label: "Como chegar", href: "/jak-dojechac" },
          { label: "Grupos", href: "/grupy" },
          { label: "Runmageddon", href: "/runmageddon" },
          { label: "Bilhetes e reservas", href: bookingHomeHref("pt") },
        ],
      },
      {
        title: "Acesso rápido",
        links: [
          { label: "Início", href: "/" },
          { label: "Sobre a Alvernia Planet", href: "/o-alvernia-planet" },
          { label: "Contacto", href: "/kontakt" },
        ],
      },
    ],
  },
  de: {
    rights: "© {year} Alvernia Planet. Alle Rechte vorbehalten.",
    paymentsLabel: "Sichere Zahlungen",
    designCredit: "Design & Umsetzung:",
    socials: "Folgen Sie uns in den sozialen Medien!",
    ctaTitle: "Fragen? Wir sind für Sie da.",
    ctaSubtitle: "Wir antworten so schnell wie möglich. Schreiben Sie uns oder rufen Sie an.",
    phoneLabel: "Telefon",
    emailLabel: "E-Mail",
    messengerLabel: "Messenger",
    phone: "+48 510 831 277",
    email: "rezerwacje@alverniaplanet.com",
    messengerHandle: "@alverniaplanet",
    booking: "Besuch buchen",
    contact: "Kontakt",
    addressTitle: "Adresse",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, Polen"],
    policies: [
      { label: "Nutzungsbedingungen", href: "/stopka/regulamin.pdf" },
      { label: "Besucherordnung", href: "/stopka/Regulamin-przebywania-na-terenie-alvernia-planet.html" },
      { label: "Aktionsbedingungen: 1000 Tickets", href: "/stopka/zasady-promocji-1000-biletow.html", highlight: true },
      { label: "Datenschutzerklärung", href: "/stopka/polityka-prywatnosci.pdf" },
      { label: "Cookie-Richtlinie", href: "/stopka/polityka-cookies.pdf" },
      { label: "Schutz von Minderjährigen", href: "/stopka/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "Attraktionen",
        links: [
          { label: "FILMWORLD", href: "/atrakcje/filmworld" },
          { label: "Kino 360", href: "/atrakcje/kino-360" },
          { label: "Galerie", href: "/galeria" },
        ],
      },
      {
        title: "Besuch planen",
        links: [
          { label: "Veranstaltungen", href: "/wydarzenia" },
          { label: "Anfahrt", href: "/jak-dojechac" },
          { label: "Gruppen", href: "/grupy" },
          { label: "Runmageddon", href: "/runmageddon" },
          { label: "Tickets & Buchung", href: bookingHomeHref("de") },
        ],
      },
      {
        title: "Schnellzugriff",
        links: [
          { label: "Startseite", href: "/" },
          { label: "Über Alvernia Planet", href: "/o-alvernia-planet" },
          { label: "Kontakt", href: "/kontakt" },
        ],
      },
    ],
  },
  zh: {
    rights: "© {year} Alvernia Planet。版权所有。",
    paymentsLabel: "安全支付",
    designCredit: "网站设计与开发：",
    socials: "欢迎关注我们的社交媒体！",
    ctaTitle: "有问题？我们在线为您解答。",
    ctaSubtitle: "我们会尽快回复。欢迎留言或来电。",
    phoneLabel: "电话",
    emailLabel: "电子邮箱",
    messengerLabel: "Messenger",
    phone: "+48 510 831 277",
    email: "rezerwacje@alverniaplanet.com",
    messengerHandle: "@alverniaplanet",
    booking: "预订参观",
    contact: "联系方式",
    addressTitle: "地址",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, 波兰"],
    policies: [
      { label: "服务条款", href: "/stopka/regulamin.pdf" },
      { label: "园区参观守则", href: "/stopka/Regulamin-przebywania-na-terenie-alvernia-planet.html" },
      { label: "1000 张门票促销规则", href: "/stopka/zasady-promocji-1000-biletow.html", highlight: true },
      { label: "隐私政策", href: "/stopka/polityka-prywatnosci.pdf" },
      { label: "Cookie 政策", href: "/stopka/polityka-cookies.pdf" },
      { label: "未成年人保护", href: "/stopka/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "游玩项目",
        links: [
          { label: "FILMWORLD", href: "/atrakcje/filmworld" },
          { label: "Kino 360 影院", href: "/atrakcje/kino-360" },
          { label: "图片库", href: "/galeria" },
        ],
      },
      {
        title: "行程规划",
        links: [
          { label: "活动", href: "/wydarzenia" },
          { label: "交通指南", href: "/jak-dojechac" },
          { label: "团体参观", href: "/grupy" },
          { label: "Runmageddon", href: "/runmageddon" },
          { label: "门票与预订", href: bookingHomeHref("zh") },
        ],
      },
      {
        title: "快速链接",
        links: [
          { label: "首页", href: "/" },
          { label: "关于 Alvernia Planet", href: "/o-alvernia-planet" },
          { label: "联系我们", href: "/kontakt" },
        ],
      },
    ],
  },
};

const CZERCODE_URL = "https://czercode.com";
const CZERCODE_LOGO_BLACK = "/wspolne/partnerzy/CzerCode_logo_black.svg";
const CZERCODE_LOGO_WHITE = "/wspolne/partnerzy/CzerCode_logo_white.svg";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M13.33 21v-8h2.68l.4-3.12h-3.08V7.89c0-.9.25-1.51 1.55-1.51H16.8V3.6c-.33-.04-1.45-.12-2.76-.12-2.74 0-4.62 1.67-4.62 4.75v2.65H6.3V13h3.12v8h3.91Z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M7.75 3h8.5A4.75 4.75 0 0 1 21 7.75v8.5A4.75 4.75 0 0 1 16.25 21h-8.5A4.75 4.75 0 0 1 3 16.25v-8.5A4.75 4.75 0 0 1 7.75 3Zm0 1.8A2.95 2.95 0 0 0 4.8 7.75v8.5a2.95 2.95 0 0 0 2.95 2.95h8.5a2.95 2.95 0 0 0 2.95-2.95v-8.5a2.95 2.95 0 0 0-2.95-2.95h-8.5Zm8.9 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.15A4.85 4.85 0 1 1 7.15 12 4.86 4.86 0 0 1 12 7.15Zm0 1.8A3.05 3.05 0 1 0 15.05 12 3.05 3.05 0 0 0 12 8.95Z"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M14.6 3c.22 1.83 1.27 3.5 2.85 4.45a5.8 5.8 0 0 0 2.36.77v2.9a8.36 8.36 0 0 1-3.52-.87v5.1a6.25 6.25 0 1 1-6.23-6.25c.3 0 .57.02.84.07v2.98a3.4 3.4 0 1 0 2.24 3.2V3h2.46Z"
      />
    </svg>
  );
}

const Footer = memo(function Footer() {
  const { locale } = useI18n();
  const pathname = usePathname();
  // Bez stopki na trasach bare (np. /aplikacje/identyfikacja).
  if (isBareChromeRoute(pathname)) return null;
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = FOOTER_COPY[loc];
  const rights = copy.rights.replace("{year}", String(new Date().getFullYear()));
  // Motyw jasny usunięty — serwis jest wyłącznie ciemny.
  const isLight = false;
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/+$/, "").toLowerCase() : pathname ?? "/";
  // Generycznie po liście języków — inaczej każda nowa wersja wymagałaby
  // dopisania kolejnego warunku, a jej goście nie zobaczyliby regulaminów
  // Runmageddonu mimo istniejących tłumaczeń.
  const isRunmageddonRoute = ["/runmageddon", ...INTL_LOCALES.map((l) => `/${l}/runmageddon`)].includes(
    normalizedPathname,
  );
  const policyLinks = isRunmageddonRoute
    ? [...copy.policies, ...RUNMAGEDDON_FOOTER_POLICIES[loc]]
    : copy.policies;
  const logoSrc = isLight ? "/Loga/Logo_pozytyw.svg" : "/Loga/Logo_negatyw.svg";
  const infoCardSurface = isLight
    ? "bg-[color:var(--ap-surface-contrast)] ring-1 ring-[color:var(--ap-border)] text-[color:var(--ap-text)]"
    : "bg-white/5 ring-1 ring-white/10";
  const iconWrapperSurface = isLight
    ? "bg-[color:var(--ap-surface-contrast)] ring-1 ring-[color:var(--ap-border)]"
    : "bg-white/10 ring-1 ring-white/20";
  const socialLabelTone = isLight ? "text-[#aab4be]" : "text-[#aab4be]";
  const facebookIconTone = isLight ? "text-blue-700" : "text-blue-300";
  const instagramIconTone = isLight ? "text-pink-600" : "text-pink-300";
  const tiktokIconTone = isLight ? "text-cyan-700" : "text-cyan-200";
  const logoFrameClass = "inline-flex items-center justify-center rounded-2xl px-3 py-1";
  const czerCodeLogoSrc = isLight ? CZERCODE_LOGO_BLACK : CZERCODE_LOGO_WHITE;
  const creditTextTone = isLight ? "text-[color:var(--ap-text-muted)]" : "text-gray-400";
  const creditLinkTone = isLight
    ? "text-[color:var(--ap-text)] hover:text-[color:var(--ap-accent)]"
    : "text-white/85 hover:text-[color:var(--ap-ice)]";
  const withPrefix = (href: string) => {
    if (!href.startsWith("/")) return href;
    return getLocalizedPath(href, loc);
  };

  return (
    <footer
      data-ap-footer
      className="relative mt-24 text-white overflow-hidden bg-[var(--ap-bg)]"
    >
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-14">
        {/* Polityki / regulaminy */}
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
          {/* ŚWIADOMIE <a>, a NIE <Link> — to są statyczne dokumenty z public/stopka/
              (.pdf/.html), a nie trasy Nextа. <Link> traktuje każdy wewnętrzny href
              jak trasę aplikacji i przy wejściu stopki w viewport robi prefetch
              payloadu RSC, czyli pobiera `<href>.txt` (w trybie output:"export" Next
              generuje pliki `<trasa>.txt` obok `<trasa>.html`). Dla /stopka/*.pdf taki
              plik nie istnieje → seria 404 w konsoli:
              /stopka/regulamin.pdf.txt?_rsc=…, /stopka/polityka-cookies.pdf.txt?_rsc=… itd.
              Zwykłe <a> nie prefetchuje niczego. Zwykłych linków do tras Nexta
              (sekcje nawigacji niżej) to NIE dotyczy — tam <Link> zostaje. */}
          {policyLinks.map((item, idx) => (
            <span key={item.href} className="flex items-center gap-3">
              <a
                href={item.href}
                className={
                  item.highlight
                    ? isLight
                      ? "underline underline-offset-4 decoration-[#f2cb47]/60 text-[#8a5b00] transition hover:decoration-[#f2cb47] hover:text-[#5b4308]"
                      : "underline underline-offset-4 decoration-[#f2cb47]/55 text-[#f2cb47] transition hover:decoration-[#f2cb47] hover:text-[#ffe27a]"
                    : "underline underline-offset-4 decoration-white/30 text-white/80 transition hover:decoration-white hover:text-white"
                }
                target="_blank"
                rel="noopener noreferrer"
                suppressHydrationWarning
                onClick={() => trackEvent("footer_policy_click", { label: item.label, href: item.href })}
              >
                {item.label}
              </a>
              {idx < policyLinks.length - 1 ? (
                <span className="text-white/30" aria-hidden="true">
                  •
                </span>
              ) : null}
            </span>
          ))}
          <span className="flex items-center gap-3">
            <span className="text-white/30" aria-hidden="true">
              •
            </span>
            <button
              type="button"
              onClick={openCookieSettings}
              className="underline underline-offset-4 decoration-white/30 text-white/80 transition hover:decoration-white hover:text-white"
            >
              {
              {
                pl: "Ustawienia cookies",
                en: "Cookie settings",
                pt: "Definições de cookies",
                de: "Cookie-Einstellungen",
                zh: "Cookie 设置",
              }[loc]
            }
            </button>
          </span>
        </div>

        {/* Columns */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">{copy.addressTitle}</p>
            <div
              className={`rounded-2xl px-5 py-4 space-y-1 ${
                isLight ? infoCardSurface : `${infoCardSurface} text-white/85`
              }`}
            >
              {copy.addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="pt-2">
              <div className={`rounded-2xl p-4 ${infoCardSurface}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{copy.socials}</p>
                  <span className={`text-[11px] uppercase tracking-[0.24em] ${socialLabelTone}`}>Social</span>
                </div>
                <div className="mt-3 flex gap-3 text-xl text-gray-100">
                  <a
                    href="https://www.facebook.com/alverniaplanet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="Facebook"
                    onClick={() => trackEvent("social_click", { network: "facebook", location: "footer" })}
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(59,130,246,0.35)] ${iconWrapperSurface}`}
                    >
                      <FacebookIcon className={`h-5 w-5 ${facebookIconTone}`} />
                    </span>
                  </a>
                  <a
                    href="https://www.instagram.com/alverniaplanet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="Instagram"
                    onClick={() => trackEvent("social_click", { network: "instagram", location: "footer" })}
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(236,72,153,0.35)] ${iconWrapperSurface}`}
                    >
                      <InstagramIcon className={`h-5 w-5 ${instagramIconTone}`} />
                    </span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@alverniaplanetedu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="TikTok"
                    onClick={() => trackEvent("social_click", { network: "tiktok", location: "footer" })}
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(34,211,238,0.35)] ${iconWrapperSurface}`}
                    >
                      <TikTokIcon className={`h-5 w-5 ${tiktokIconTone}`} />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {copy.sections.map((section) => (
              <div key={section.title} className="space-y-3">
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <ul className="space-y-2 text-white/75 text-sm">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {/* Zewnętrzny system biletowy idzie zwykłym <a> — <Link>
                          jest komponentem routera i nie ma tu czego routować.
                          Tracking identyczny w obu gałęziach. */}
                      {/^https?:\/\//i.test(link.href) ? (
                        <a
                          href={link.href}
                          className="transition-colors hover:text-white"
                          onClick={() => trackEvent("footer_nav_click", { label: link.label, href: link.href })}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={withPrefix(link.href)}
                          className="transition-colors hover:text-white"
                          onClick={() => trackEvent("footer_nav_click", { label: link.label, href: link.href })}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-3 flex flex-col-reverse items-center gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-6 lg:justify-end">
              {/* Znaki akceptacji płatności — w obwiedzionym boksie, po LEWEJ od logo. */}
              {/* Równa siatka identycznych kafelków: 3 × 2 na telefonie (wcześniej
                  flex-wrap zostawiał szósty znak samotnie w drugim rzędzie),
                  od sm — sześć w jednym rzędzie. */}
              <div className="flex w-full max-w-[22rem] flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:w-auto sm:max-w-none sm:items-start">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                  {copy.paymentsLabel}
                </p>
                <ul className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:grid-cols-6">
                  {PAYMENT_METHODS.map((method) => (
                    <li
                      key={method.alt}
                      className="flex h-11 items-center justify-center rounded-lg bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] sm:h-10 sm:w-[4.75rem]"
                    >
                      <Image
                        src={method.src}
                        alt={method.alt}
                        width={method.w}
                        height={method.h}
                        className="h-auto w-auto max-w-[76%] object-contain"
                        style={{ maxHeight: `${method.fit}%` }}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={withPrefix("/")}
                className="inline-flex items-center"
                onClick={() => trackEvent("footer_logo_click", { location: "footer" })}
              >
                <span className={logoFrameClass}>
                  <Image
                    src={logoSrc}
                    alt="Alvernia Planet"
                    width={210}
                    height={40}
                    sizes="210px"
                    className="h-10 w-auto object-contain object-center"
                  />
                </span>
              </Link>

            </div>
          </div>
        </div>

        <div className={`mt-10 border-t border-white/10 pt-6 text-sm ${creditTextTone}`}>
          <p className="w-full text-center">{rights}</p>
          <div className="mt-3 w-full flex justify-start">
            <a
              href={CZERCODE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group inline-flex flex-col items-start gap-2 rounded-2xl px-3 py-2 transition ${creditLinkTone}`}
              onClick={() => trackEvent("footer_credit_click", { provider: "CzerCode", href: CZERCODE_URL })}
            >
              <span className="max-w-full text-left leading-snug sm:whitespace-nowrap">
                {copy.designCredit} CzerCode Szymon Czermak
              </span>
              <span className="inline-flex items-center justify-start">
                <Image
                  src={czerCodeLogoSrc}
                  alt="CzerCode logo"
                  width={140}
                  height={28}
                  sizes="140px"
                  className="h-6 w-auto object-contain"
                />
              </span>
            </a>
          </div>
        </div>
      </div>
      {/* Komunikat o modernizacji Kina 360 (1–4.09.2026) — ZDJĘTY z montowania
          po zakończeniu przerwy. Komponent zostaje w repo (RemontKinaBumper.tsx)
          i sam pilnuje swojej daty, ale dopóki wisiał tutaj, jego kod razem
          z tłumaczeniami w 5 językach leciał w chunku layoutu na KAŻDEJ z 131
          stron — mimo że zawsze zwracał null. Przy następnej przerwie: wrócić
          import i ten znacznik, zmienić REMONT_KONIEC. */}
    </footer>
  );
});

export default Footer;
