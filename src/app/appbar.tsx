"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import LangSwitcher from "@/app/components/LangSwitcher";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useTheme } from "@/app/theme-provider";

const BOOKING_URL = "https://alverniaplanet.bookero.pl"; // upewnij się, że jest https

export function AppBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [openAttractions, setOpenAttractions] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const attractionsHideTimer = useRef<number | null>(null);
  const aboutHideTimer = useRef<number | null>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    setOpenAttractions(false);
    setOpenAbout(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[color:var(--ap-border)] bg-[var(--ap-nav-bg)] backdrop-blur supports-[backdrop-filter]:md:bg-[var(--ap-nav-bg)]">
        {/* grid 3 kolumny: [lewo] [logo] [prawo] */}
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-5 px-4 py-3">
          {/* LEWO: burger (mobile) + linki (desktop) */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            {/* burger tylko na mobile */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("aria.close_menu") : t("aria.open_menu")}
              aria-expanded={open}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15 active:scale-95 transition"
            >
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {open ? (
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                ) : (
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                )}
              </svg>
            </button>

            {/* linki desktop po LEWEJ */}
            <nav className="hidden lg:flex items-center gap-3 lg:gap-4 text-sm whitespace-nowrap">
              {/* Atrakcje (dropdown: hover + focus + delay to allow clicking) */}
              <div
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOpenAttractions(false);
                  }
                }}
                onMouseEnter={() => {
                  if (attractionsHideTimer.current) {
                    window.clearTimeout(attractionsHideTimer.current);
                    attractionsHideTimer.current = null;
                  }
                  setOpenAttractions(true);
                }}
                onMouseLeave={() => {
                  if (attractionsHideTimer.current) window.clearTimeout(attractionsHideTimer.current);
                  attractionsHideTimer.current = window.setTimeout(() => {
                    setOpenAttractions(false);
                  }, 500);
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-white/90 hover:text-white focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={openAttractions}
                  onClick={() => setOpenAttractions((v) => !v)}
                >
                  {t("nav.attraction")}
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${openAttractions ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.24 4.41a.75.75 0 0 1-1.08 0l-4.24-4.41a.75.75 0 0 1 .02-1.06z" />
                  </svg>
                </button>
                <div
                  className={`absolute left-0 top-full mt-1 w-56 z-50 origin-top transition-all duration-150 ${openAttractions ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-0.5 pointer-events-none"}`}
                >
                  <div className="rounded-xl bg-[color:var(--ap-surface-contrast)] backdrop-blur ring-1 ring-[color:var(--ap-border)] shadow-xl overflow-hidden text-[color:var(--ap-text)]">
                    <ul className="py-2 text-sm">
                      <li>
                        <Link
                          href="/atrakcje/wystawa"
                          className="block px-4 py-2 hover:bg-[color:var(--ap-surface-strong)]"
                        >
                          {t("menu.attractions.exhibition")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/atrakcje/sciezka-filmowa"
                          className="block px-4 py-2 hover:bg-[color:var(--ap-surface-strong)]"
                        >
                          {t("menu.attractions.film_path")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/atrakcje/kino-360"
                          className="block px-4 py-2 hover:bg-[color:var(--ap-surface-strong)]"
                        >
                          {t("menu.attractions.cinema")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <span className="text-white/40">|</span>
              <Link
                href="/wydarzenia"
                className="text-white/90 hover:text-white"
                suppressHydrationWarning
              >
                {t("nav.events")}
              </Link>
              <span className="text-white/40">|</span>
              <Link
                href="/jak-dojechac"
                className="text-white/90 hover:text-white"
                suppressHydrationWarning
              >
                {t("nav.getting_there")}
              </Link>
            </nav>
          </div>

          {/* ŚRODEK: logo */}
          <div className="flex items-center justify-center px-2">
            <Link href="/" aria-label={t("aria.home")} className="block">
              <Image
                src={theme === "light" ? "/logo_AP_grey.png" : "/logo_AP_white.png"}
                alt="Alvernia Planet"
                width={240}
                height={40}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* PRAWO: O nas + Kontakt (desktop) + Rezerwacja zawsze widoczna + switch języka */}
          <div className="flex items-center justify-end gap-3 md:gap-4 min-w-0">
            {/* linki desktop po PRAWEJ */}
            <nav className="hidden lg:flex items-center gap-3 lg:gap-4 text-sm whitespace-nowrap">
              {/* O nas (dropdown) */}
              <div
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOpenAbout(false);
                  }
                }}
                onMouseEnter={() => {
                  if (aboutHideTimer.current) {
                    window.clearTimeout(aboutHideTimer.current);
                    aboutHideTimer.current = null;
                  }
                  setOpenAbout(true);
                }}
                onMouseLeave={() => {
                  if (aboutHideTimer.current) window.clearTimeout(aboutHideTimer.current);
                  aboutHideTimer.current = window.setTimeout(() => {
                    setOpenAbout(false);
                  }, 500);
                }}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-white/90 hover:text-white focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={openAbout}
                  onClick={() => setOpenAbout((v) => !v)}
                >
                  {t("nav.about")}
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${openAbout ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.24 4.41a.75.75 0 0 1-1.08 0l-4.24-4.41a.75.75 0 0 1 .02-1.06z" />
                  </svg>
                </button>
                <div
                  className={`absolute right-0 top-full mt-1 w-56 z-50 origin-top transition-all duration-150 ${openAbout ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-0.5 pointer-events-none"}`}
                >
                  <div className="rounded-xl bg-[color:var(--ap-surface-contrast)] backdrop-blur ring-1 ring-[color:var(--ap-border)] shadow-xl overflow-hidden text-[color:var(--ap-text)]">
                    <ul className="py-2 text-sm">
                      <li>
                        <Link
                          href="/o-alvernia-planet"
                          className="block px-4 py-2 hover:bg-[color:var(--ap-surface-strong)]"
                        >
                          {t("nav.about_alvernia")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/galeria"
                          className="block px-4 py-2 hover:bg-[color:var(--ap-surface-strong)]"
                        >
                          {t("nav.gallery")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <span className="text-white/40">|</span>
              <Link
                href="/kontakt"
                className="text-white/90 hover:text-white whitespace-nowrap"
                suppressHydrationWarning
              >
                {t("nav.contact")}
              </Link>
            </nav>

            {/* CTA zawsze widoczne */}
            <PrimaryButton
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              suppressHydrationWarning
              className="min-w-[122px] text-center shrink-0"
            >
              {t("cta.booking")}
            </PrimaryButton>

            {/* Theme switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15 active:scale-95 transition ${
                theme === "light" ? "text-[color:var(--ap-text)]" : "text-white"
              }`}
              aria-label={theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
              title={theme === "light" ? "Tryb ciemny" : "Tryb jasny"}
            >
              {theme === "light" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4.5" />
                  <line x1="12" y1="3" x2="12" y2="5.2" />
                  <line x1="12" y1="18.8" x2="12" y2="21" />
                  <line x1="3" y1="12" x2="5.2" y2="12" />
                  <line x1="18.8" y1="12" x2="21" y2="12" />
                  <line x1="5.7" y1="5.7" x2="7.2" y2="7.2" />
                  <line x1="16.8" y1="16.8" x2="18.3" y2="18.3" />
                  <line x1="5.7" y1="18.3" x2="7.2" y2="16.8" />
                  <line x1="16.8" y1="7.2" x2="18.3" y2="5.7" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                </svg>
              )}
            </button>

            {/* Switch języka */}
            <div className="hidden md:block">
              <LangSwitcher />
            </div>
          </div>
        </div>

        {/* MENU MOBILNE (reszta linków w burgerze) */}
        <div
          className={`lg:hidden grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!open}
        >
          <nav className="min-h-0 overflow-hidden bg-[var(--ap-nav-bg)]">
            <ul className="space-y-1 px-4 pb-4 pt-1 text-sm">
              <li>
                <Link
                  href="/wycieczka"
                  className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                  suppressHydrationWarning
                >
                  {t("nav.attraction")}
                </Link>
              </li>
              {/* submenu: Atrakcje (mobile) */}
              <li className="ml-3">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/atrakcje/wystawa"
                      className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                    >
                      • {t("menu.attractions.exhibition")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/atrakcje/sciezka-filmowa"
                      className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                    >
                      • {t("menu.attractions.film_path")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/atrakcje/kino-360"
                      className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                    >
                      • {t("menu.attractions.cinema")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/wydarzenia"
                  className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                  suppressHydrationWarning
                >
                  {t("nav.events")}
                </Link>
              </li>
              <li className="pt-1 border-t border-white/10 mt-1" />
              <li>
                <Link
                  href="/jak-dojechac"
                  className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                  suppressHydrationWarning
                >
                  {t("nav.getting_there")}
                </Link>
              </li>
              <li className="ml-3">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/o-alvernia-planet"
                      className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                    >
                      • {t("nav.about_alvernia")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/galeria"
                      className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                    >
                      • {t("nav.gallery")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="block rounded-md px-3 py-2 hover:bg-white/10 text-gray-200"
                  suppressHydrationWarning
                >
                  {t("nav.contact")}
                </Link>
              </li>
              <li className="pt-1 border-t border-white/10 mt-2" />
              <li className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 hover:bg-white/15 active:scale-95 transition text-white"
                    aria-label={theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
                    title={theme === "light" ? "Tryb ciemny" : "Tryb jasny"}
                  >
                    {theme === "light" ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4.5" />
                        <line x1="12" y1="3" x2="12" y2="5.2" />
                        <line x1="12" y1="18.8" x2="12" y2="21" />
                        <line x1="3" y1="12" x2="5.2" y2="12" />
                        <line x1="18.8" y1="12" x2="21" y2="12" />
                        <line x1="5.7" y1="5.7" x2="7.2" y2="7.2" />
                        <line x1="16.8" y1="16.8" x2="18.3" y2="18.3" />
                        <line x1="5.7" y1="18.3" x2="7.2" y2="16.8" />
                        <line x1="16.8" y1="7.2" x2="18.3" y2="5.7" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                      </svg>
                    )}
                  </button>
                  <LangSwitcher />
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
export default AppBar;
