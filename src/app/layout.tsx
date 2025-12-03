import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import AppBar from "@/app/appbar";
import Footer from "@/app/components/Footer";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";
import { SimpleStarfield } from "./components/SimpleStarfield";

export const metadata: Metadata = {
  title: "Alvernia Planet – Wycieczki edukacyjne",
  description: "Wycieczki i warsztaty edukacyjne. Rezerwuj online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dla static/SSG nie korzystamy z cookies() po stronie serwera
  // Domyślny język: PL, a przełączanie języka obsługuje I18nProvider po stronie klienta
  const initialLocale: "pl" | "en" = "pl";

  return (
    <html lang={initialLocale} suppressHydrationWarning className="theme-dark">
      <body className="min-h-screen bg-[var(--ap-bg)] text-[color:var(--ap-text)] transition-colors duration-300">
        <ThemeProvider>
          {/* Statyczne tło bez parallaxu, żeby uniknąć listenerów JS */}
          <SimpleStarfield className="fixed inset-0 -z-10" interactive={false} />
          <I18nProvider initialLocale={initialLocale}>
            <div className="relative z-10 min-h-screen flex flex-col">
              <AppBar />
              {children}
              <Footer />
            </div>
          </I18nProvider>
        </ThemeProvider>
        {/* Analytics: Plausible */}
        <Script
          strategy="afterInteractive"
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "alverniaplanet.pl"}
          src="https://plausible.io/js/script.js"
        />
      </body>
    </html>
  );
}
