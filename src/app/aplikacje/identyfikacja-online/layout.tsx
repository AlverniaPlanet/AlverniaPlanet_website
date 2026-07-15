import type { Metadata } from "next";

// Prosta strona partnerska (kod rabatowy). Ma działać po wejściu w link,
// ale nie ma być indeksowana ani proponowana w wyszukiwarkach.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function IdentyfikacjaOnlineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
