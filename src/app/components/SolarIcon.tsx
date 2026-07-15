import type { CSSProperties } from "react";

// Nazwy ikon = pliki w /public/icon/<name>.svg (zestaw Solar Broken Line).
export type SolarIconName =
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "arrow-up-right"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "bus"
  | "train"
  | "plane"
  | "city"
  | "rocket"
  | "route"
  | "map-point"
  | "point-map"
  | "smartphone"
  | "clapperboard"
  | "videocamera"
  | "clock"
  | "calendar"
  | "globe"
  | "danger"
  | "restart"
  | "document"
  | "folder-add"
  | "link"
  | "lock"
  | "info"
  | "close"
  | "menu"
  | "play"
  | "planet"
  | "alien"
  | "ticket"
  | "phone"
  | "letter"
  | "gallery";

type SolarIconProps = {
  name: SolarIconName;
  className?: string;
  /** Rozmiar; domyślnie 1em (skaluje się z font-size, jak ikony fontowe). */
  size?: number | string;
  /** Podaj, gdy ikona niesie znaczenie (dostępność). Bez tego jest dekoracyjna. */
  title?: string;
};

// Ikona z zestawu Solar Broken Line. Plik SVG jest maską CSS, dzięki czemu ikona
// dziedziczy kolor tekstu (currentColor) i skaluje się jak glif fontu.
export function SolarIcon({ name, className = "", size = "1em", title }: SolarIconProps) {
  const mask = `url(/icon/${name}.svg) center / contain no-repeat`;
  const style: CSSProperties = {
    display: "inline-block",
    width: size,
    height: size,
    backgroundColor: "currentColor",
    WebkitMask: mask,
    mask,
    flexShrink: 0,
  };
  return (
    <span
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
