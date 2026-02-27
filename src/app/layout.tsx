import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import AppBar from "@/app/appbar";
import Footer from "@/app/components/Footer";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";
import { AnalyticsTracker } from "./components/AnalyticsTracker";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alverniaplanet.com";
const orgSameAs = [
  "https://www.facebook.com/alverniaplanet/",
  "https://www.instagram.com/alverniaplanet/",
  "https://www.tiktok.com/@alverniaplanetedu",
];
const brandLogoPath = "/logo_alvernia_planet_neg_RGB.png";
const brandLogoUrl = `${siteUrl}${brandLogoPath}`;
const schemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Alvernia Planet",
      url: siteUrl,
      logo: brandLogoUrl,
      sameAs: orgSameAs,
    },
    {
      "@type": "WebSite",
      name: "Alvernia Planet",
      url: siteUrl,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alvernia Planet: Film World - Poznaj świat filmu!",
  description: "Wycieczki i warsztaty edukacyjne. Rezerwuj online.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Alvernia Planet: Film World - Poznaj świat filmu!",
    description: "Wycieczki i warsztaty edukacyjne. Rezerwuj online.",
    url: siteUrl,
    siteName: "Alvernia Planet",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/logo_alvernia_planet_neg_RGB.png",
        width: 1920,
        height: 1080,
        alt: "Alvernia Planet logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alvernia Planet: Film World - Poznaj świat filmu!",
    description: "Wycieczki i warsztaty edukacyjne. Rezerwuj online.",
    images: ["/logo_alvernia_planet_neg_RGB.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dla static/SSG nie korzystamy z cookies() po stronie serwera
  // Domyślny język: PL, a przełączanie języka obsługuje I18nProvider po stronie klienta
  const initialLocale: "pl" | "en" | "pt" = "pl";
  const gaMeasurementId = "G-WGCVPPB9KW";
  const gtmId = "GTM-TM3MNLWS";

  return (
    <html lang={initialLocale} suppressHydrationWarning className="theme-dark">
      <body className="min-h-screen bg-[var(--ap-bg)] text-[color:var(--ap-text)] transition-colors duration-300">
        <Script
          strategy="beforeInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        />
        <Script id="ga4-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <Script id="gtm-script" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <ThemeProvider>
          <I18nProvider initialLocale={initialLocale}>
            <div className="relative z-10 min-h-screen flex flex-col">
              <AppBar />
              {children}
              <Footer />
            </div>
          </I18nProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        <AnalyticsTracker />
        <Script
          id="basesystem-shop-script"
          src="https://sklep.homelinux.net/assets/webcomponents/shop.js?id=fa587381f833df282ce9"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
