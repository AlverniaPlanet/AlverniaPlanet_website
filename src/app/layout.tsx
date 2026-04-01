import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";
import AppBar from "@/app/appbar";
import Footer from "@/app/components/Footer";
import BookeroRuntimeWarmup from "@/app/components/BookeroRuntimeWarmup";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";

const FloatingBookingButton = dynamic(
  () => import("@/app/components/FloatingBookingButton"),
);
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
  weight: ["300", "400", "500", "600", "700", "800"],
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
      <body className="min-h-screen bg-[var(--ap-bg)] text-[color:var(--ap-text)] transition-colors duration-300">
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
          `}
        </Script>
        <Script id="gtm-script" strategy="afterInteractive">
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
              <FloatingBookingButton />
            </div>
          </I18nProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
        <AnalyticsTracker />
        <MetaPixelPageViewTracker />
        <BookeroRuntimeWarmup />
      </body>
    </html>
  );
}
