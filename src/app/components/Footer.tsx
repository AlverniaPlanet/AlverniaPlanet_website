"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaFacebookMessenger } from "react-icons/fa";
import { useI18n } from "@/app/i18n-provider";
import { useTheme } from "@/app/theme-provider";

type Locale = "pl" | "en";
type LinkItem = { label: string; href: string };
type Section = { title: string; links: LinkItem[] };
type PolicyLink = { label: string; href: string };

const FOOTER_COPY: Record<
  Locale,
  {
    rights: string;
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
    socials: "Wpadnij na nasze social media!",
    ctaTitle: "Masz pytania? Jesteśmy online.",
    ctaSubtitle: "Odpowiemy najszybciej, jak to możliwe — napisz lub zadzwoń.",
    phoneLabel: "Telefon",
    emailLabel: "Email",
    messengerLabel: "Messenger",
    phone: "+48 12 344 40 00",
    email: "rezerwacjeap@gremi.pl",
    messengerHandle: "@alverniaplanet",
    booking: "Rezerwuj wizytę",
    contact: "Kontakt",
    addressTitle: "Adres",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, Polska"],
    policies: [
      { label: "Regulamin", href: "/legal/Regulamin.pdf" },
      { label: "Polityka prywatności", href: "/legal/polityka-prywatnosci.pdf" },
      { label: "Polityka cookies", href: "/legal/polityka-cookies.pdf" },
      { label: "Ochrona małoletnich", href: "/legal/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "Atrakcje",
        links: [
          { label: "Wystawa tematyczna", href: "/atrakcje/wystawa" },
          { label: "Ścieżka filmowa", href: "/atrakcje/sciezka-filmowa" },
          { label: "Kino 360°", href: "/atrakcje/kino-360" },
          { label: "Galeria", href: "/galeria" },
        ],
      },
      {
        title: "Plan wizyty",
        links: [
          { label: "Wydarzenia", href: "/wydarzenia" },
          { label: "Jak dojechać", href: "/jak-dojechac" },
          { label: "Bilety i rezerwacje", href: "/kontakt" },
          { label: "Aktualności", href: "/aktualnosci" },
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
    socials: "Follow us on social media!",
    ctaTitle: "Questions? We’re here.",
    ctaSubtitle: "We reply as fast as possible — drop us a line or call.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    messengerLabel: "Messenger",
    phone: "+48 12 344 40 00",
    email: "rezerwacjeap@gremi.pl",
    messengerHandle: "@alverniaplanet",
    booking: "Book your visit",
    contact: "Contact",
    addressTitle: "Address",
    addressLines: ["Alvernia Planet", "ul. Ferdynanda Wspaniałego 1", "32-566 Nieporaz, Poland"],
    policies: [
      { label: "Terms & conditions", href: "/legal/Regulamin.pdf" },
      { label: "Privacy policy", href: "/legal/polityka-prywatnosci.pdf" },
      { label: "Cookies policy", href: "/legal/polityka-cookies.pdf" },
      { label: "Minors protection", href: "/legal/ochrona-maloletnich.pdf" },
    ],
    sections: [
      {
        title: "Attractions",
        links: [
          { label: "Themed exhibition", href: "/atrakcje/wystawa" },
          { label: "Film path", href: "/atrakcje/sciezka-filmowa" },
          { label: "360° cinema", href: "/atrakcje/kino-360" },
          { label: "Gallery", href: "/galeria" },
        ],
      },
      {
        title: "Plan your visit",
        links: [
          { label: "Events", href: "/wydarzenia" },
          { label: "Getting here", href: "/jak-dojechac" },
          { label: "Tickets & bookings", href: "/kontakt" },
          { label: "News", href: "/aktualnosci" },
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
};

const MESSENGER_URL = "https://m.me/alverniaplanet?ref=footer";

export default function Footer() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = FOOTER_COPY[loc];
  const rights = copy.rights.replace("{year}", String(new Date().getFullYear()));
  const isLight = theme === "light";
  const ctaSurface = isLight
    ? "bg-[color:var(--ap-surface-contrast)] ring-1 ring-[color:var(--ap-border)] shadow-[var(--ap-card-shadow)] text-[color:var(--ap-text)]"
    : "bg-white/[0.04] ring-1 ring-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)]";
  const infoCardSurface = isLight
    ? "bg-[color:var(--ap-surface-contrast)] ring-1 ring-[color:var(--ap-border)] text-[color:var(--ap-text)]"
    : "bg-white/5 ring-1 ring-white/10";
  const iconWrapperSurface = isLight
    ? "bg-[color:var(--ap-surface-contrast)] ring-1 ring-[color:var(--ap-border)]"
    : "bg-white/10 ring-1 ring-white/20";
  const phoneLinkTone = isLight
    ? "text-emerald-700 hover:text-emerald-600"
    : "text-emerald-200 hover:text-emerald-100";
  const emailLinkTone = isLight ? "text-sky-700 hover:text-sky-600" : "text-sky-200 hover:text-sky-100";
  const messengerLinkTone = isLight
    ? "text-blue-700 hover:text-blue-600"
    : "text-blue-200 hover:text-blue-100";
  const messengerIconTone = isLight
    ? "bg-blue-600/15 ring-1 ring-blue-700/25 text-blue-700"
    : "bg-blue-500/20 ring-1 ring-blue-400/30 text-blue-200";
  const socialLabelTone = isLight ? "text-emerald-700" : "text-emerald-200/80";
  const facebookIconTone = isLight ? "text-blue-700" : "text-blue-300";
  const instagramIconTone = isLight ? "text-pink-600" : "text-pink-300";
  const tiktokIconTone = isLight ? "text-cyan-700" : "text-cyan-200";

  return (
    <footer className="relative mt-24 text-white overflow-hidden bg-black">
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-14">
        {/* Polityki / regulaminy */}
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
          {copy.policies.map((item, idx) => (
            <span key={item.href} className="flex items-center gap-3">
              <Link
                href={item.href}
                className="underline underline-offset-4 decoration-white/30 hover:decoration-white text-white/80 hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
                suppressHydrationWarning
              >
                {item.label}
              </Link>
              {idx < copy.policies.length - 1 ? (
                <span className="text-white/30" aria-hidden="true">
                  •
                </span>
              ) : null}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className={`grid gap-6 rounded-3xl px-5 py-6 sm:px-8 sm:py-8 ${ctaSurface}`}>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{copy.contact}</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">{copy.ctaTitle}</h2>
            <p className="text-white/70 text-sm sm:text-base">{copy.ctaSubtitle}</p>
            <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${infoCardSurface}`}>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.phoneLabel}</p>
                  <p className="text-lg font-semibold">{copy.phone}</p>
                </div>
                <a href={`tel:${copy.phone.replace(/\s+/g, "")}`} className={`text-sm ${phoneLinkTone}`}>
                  {loc === "en" ? "Call" : "Zadzwoń"}
                </a>
              </div>
              <div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${infoCardSurface}`}>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.emailLabel}</p>
                  <p className="text-lg font-semibold">{copy.email}</p>
                </div>
                <a href={`mailto:${copy.email}`} className={`text-sm ${emailLinkTone}`}>
                  {loc === "en" ? "Email" : "Napisz"}
                </a>
              </div>
              <div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${infoCardSurface}`}>
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${messengerIconTone}`}>
                    <FaFacebookMessenger />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{copy.messengerLabel}</p>
                    <p className="text-lg font-semibold">{copy.messengerHandle}</p>
                  </div>
                </div>
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm ${messengerLinkTone}`}
                >
                  {loc === "en" ? "Message" : "Napisz"}
                </a>
              </div>
            </div>
          </div>
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
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(59,130,246,0.35)] ${iconWrapperSurface}`}
                    >
                      <FaFacebookF className={facebookIconTone} />
                    </span>
                  </a>
                  <a
                    href="https://www.instagram.com/alverniaplanet/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="Instagram"
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(236,72,153,0.35)] ${iconWrapperSurface}`}
                    >
                      <FaInstagram className={instagramIconTone} />
                    </span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@alverniaplanetedu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    aria-label="TikTok"
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(34,211,238,0.35)] ${iconWrapperSurface}`}
                    >
                      <FaTiktok className={tiktokIconTone} />
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
                      <Link href={link.href} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="sm:col-span-2 lg:col-span-3 flex sm:justify-start lg:justify-end items-center">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src={theme === "light" ? "/logo_AP_grey.png" : "/logo_AP_white.png"}
                  alt="Alvernia Planet"
                  width={140}
                  height={42}
                  className={`h-10 w-auto ${theme === "dark" ? "mix-blend-screen" : ""}`}
                  priority
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex justify-center text-sm text-gray-400">
          <p className="text-center">{rights}</p>
        </div>
      </div>
    </footer>
  );
}
