import type { Metadata } from "next";
import QrRedirectContent from "./QrRedirectContent";

// Strona docelowa kodu QR „MarsApp". Na produkcji (Apache) wykrycie systemu
// i przekierowanie robi .htaccess; ta strona to klient-side zapas + ręczne
// przyciski, gdyby przekierowanie serwerowe nie zadziałało.
export const metadata: Metadata = {
  title: "MarsApp: pobierz aplikację | Alvernia Planet",
  description:
    "Pobierz aplikację MarsApp Alvernia Planet: automatyczne przekierowanie do App Store (iOS) lub pobrania APK (Android).",
  robots: {
    index: false,
    follow: false,
  },
};

export default function QrCodeMarsAppPage() {
  return <QrRedirectContent />;
}
