import type { Metadata } from "next";

// Krótszy alias kodu QR "MarsApp" (/qrcode -> ta sama strona co /qrcodemarsapp).
// Na produkcji (Apache) wykrycie systemu i przekierowanie robi .htaccess,
// zanim ta strona zostanie podana; to jest kliencki zapas + ręczne przyciski.
export const metadata: Metadata = {
  title: "MarsApp: pobierz aplikację | Alvernia Planet",
  description:
    "Pobierz aplikację MarsApp Alvernia Planet: automatyczne przekierowanie do App Store (iOS) lub Google Play (Android).",
  robots: {
    index: false,
    follow: false,
  },
};

export { default } from "../qrcodemarsapp/page";
