import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import AppBar from "@/app/appbar";
import Footer from "@/app/components/Footer";
import FloatingDemoPromo from "@/app/components/FloatingDemoPromo";
import FloatingMascotCta from "@/app/components/FloatingMascotCta";
import ConsentTrackers from "@/app/components/ConsentTrackers";
import CookieConsent from "@/app/components/CookieConsent";
import { CONSENT_VERSION } from "@/lib/consent";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";

const AnalyticsTracker = dynamic(
  () => import("./components/AnalyticsTracker").then((mod) => mod.AnalyticsTracker),
);
const MetaPixelPageViewTracker = dynamic(
  () =>
    import("./components/MetaPixelPageViewTracker").then(
      (mod) => mod.MetaPixelPageViewTracker,
    ),
);
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-ap-sans",
});

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
      "@id": `${siteUrl}#organization`,
      name: "Alvernia Planet",
      url: siteUrl,
      logo: brandLogoUrl,
      sameAs: orgSameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: "Alvernia Planet",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}#organization` },
    },
    {
      // NAP spójne z Footer.tsx — bez współrzędnych/godzin, których nie ma w źródle.
      "@type": ["TouristAttraction", "MovieTheater", "LocalBusiness"],
      "@id": `${siteUrl}#place`,
      name: "Alvernia Planet",
      url: siteUrl,
      image: brandLogoUrl,
      logo: brandLogoUrl,
      telephone: "+48 12 344 40 00",
      priceRange: "49-79 PLN",
      address: {
        "@type": "PostalAddress",
        streetAddress: "ul. Ferdynanda Wspaniałego 1",
        postalCode: "32-566",
        addressLocality: "Nieporaz",
        addressCountry: "PL",
      },
      sameAs: orgSameAs,
      parentOrganization: { "@id": `${siteUrl}#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alvernia Planet: Film World - Poznaj świat filmu!",
  description:
    "Największe kino 360° w Europie (kopuła 48 m), Projekt MARS i FILMWORLD pod Krakowem. Cztery filmy fulldome, warsztaty i eventy dla całej rodziny. Rezerwuj bilety online.",
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
    description:
      "Największe kino 360° w Europie (kopuła 48 m), Projekt MARS i FILMWORLD pod Krakowem. Cztery filmy fulldome, warsztaty i eventy dla całej rodziny. Rezerwuj bilety online.",
    url: siteUrl,
    siteName: "Alvernia Planet",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/logo_alvernia_planet_neg_RGB.png",
        width: 1920,
        height: 1080,
        type: "image/png",
        alt: "Alvernia Planet logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alvernia Planet: Film World - Poznaj świat filmu!",
    description:
      "Największe kino 360° w Europie (kopuła 48 m), Projekt MARS i FILMWORLD pod Krakowem. Cztery filmy fulldome, warsztaty i eventy dla całej rodziny. Rezerwuj bilety online.",
    images: ["/logo_alvernia_planet_neg_RGB.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale: "pl" | "en" | "pt" = "pl";
  const gaMeasurementId = "G-WGCVPPB9KW";
  const gtmId = "GTM-TM3MNLWS";
  const metaPixelId = "1952585985650150";

  return (
    <html
      lang={initialLocale}
      suppressHydrationWarning
      className={`${poppins.variable} theme-dark`}
    >
      <head>
        {/* Preconnecty do Google/Meta świadomie usunięte — łączymy się z nimi
            dopiero po zgodzie użytkownika (patrz ConsentTrackers). */}
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="min-h-screen bg-[var(--ap-bg)] text-[color:var(--ap-text)] transition-colors duration-300">
        {/* Google Consent Mode v2 — domyślnie wszystko poza necessary = "denied".
            Ustawiane PRZED jakimkolwiek trackerem. Jeśli użytkownik już wcześniej
            wyraził zgodę, odczytujemy ją i od razu podnosimy do "granted".
            Same trackery (GA/GTM/Meta) ładuje dopiero <ConsentTrackers/> po zgodzie. */}
        <Script id="ap-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            var an='denied', ad='denied';
            try {
              var raw = window.localStorage.getItem('ap-cookie-consent');
              if (raw) {
                var c = JSON.parse(raw);
                if (c && c.v === ${CONSENT_VERSION}) {
                  an = c.analytics ? 'granted' : 'denied';
                  ad = c.marketing ? 'granted' : 'denied';
                }
              }
            } catch (e) {}
            gtag('consent','default',{
              ad_storage: ad,
              ad_user_data: ad,
              ad_personalization: ad,
              analytics_storage: an,
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
          `}
        </Script>
        <ThemeProvider>
          <I18nProvider initialLocale={initialLocale}>
            <div className="relative z-10 min-h-screen flex flex-col">
              <AppBar />
              {children}
              <Footer />
            </div>
            <FloatingDemoPromo />
            <FloatingMascotCta />
            <CookieConsent />
          </I18nProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        <AnalyticsTracker />
        <MetaPixelPageViewTracker />
        <ConsentTrackers gaId={gaMeasurementId} gtmId={gtmId} metaPixelId={metaPixelId} />
      </body>
    </html>
  );
}
