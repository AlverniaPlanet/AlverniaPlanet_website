import type { CSSProperties } from "react";
import {
  AirplaneTilt,
  Alien,
  Armchair,
  Baby,
  BowlFood,
  ArrowClockwise,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  ArrowUpRight,
  ArrowsVertical,
  Buildings,
  Bell,
  Bus,
  CalendarBlank,
  Car,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  ChatCircle,
  CheckCircle,
  Coffee,
  Cookie,
  Clock,
  Copy,
  Crown,
  Drop,
  CornersOut,
  DeviceMobile,
  EnvelopeSimple,
  Eye,
  FileText,
  FilmReel,
  FilmSlate,
  Fingerprint,
  FolderPlus,
  ForkKnife,
  Garage,
  Gear,
  Globe,
  Hamburger,
  Hexagon,
  IceCream,
  Headset,
  Images,
  Info,
  Lightning,
  Leaf,
  Link as LinkIcon,
  List,
  Lock,
  MagnifyingGlass,
  MagnifyingGlassPlus,
  MapPin,
  MapTrifold,
  Monitor,
  NavigationArrow,
  Package,
  Path,
  PersonSimpleWalk,
  Phone,
  Planet,
  Play,
  Rabbit,
  RoadHorizon,
  Robot,
  Rocket,
  Scales,
  Stack,
  Star,
  Storefront,
  Ticket,
  Train,
  Truck,
  UserCircle,
  Users,
  VideoCamera,
  Warning,
  Wind,
  Waveform,
  X,
  type Icon as PhosphorIcon,
  type IconWeight,
} from "@phosphor-icons/react";

/* Jeden zestaw ikon w całym serwisie: Phosphor.
   Nazwy zostały te same co wcześniej, żeby nie przepisywać ~75 miejsc wywołania
   — mapa jest statyczna i z jawnymi importami, więc tree-shaking działa,
   a eksport statyczny nie dostaje żadnego dynamicznego importu po stringu. */
const IKONY = {
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "chevron-down": CaretDown,
  "chevron-left": CaretLeft,
  "chevron-right": CaretRight,
  "chevron-up": CaretUp,
  bus: Bus,
  train: Train,
  plane: AirplaneTilt,
  city: Buildings,
  buildings: Buildings,
  company: Buildings,
  soundwave: Waveform,
  star: Star,
  crown: Crown,
  "fork-knife": ForkKnife,
  burger: Hamburger,
  "bowl-food": BowlFood,
  coffee: Coffee,
  "ice-cream": IceCream,
  cookie: Cookie,
  leaf: Leaf,
  /* Dopisane dla sekcji „Rok 2035" na /mars-colonization (zasoby misji).
     To ta sama paczka, która już jest w projekcie — mapa z jawnymi importami
     jest po to, żeby ją rozszerzać, a nie instalować drugą bibliotekę. */
  drop: Drop,
  wind: Wind,
  hexagon: Hexagon,
  baby: Baby,
  "check-circle": CheckCircle,
  storefront: Storefront,
  scale: Scales,
  delivery: Truck,
  garage: Garage,
  rocket: Rocket,
  route: Path,
  "map-point": MapPin,
  "point-map": MapTrifold,
  smartphone: DeviceMobile,
  clapperboard: FilmSlate,
  "clapperboard-play": FilmReel,
  videocamera: VideoCamera,
  clock: Clock,
  calendar: CalendarBlank,
  globe: Globe,
  danger: Warning,
  restart: ArrowClockwise,
  document: FileText,
  "folder-add": FolderPlus,
  link: LinkIcon,
  lock: Lock,
  info: Info,
  bell: Bell,
  gear: Gear,
  fingerprint: Fingerprint,
  close: X,
  menu: List,
  play: Play,
  planet: Planet,
  alien: Alien,
  ticket: Ticket,
  phone: Phone,
  letter: EnvelopeSimple,
  email: EnvelopeSimple,
  gallery: Images,
  "full-screen": CornersOut,
  "zoom-in": MagnifyingGlassPlus,
  "arrows-vertical": ArrowsVertical,
  bolt: Lightning,
  monitor: Monitor,
  armchair: Armchair,
  layers: Stack,
  box: Package,
  eye: Eye,
  car: Car,
  walking: PersonSimpleWalk,
  road: RoadHorizon,
  navigation: NavigationArrow,
  headphones: Headset,
  copy: Copy,
  "external-link": ArrowSquareOut,
  rabbit: Rabbit,
  guests: Users,
  message: ChatCircle,
  name: UserCircle,
  robots: Robot,
  googlebot: MagnifyingGlass,
} satisfies Record<string, PhosphorIcon>;

/* Jedyny wyjątek: Phosphor nie ma znaku parkingu, a tabliczka „P” jest wprost
   z zatwierdzonej makiety /jak-dojechac. Renderujemy ją po staremu — plikiem
   SVG jako maską CSS — żeby nie podmieniać jej na ikonę o innym znaczeniu. */
const WLASNE = { parking: "/wspolne/ikony/parking.svg" } as const;

export type SolarIconName = keyof typeof IKONY | keyof typeof WLASNE;

type SolarIconProps = {
  name: SolarIconName;
  className?: string;
  /** Rozmiar; domyślnie 1em (skaluje się z font-size, jak glif fontu). */
  size?: number | string;
  /** Grubość kreski. Domyślnie „regular”; „bold” dla stanu aktywnego. */
  weight?: IconWeight;
  /** Podaj, gdy ikona niesie znaczenie (dostępność). Bez tego jest dekoracyjna. */
  title?: string;
};

export function SolarIcon({ name, className = "", size = "1em", weight = "regular", title }: SolarIconProps) {
  if (name in WLASNE) {
    const mask = `url(${WLASNE[name as keyof typeof WLASNE]}) center / contain no-repeat`;
    return (
      <span
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          backgroundColor: "currentColor",
          WebkitMask: mask,
          mask,
          flexShrink: 0,
        }}
        role={title ? "img" : undefined}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      />
    );
  }

  const Ikona = IKONY[name as keyof typeof IKONY];
  /* `flex-shrink` zostaje w stylu inline, bo ikona bywa dzieckiem flexa
     i bez tego kurczy się przy ciasnych etykietach. */
  const style: CSSProperties = { flexShrink: 0 };
  return (
    <Ikona
      className={className}
      size={size}
      weight={weight}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}
