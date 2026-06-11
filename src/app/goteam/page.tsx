import type { Metadata } from "next";
import GoTeamContent from "./GoTeamContent";

// Wewnętrzna podstrona zespołu – dostępna tylko pod bezpośrednim linkiem
// /goteam, za bramką login/hasło. Bez odnośnika w nawigacji, wykluczona
// z indeksowania i z mapy strony.
export const metadata: Metadata = {
  title: "GoTeam | Alvernia Planet",
  description: "Wewnętrzny panel zasobów zespołu Alvernia Planet.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function GoTeamPage() {
  return <GoTeamContent />;
}
