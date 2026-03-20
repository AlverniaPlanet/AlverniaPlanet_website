"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/i18n-provider";
import LangSwitcher from "@/app/components/LangSwitcher";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { useTheme } from "@/app/theme-provider";
import BrandLogo from "@/app/components/BrandLogo";
import {
  getSitePaths,
  mapToPolishRoute,
  normalizePathname,
  type Locale,
} from "@/lib/localizedRoutes";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AppBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [openAttractions, setOpenAttractions] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const attractionsHideTimer = useRef<number | null>(null);
  const aboutHideTimer = useRef<number | null>(null);
  const loc: Locale = (locale as Locale) ?? "pl";
  const paths = getSitePaths(loc);
  const canonicalPath = mapToPolishRoute(normalizePathname(pathname));
  const logoFrameClass = "inline-flex items-center justify-center rounded-2xl px-0 py-0";

  const isCurrentPath = (...targets: string[]) =>
    targets.some((target) => canonicalPath === mapToPolishRoute(target));
  const isCurrentSection = (sectionRoot: string) =>
    canonicalPath === sectionRoot || canonicalPath.startsWith(`${sectionRoot}/`);

  const isAttractionsActive = isCurrentSection("/atrakcje");
  const isEventsActive = isCurrentPath("/wydarzenia");
  const isGettingThereActive = isCurrentPath("/jak-dojechac");
  const isAboutActive = isCurrentPath("/o-alvernia-planet", "/galeria", "/wydarzenia/vr");
  const isContactActive = isCurrentPath("/kontakt");
  const isBookingActive = isCurrentPath("/rezerwuj");
  const isExhibitionActive = isCurrentPath("/atrakcje/wystawa");
  const isFilmPathActive = isCurrentPath("/atrakcje/sciezka-filmowa");
  const isCinemaActive = isCurrentPath("/atrakcje/kino-360");
  const isAboutPageActive = isCurrentPath("/o-alvernia-planet");
  const isGalleryActive = isCurrentPath("/galeria");
  const isVrTourActive = isCurrentPath("/wydarzenia/vr");

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
      <header
        data-ap-nav
        className="sticky top-0 z-30 border-b border-[color:var(--ap-border)] bg-[var(--ap-nav-bg)] supports-[backdrop-filter]:md:bg-[var(--ap-nav-bg)] supports-[backdrop-filter]:md:backdrop-blur"
      >
        {/* grid 3 kolumny: [lewo] [logo] [prawo] */}
        <div className="mx-auto grid w-full max-w-[min(94vw,96rem)] grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-3 px-3.5 md:px-4 py-1.5">
          {/* LEWO: burger (mobile) + linki (desktop) */}
          <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
            {/* burger tylko na mobile */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t("aria.close_menu") : t("aria.open_menu")}
              aria-expanded={open}
              className="ap-icon-button lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20"
            >
              <svg
                className="h-4 w-4 text-white"
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
            <nav className="hidden lg:flex items-center gap-2.5 xl:gap-3 text-[11px] xl:text-xs whitespace-nowrap">
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
                  }, 220);
                }}
              >
                <button
                  type="button"
                  className={cx(
                    "ap-nav-link ap-nav-link-button inline-flex items-center gap-1 focus:outline-none",
                    isAttractionsActive && "is-active",
                  )}
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
                  className={`ap-nav-dropdown absolute left-0 top-full mt-1 w-56 z-50 origin-top transition-all duration-150 ${openAttractions ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-0.5 pointer-events-none"}`}
                >
                  <div className="ap-nav-dropdown-panel rounded-xl bg-[color:var(--ap-surface-contrast)] backdrop-blur ring-1 ring-[color:var(--ap-border)] shadow-xl overflow-hidden text-[color:var(--ap-text)]">
                    <ul className="py-2 text-xs">
                      <li>
                        <Link
                          href={paths.attractions.exhibition}
                          className={cx(
                            "ap-nav-dropdown-link block px-4 py-2",
                            isExhibitionActive && "is-active",
                          )}
                          aria-current={isExhibitionActive ? "page" : undefined}
                        >
                          {t("menu.attractions.exhibition")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={paths.attractions.filmPath}
                          className={cx(
                            "ap-nav-dropdown-link block px-4 py-2",
                            isFilmPathActive && "is-active",
                          )}
                          aria-current={isFilmPathActive ? "page" : undefined}
                        >
                          {t("menu.attractions.film_path")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={paths.attractions.cinema}
                          className={cx(
                            "ap-nav-dropdown-link block px-4 py-2",
                            isCinemaActive && "is-active",
                          )}
                          aria-current={isCinemaActive ? "page" : undefined}
                        >
                          {t("menu.attractions.cinema")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <span className="ap-nav-separator text-white/40">|</span>
              <Link
                href={paths.events}
                className={cx("ap-nav-link", isEventsActive && "is-active")}
                aria-current={isEventsActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("nav.events")}
              </Link>
              <span className="ap-nav-separator text-white/40">|</span>
              <Link
                href={paths.gettingThere}
                className={cx("ap-nav-link", isGettingThereActive && "is-active")}
                aria-current={isGettingThereActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("nav.getting_there")}
              </Link>
            </nav>
          </div>

          {/* ŚRODEK: logo */}
          <div className="flex items-center justify-center px-1">
            <Link href={paths.home} aria-label={t("aria.home")} className="block">
              <span className={logoFrameClass}>
                <BrandLogo variant={theme === "light" ? "light" : "dark"} />
              </span>
            </Link>
          </div>

          {/* PRAWO: O nas + Kontakt (desktop) + Rezerwacja zawsze widoczna + switch języka */}
          <div className="flex items-center justify-end gap-2.5 md:gap-3 min-w-0">
            {/* linki desktop po PRAWEJ */}
            <nav className="hidden lg:flex items-center gap-2.5 xl:gap-3 text-[11px] xl:text-xs whitespace-nowrap">
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
                  }, 220);
                }}
              >
                <button
                  type="button"
                  className={cx(
                    "ap-nav-link ap-nav-link-button inline-flex items-center gap-1 focus:outline-none",
                    isAboutActive && "is-active",
                  )}
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
                  className={`ap-nav-dropdown absolute right-0 top-full mt-1 w-72 z-50 origin-top transition-all duration-150 ${openAbout ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-0.5 pointer-events-none"}`}
                >
                  <div className="ap-nav-dropdown-panel rounded-xl bg-[color:var(--ap-surface-contrast)] backdrop-blur ring-1 ring-[color:var(--ap-border)] shadow-xl overflow-hidden text-[color:var(--ap-text)]">
                    <ul className="py-2 text-xs">
                      <li>
                        <Link
                          href={paths.about}
                          className={cx(
                            "ap-nav-dropdown-link block px-4 py-2",
                            isAboutPageActive && "is-active",
                          )}
                          aria-current={isAboutPageActive ? "page" : undefined}
                        >
                          {t("nav.about_alvernia")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={paths.gallery}
                          className={cx(
                            "ap-nav-dropdown-link block px-4 py-2",
                            isGalleryActive && "is-active",
                          )}
                          aria-current={isGalleryActive ? "page" : undefined}
                        >
                          {t("nav.gallery")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={paths.vrTour}
                          className={cx(
                            "ap-nav-dropdown-link block px-4 py-2",
                            isVrTourActive && "is-active",
                          )}
                          aria-current={isVrTourActive ? "page" : undefined}
                        >
                          {t("nav.virtual_walk")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <span className="ap-nav-separator text-white/40">|</span>
              <Link
                href={paths.contact}
                className={cx("ap-nav-link whitespace-nowrap", isContactActive && "is-active")}
                aria-current={isContactActive ? "page" : undefined}
                suppressHydrationWarning
              >
                {t("nav.contact")}
              </Link>
            </nav>

            {/* CTA zawsze widoczne */}
            <PrimaryButton
              href={paths.booking}
              size="sm"
              suppressHydrationWarning
              className="min-w-[108px] px-3 py-1.5 lg:text-[11px] xl:text-xs text-center shrink-0"
              aria-current={isBookingActive ? "page" : undefined}
            >
              {t("cta.booking")}
            </PrimaryButton>

            {/* Theme switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`ap-icon-button hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 ${
                theme === "light" ? "text-[color:var(--ap-text)]" : "text-white"
              }`}
              aria-label={theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
              title={theme === "light" ? "Tryb ciemny" : "Tryb jasny"}
            >
              {theme === "light" ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
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
                  className="h-4 w-4"
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
          className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ${
            open ? "grid-rows-[1fr] opacity-100 overflow-visible" : "grid-rows-[0fr] opacity-0 overflow-hidden"
          }`}
          aria-hidden={!open}
        >
          <nav
            className={`min-h-0 bg-[var(--ap-nav-bg)] ${
              open ? "overflow-visible" : "overflow-hidden"
            }`}
          >
            <ul className="space-y-1 px-4 pb-4 pt-1 text-sm">
              <li>
                <span className={cx("ap-mobile-section-label block px-3 py-2", isAttractionsActive && "is-active")}>
                  {t("nav.attraction")}
                </span>
              </li>
              {/* submenu: Atrakcje (mobile) */}
              <li className="ml-3">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={paths.attractions.exhibition}
                      className={cx(
                        "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                        isExhibitionActive && "is-active",
                      )}
                      aria-current={isExhibitionActive ? "page" : undefined}
                    >
                      • {t("menu.attractions.exhibition")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={paths.attractions.filmPath}
                      className={cx(
                        "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                        isFilmPathActive && "is-active",
                      )}
                      aria-current={isFilmPathActive ? "page" : undefined}
                    >
                      • {t("menu.attractions.film_path")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={paths.attractions.cinema}
                      className={cx(
                        "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                        isCinemaActive && "is-active",
                      )}
                      aria-current={isCinemaActive ? "page" : undefined}
                    >
                      • {t("menu.attractions.cinema")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href={paths.events}
                  className={cx(
                    "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                    isEventsActive && "is-active",
                  )}
                  aria-current={isEventsActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  {t("nav.events")}
                </Link>
              </li>
              <li className="pt-1 border-t border-white/10 mt-1" />
              <li>
                <Link
                  href={paths.gettingThere}
                  className={cx(
                    "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                    isGettingThereActive && "is-active",
                  )}
                  aria-current={isGettingThereActive ? "page" : undefined}
                  suppressHydrationWarning
                >
                  {t("nav.getting_there")}
                </Link>
              </li>
              <li className="ml-3">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={paths.about}
                      className={cx(
                        "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                        isAboutPageActive && "is-active",
                      )}
                      aria-current={isAboutPageActive ? "page" : undefined}
                    >
                      • {t("nav.about_alvernia")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={paths.gallery}
                      className={cx(
                        "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                        isGalleryActive && "is-active",
                      )}
                      aria-current={isGalleryActive ? "page" : undefined}
                    >
                      • {t("nav.gallery")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={paths.vrTour}
                      className={cx(
                        "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                        isVrTourActive && "is-active",
                      )}
                      aria-current={isVrTourActive ? "page" : undefined}
                    >
                      • {t("nav.virtual_walk")}
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href={paths.contact}
                  className={cx(
                    "ap-mobile-link block rounded-md px-3 py-2 text-gray-200",
                    isContactActive && "is-active",
                  )}
                  aria-current={isContactActive ? "page" : undefined}
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
                    className="ap-icon-button inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 text-white"
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
