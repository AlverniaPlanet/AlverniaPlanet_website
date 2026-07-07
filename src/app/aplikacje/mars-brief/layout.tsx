import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Layout tylko dla /aplikacje/mars-brief (wewnętrzna prezentacja/brief gościa).
// Ma DZIAŁAĆ po wejściu w link, ale nie ma być indeksowana ani proponowana w
// wyszukiwarkach (to narzędzie wewnętrzne, nie strona marketingowa).
//   <meta name="robots" content="noindex, nofollow">
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function MarsBriefLayout({ children }: { children: React.ReactNode }) {
  return children;
}
