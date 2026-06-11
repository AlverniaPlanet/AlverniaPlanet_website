// Zasoby zespołu wyświetlane na /goteam.
// Aby dodać nowy zasób, dopisz kolejny obiekt do tablicy RESOURCES.
// Pole `type` decyduje o ikonie ("drive" | "sheet" | "doc" | "link").

export type ResourceType = "drive" | "sheet" | "doc" | "link";

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

export const RESOURCES: Resource[] = [
  {
    id: "dysk",
    type: "drive",
    title: "Dysk Google – zasoby zespołu",
    desc: "Wspólny folder z materiałami, plikami i dokumentami.",
    href: "https://drive.google.com/drive/folders/1e7MuyphAZN98W6PXT3gSqFSxYuadb9ou?usp=share_link",
    cta: "Otwórz dysk",
  },
  {
    id: "kalendarz",
    type: "sheet",
    title: "Kalendarz / grafik",
    desc: "Arkusz Google z grafikiem i terminami zespołu.",
    href: "https://docs.google.com/spreadsheets/d/1Ttr6bYSG2pmTem6wBVTrloDMhIMU9n4lMtiQzntqrXk/edit?gid=919133707#gid=919133707",
    cta: "Otwórz kalendarz",
  },
  {
    id: "raporty",
    type: "drive",
    title: "Raporty sprzedażowe",
    desc: "Folder Google z raportami sprzedaży.",
    href: "https://drive.google.com/drive/folders/1BVwxVbTCnLjCTin9aCSgxprysG3na7Hs",
    cta: "Otwórz raporty",
  },
];
