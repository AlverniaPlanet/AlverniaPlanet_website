import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import AppBar from "@/app/appbar";
import Footer from "@/app/components/Footer";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";
import { SimpleStarfield } from "./components/SimpleStarfield";
import FloatingPromo from "./components/FloatingPromo";
import { AnalyticsTracker } from "./components/AnalyticsTracker";

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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
              <FloatingPromo />
            </div>
          </I18nProvider>
        </ThemeProvider>
        <AnalyticsTracker />
        {gaMeasurementId ? (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
