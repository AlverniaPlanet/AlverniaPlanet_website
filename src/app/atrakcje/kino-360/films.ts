// Wspólne dane repertuaru Kina 360 — używane przez stronę kina (K360Content)
// oraz podstrony filmów (/atrakcje/kino-360/[slug]).

import { type Locale } from "@/lib/localizedRoutes";
export type { Locale };

// --- Meta wspólne dla języków (tytuł, plakat, format, kolejność) ---
export type FilmMeta = {
  slug: string;
  title: string;
  poster: string;
  badges: string[];
  nowShowing?: boolean;
};

export const FILMS: readonly FilmMeta[] = [
  { slug: "one-step-beyond", title: "One Step Beyond: A Journey to Mars", poster: "/atrakcje/kino-360/Seanse/one-step-beyond.webp", badges: ["Fulldome 360°", "~30 min"], nowShowing: true },
  { slug: "the-stellars", title: "The Stellars", poster: "/atrakcje/kino-360/Seanse/the-stellars.webp", badges: ["Fulldome 4K", "~30 min"] },
  { slug: "time", title: "TIME", poster: "/atrakcje/kino-360/Seanse/time.webp", badges: ["Fulldome 4K", "~30 min"] },
  { slug: "explore", title: "Explore", poster: "/atrakcje/kino-360/Seanse/explore.webp", badges: ["Fulldome 4K", "27 min"] },
];

// --- Język seansów ---
// Wszystkie filmy w kopule lecą z polską ścieżką dźwiękową. Dla widza z zagranicy
// to informacja krytyczna przed kupnem biletu, dla polskiego widza potwierdzenie,
// że nie trafi na wersję obcojęzyczną. Pokazujemy ją jako plakietkę z flagą
// (patrz LanguageBadge) na kartach repertuaru i na podstronach filmów.
export const FILM_LANGUAGE_COPY: Record<Locale, { badge: string; note: string }> = {
  pl: { badge: "Wersja polska", note: "Seans w wersji polskiej." },
  en: { badge: "Polish audio", note: "The film is screened with Polish audio." },
  pt: { badge: "Áudio em polaco", note: "A sessão é exibida com áudio em polaco." },
  de: { badge: "Polnische Tonspur", note: "Der Film wird mit polnischer Tonspur gezeigt." },
  zh: { badge: "波兰语配音", note: "本场放映为波兰语配音。" },
};

// Czas trwania seansu. Wcześniej był wyłuskiwany z `badges`, ale te są WSPÓLNE
// dla wszystkich języków, więc na stronach /zh i /de wyświetlało się łacińskie
// „~30 min" pośród chińskiego i niemieckiego tekstu. Trzymamy więc samą liczbę
// minut (jedno źródło prawdy) i formatujemy ją per język.
export const FILM_DURATION: Record<string, { min: number; approx: boolean }> = {
  "one-step-beyond": { min: 30, approx: true },
  "the-stellars": { min: 30, approx: true },
  time: { min: 30, approx: true },
  explore: { min: 27, approx: false },
};

const DURATION_LABEL: Record<Locale, (min: number, approx: boolean) => string> = {
  pl: (m, a) => `${a ? "~" : ""}${m} min`,
  en: (m, a) => `${a ? "~" : ""}${m} min`,
  pt: (m, a) => `${a ? "~" : ""}${m} min`,
  de: (m, a) => `${a ? "ca. " : ""}${m} Min.`,
  zh: (m, a) => `${a ? "约 " : ""}${m} 分钟`,
};

export function filmDuration(film: FilmMeta, locale: Locale): string | undefined {
  const d = FILM_DURATION[film.slug];
  if (!d) return undefined;
  return (DURATION_LABEL[locale] ?? DURATION_LABEL.pl)(d.min, d.approx);
}

// Plakietki filmu do WYŚWIETLENIA: format zostaje jak w danych (termin branżowy),
// a czas trwania podmieniamy na wersję w języku strony.
export function filmBadges(film: FilmMeta, locale: Locale): string[] {
  const czas = filmDuration(film, locale);
  return film.badges.map((b) => (/\d\s*min/i.test(b) && czas ? czas : b));
}

export const FILM_SLUGS = FILMS.map((f) => f.slug);
export function findFilm(slug: string): FilmMeta | undefined {
  return FILMS.find((f) => f.slug === slug);
}
export function filmIndex(slug: string): number {
  return FILMS.findIndex((f) => f.slug === slug);
}

// --- Krótki opis na kartach repertuaru ---
export type FilmText = { tagline: string; desc: string; audience: string };
export const FILMS_COPY: Record<Locale, Record<string, FilmText>> = {
  pl: {
    "one-step-beyond": {
      tagline: "Podróż na Marsa w pełnej kopule 360°.",
      desc: "Wyrusz poza Ziemię i przeżyj wyprawę na Czerwoną Planetę, gdy obraz otacza Cię z każdej strony i nad głową.",
      audience: "Dla wszystkich",
    },
    time: {
      tagline: "Czym naprawdę jest czas?",
      desc: "Podróż przez historię ludzkości i współczesną naukę: od pierwszych zegarów po teorię względności Einsteina. TIME zgłębia jedną z największych tajemnic Wszechświata.",
      audience: "8+ · rodziny · dorośli",
    },
    explore: {
      tagline: "Nagradzana podróż na Marsa śladami Keplera.",
      desc: "Historia ludzkiej ambicji dotarcia na Marsa, opowiedziana przez pryzmat praw Keplera i historii astronomii. Wielokrotnie nagradzana produkcja fulldome.",
      audience: "Starsze dzieci · rodziny · dorośli",
    },
    "the-stellars": {
      tagline: "Kosmiczna przygoda dla najmłodszych.",
      desc: "Barwna, interaktywna opowieść o tym, czego rośliny potrzebują do życia. Aki, Imani i John wciągają dzieci do wspólnej misji ratowania kosmicznego lasu.",
      audience: "Dzieci 3-8 · rodziny",
    },
  },
  en: {
    "one-step-beyond": {
      tagline: "A journey to Mars across the full 360° dome.",
      desc: "Leave Earth behind and experience the voyage to the Red Planet as the image surrounds you from every side and overhead.",
      audience: "For everyone",
    },
    time: {
      tagline: "What is time, really?",
      desc: "A journey through human history and modern science: from the first clocks to Einstein's relativity. TIME explores one of the greatest mysteries of the Universe.",
      audience: "8+ · families · adults",
    },
    explore: {
      tagline: "An award-winning journey to Mars, guided by Kepler.",
      desc: "The story of humanity's ambition to reach Mars, told through Kepler's laws and the history of astronomy. A multi-award-winning fulldome production.",
      audience: "Older children · families · adults",
    },
    "the-stellars": {
      tagline: "A cosmic adventure for the youngest.",
      desc: "A colourful, interactive story about what plants need to live. Aki, Imani and John pull children into a shared mission to save a cosmic forest.",
      audience: "Kids 3-8 · families",
    },
  },
  pt: {
    "one-step-beyond": {
      tagline: "Uma viagem a Marte na cúpula 360°.",
      desc: "Deixa a Terra para trás e vive a viagem ao Planeta Vermelho, com a imagem a envolver-te de todos os lados e por cima.",
      audience: "Para todos",
    },
    time: {
      tagline: "O que é realmente o tempo?",
      desc: "Uma viagem pela história da humanidade e a ciência moderna: dos primeiros relógios à relatividade de Einstein. TIME explora um dos maiores mistérios do Universo.",
      audience: "8+ · famílias · adultos",
    },
    explore: {
      tagline: "Uma viagem premiada a Marte, guiada por Kepler.",
      desc: "A história da ambição humana de chegar a Marte, contada através das leis de Kepler e da história da astronomia. Uma produção fulldome premiada.",
      audience: "Crianças mais velhas · famílias · adultos",
    },
    "the-stellars": {
      tagline: "Uma aventura cósmica para os mais pequenos.",
      desc: "Uma história colorida e interativa sobre o que as plantas precisam para viver. Aki, Imani e John envolvem as crianças numa missão para salvar uma floresta cósmica.",
      audience: "Crianças 3-8 · famílias",
    },
  },
  de: {
    "one-step-beyond": {
      tagline: "Eine Reise zum Mars in der vollen 360°-Kuppel.",
      desc: "Lassen Sie die Erde hinter sich und erleben Sie die Reise zum Roten Planeten, während das Bild Sie von allen Seiten und über Ihrem Kopf umgibt.",
      audience: "Für alle",
    },
    time: {
      tagline: "Was ist Zeit wirklich?",
      desc: "Eine Reise durch die Menschheitsgeschichte und die moderne Wissenschaft: von den ersten Uhren bis zu Einsteins Relativitätstheorie. TIME ergründet eines der größten Rätsel des Universums.",
      audience: "8+ · Familien · Erwachsene",
    },
    explore: {
      tagline: "Eine preisgekrönte Reise zum Mars, geführt von Kepler.",
      desc: "Die Geschichte des menschlichen Strebens, den Mars zu erreichen, erzählt anhand der Keplerschen Gesetze und der Geschichte der Astronomie. Eine vielfach ausgezeichnete Fulldome-Produktion.",
      audience: "Ältere Kinder · Familien · Erwachsene",
    },
    "the-stellars": {
      tagline: "Ein kosmisches Abenteuer für die Jüngsten.",
      desc: "Eine farbenfrohe, interaktive Geschichte darüber, was Pflanzen zum Leben brauchen. Aki, Imani und John nehmen die Kinder mit auf eine gemeinsame Mission, um einen kosmischen Wald zu retten.",
      audience: "Kinder 3-8 · Familien",
    },
  },
  zh: {
    "one-step-beyond": {
      tagline: "在360°全穹顶中开启火星之旅。",
      desc: "离开地球，踏上前往红色星球的旅程，画面从四面八方与头顶将您完全包围。",
      audience: "适合所有人",
    },
    time: {
      tagline: "时间究竟是什么？",
      desc: "一场穿越人类历史与现代科学的旅程：从最早的时钟到爱因斯坦的相对论。TIME 探索宇宙最大的谜题之一。",
      audience: "8岁以上 · 家庭 · 成人",
    },
    explore: {
      tagline: "追随开普勒的脚步，屡获殊荣的火星之旅。",
      desc: "影片讲述人类抵达火星的雄心，通过开普勒定律与天文学史娓娓道来。一部屡获大奖的全穹顶作品。",
      audience: "大龄儿童 · 家庭 · 成人",
    },
    "the-stellars": {
      tagline: "为最年幼观众打造的宇宙冒险。",
      desc: "一个色彩缤纷的互动故事，讲述植物生长需要什么。Aki、Imani 和 John 带领孩子们共同展开拯救宇宙森林的任务。",
      audience: "3-8岁儿童 · 家庭",
    },
  },
};

// --- Dane podstrony filmu: kolor akcentu (trochę nasz róż, trochę z filmu) + galeria ---
export type FilmDetailMeta = {
  accent: string;
  accentSoft: string;
  gallery: string[];
  studio?: string;
  // object-position plakatu w kafelku (gdy cover przycina ważny fragment, np. tytuł u góry).
  posterPos?: string;
  // Adres osadzenia zwiastuna (Vimeo/YouTube embed) — okienko teasera na podstronie.
  trailer?: string;
};

const galleryOf = (dir: string) =>
  [1, 2, 3, 4].map((i) => `/atrakcje/kino-360/Seanse/${dir}/content/g${i}.webp`);

export const FILM_DETAILS: Record<string, FilmDetailMeta> = {
  "one-step-beyond": { accent: "#ff6a3d", accentSoft: "#ff9a6a", gallery: galleryOf("One_step_beyond"), posterPos: "50% 22%", trailer: "https://www.youtube.com/embed/M4TkXrFogNw" },
  time: { accent: "#a855f7", accentSoft: "#c99bf5", gallery: galleryOf("Time"), studio: "Creative Planet", trailer: "https://player.vimeo.com/video/1205912482?h=151f317e30" },
  explore: { accent: "#4f8bff", accentSoft: "#8fb4ff", gallery: galleryOf("Explore"), studio: "Creative Planet", trailer: "https://player.vimeo.com/video/244831817?h=d08e20aecd" },
  "the-stellars": { accent: "#14c4b0", accentSoft: "#6fe0d2", gallery: galleryOf("The_Stellars"), studio: "Creative Planet", trailer: "https://player.vimeo.com/video/937348940?h=05121cc81a" },
};

// --- Rozbudowany opis podstrony ---
export type FilmDetailText = { about: string[]; learn: string[]; awardsNote?: string };
export const FILM_DETAILS_COPY: Record<Locale, Record<string, FilmDetailText>> = {
  pl: {
    "one-step-beyond": {
      about: [
        "One Step Beyond zabiera widzów w pełną podróż z Ziemi na Marsa. Obraz wypełnia całą kopułę, więc Czerwona Planeta otacza Cię z każdej strony i nad głową.",
        "To seans łączący rozmach kinowych wizualizacji z immersją kopuły 360°, dający poczucie realnej obecności w kosmicznej wyprawie.",
      ],
      learn: ["Wyprawa z Ziemi na Marsa", "Eksploracja Czerwonej Planety", "Immersja pełnej kopuły 360°"],
    },
    time: {
      about: [
        "TIME to produkcja fulldome studia Creative Planet dla starszych dzieci, rodzin i dorosłych. Film prowadzi od rytmów natury i pierwszych prób mierzenia czasu, przez teorię względności i czasoprzestrzeń, aż po ludzką percepcję „teraz”.",
        "Arystoteles, Newton, Maxwell i Einstein pojawiają się jako uczestnicy nieustającej dyskusji o naturze czasu. Zamiast upraszczać złożone idee, TIME prowadzi przez nie krok po kroku, budując zrozumienie dzięki immersji.",
      ],
      learn: ["Czas w przyrodzie i dziejach ludzkości", "Teoria względności i czasoprzestrzeń", "Entropia i strzałka czasu", "Ludzkie doświadczenie „teraz”"],
    },
    explore: {
      about: [
        "Explore opowiada historię ludzkiej ambicji dotarcia na Marsa, prezentując przy tym szeroki zakres nauki: od historii astronomii, przez modele geo- i heliocentryczny, po prawa Keplera i manewry orbitalne.",
        "Astronauci opuszczają Ziemię, wykonują manewry Hohmanna i dokują do stacji kosmicznej, by wyruszyć ku Marsowi. W kinowych wizualizacjach film pokazuje, jak prawa Keplera prowadzą statek z Ziemi na orbitę i dalej.",
      ],
      learn: ["Historia astronomii", "Model helio- i geocentryczny", "Trzy prawa Keplera", "Manewry orbitalne"],
      awardsNote: "Wielokrotnie nagradzany na międzynarodowych festiwalach (m.in. Jena, IPS, Cannes, Brno).",
    },
    "the-stellars": {
      about: [
        "The Stellars to kinowej jakości animacja CGI dla najmłodszych (3-8 lat). Aki, Imani i John rozbijają się na Ziemi i, z pomocą dzieci w planetarium, ruszają uratować swój kosmiczny las Yumi-Plumi.",
        "Przełamując czwartą ścianę, bohaterowie angażują dzieci we wspólną misję: odkrycie, czego rośliny potrzebują do życia. Zabawa łączy się tu z nauką, by pobudzić wyobraźnię i ciekawość.",
      ],
      learn: ["Czego rośliny potrzebują do życia", "Różnorodność środowisk na Ziemi", "Rola lasów jako siedlisk", "Obserwacja i metoda naukowa"],
      awardsNote: "Światowa premiera na festiwalu IPS w Jenie (2024).",
    },
  },
  en: {
    "one-step-beyond": {
      about: [
        "One Step Beyond takes viewers on a full journey from Earth to Mars. The image fills the entire dome, so the Red Planet surrounds you from every side and overhead.",
        "It blends cinematic visuals with the immersion of the 360° dome, giving a real sense of being present on a cosmic voyage.",
      ],
      learn: ["The voyage from Earth to Mars", "Exploring the Red Planet", "Full 360° dome immersion"],
    },
    time: {
      about: [
        "TIME is a fulldome production by Creative Planet for older children, families and adults. It moves from the rhythms of nature and the first attempts to measure time, through relativity and spacetime, to the human perception of 'now'.",
        "Aristotle, Newton, Maxwell and Einstein appear as participants in an ongoing debate about the nature of time. Rather than oversimplifying complex ideas, TIME leads through them step by step, building understanding through immersion.",
      ],
      learn: ["Time in nature and human history", "Relativity and spacetime", "Entropy and the arrow of time", "The human experience of 'now'"],
    },
    explore: {
      about: [
        "Explore tells the story of humanity's ambition to reach Mars, presenting a wide range of science along the way: from the history of astronomy, through the geo- and heliocentric models, to Kepler's laws and orbital maneuvers.",
        "Astronauts leave Earth, perform Hohmann transfers and dock with a space station before heading for Mars. In cinematic visuals, the film shows how Kepler's laws carry the ship from Earth to orbit and beyond.",
      ],
      learn: ["History of astronomy", "Heliocentric and geocentric models", "Kepler's three laws", "Orbital maneuvers"],
      awardsNote: "Multi-award-winning at international festivals (incl. Jena, IPS, Cannes, Brno).",
    },
    "the-stellars": {
      about: [
        "The Stellars is a cinema-quality CGI animation for the youngest viewers (ages 3-8). Aki, Imani and John crash on Earth and, with help from the children in the planetarium, set out to save their cosmic Yumi-Plumi forest.",
        "Breaking the fourth wall, the characters draw children into a shared mission: discovering what plants need to live. Play meets learning to spark imagination and curiosity.",
      ],
      learn: ["What plants need to live", "The diversity of Earth's environments", "The role of forests as habitats", "Observation and the scientific method"],
      awardsNote: "World premiere at the IPS festival in Jena (2024).",
    },
  },
  pt: {
    "one-step-beyond": {
      about: [
        "One Step Beyond leva os espetadores numa viagem completa da Terra a Marte. A imagem preenche toda a cúpula, por isso o Planeta Vermelho envolve-te de todos os lados e por cima.",
        "Combina visuais cinematográficos com a imersão da cúpula 360°, dando a sensação real de estar presente numa viagem cósmica.",
      ],
      learn: ["A viagem da Terra a Marte", "Explorar o Planeta Vermelho", "Imersão total na cúpula 360°"],
    },
    time: {
      about: [
        "TIME é uma produção fulldome da Creative Planet para crianças mais velhas, famílias e adultos. Vai dos ritmos da natureza e das primeiras tentativas de medir o tempo, passando pela relatividade e o espaço-tempo, até à perceção humana do 'agora'.",
        "Aristóteles, Newton, Maxwell e Einstein surgem como participantes num debate contínuo sobre a natureza do tempo. Em vez de simplificar ideias complexas, TIME conduz-nos através delas passo a passo, através da imersão.",
      ],
      learn: ["O tempo na natureza e na história humana", "Relatividade e espaço-tempo", "Entropia e a seta do tempo", "A experiência humana do 'agora'"],
    },
    explore: {
      about: [
        "Explore conta a história da ambição humana de chegar a Marte, apresentando uma vasta gama de ciência: da história da astronomia, passando pelos modelos geo- e heliocêntrico, até às leis de Kepler e às manobras orbitais.",
        "Os astronautas deixam a Terra, executam transferências de Hohmann e acoplam a uma estação espacial antes de rumar a Marte. Em visuais cinematográficos, o filme mostra como as leis de Kepler levam a nave da Terra à órbita e mais além.",
      ],
      learn: ["História da astronomia", "Modelos helio- e geocêntrico", "As três leis de Kepler", "Manobras orbitais"],
      awardsNote: "Premiado em vários festivais internacionais (incl. Jena, IPS, Cannes, Brno).",
    },
    "the-stellars": {
      about: [
        "The Stellars é uma animação CGI de qualidade cinematográfica para os mais pequenos (3-8 anos). Aki, Imani e John despenham-se na Terra e, com a ajuda das crianças no planetário, partem para salvar a sua floresta cósmica Yumi-Plumi.",
        "Quebrando a quarta parede, as personagens envolvem as crianças numa missão comum: descobrir o que as plantas precisam para viver. A diversão junta-se à aprendizagem para despertar a imaginação e a curiosidade.",
      ],
      learn: ["O que as plantas precisam para viver", "A diversidade dos ambientes da Terra", "O papel das florestas como habitats", "Observação e método científico"],
      awardsNote: "Estreia mundial no festival IPS em Jena (2024).",
    },
  },
  de: {
    "one-step-beyond": {
      about: [
        "One Step Beyond nimmt die Zuschauer mit auf die komplette Reise von der Erde zum Mars. Das Bild füllt die gesamte Kuppel, sodass der Rote Planet Sie von allen Seiten und über Ihrem Kopf umgibt.",
        "Der Film verbindet kinoreife Bilder mit der Immersion der 360°-Kuppel und vermittelt das echte Gefühl, bei einer Weltraumexpedition dabei zu sein.",
      ],
      learn: ["Die Reise von der Erde zum Mars", "Erkundung des Roten Planeten", "Volle Immersion in der 360°-Kuppel"],
    },
    time: {
      about: [
        "TIME ist eine Fulldome-Produktion des Studios Creative Planet für ältere Kinder, Familien und Erwachsene. Der Film führt von den Rhythmen der Natur und den ersten Versuchen, die Zeit zu messen, über Relativitätstheorie und Raumzeit bis zur menschlichen Wahrnehmung des „Jetzt“.",
        "Aristoteles, Newton, Maxwell und Einstein treten als Teilnehmer einer fortwährenden Debatte über das Wesen der Zeit auf. Statt komplexe Ideen zu vereinfachen, führt TIME Schritt für Schritt durch sie hindurch und schafft Verständnis durch Immersion.",
      ],
      learn: ["Die Zeit in der Natur und in der Menschheitsgeschichte", "Relativitätstheorie und Raumzeit", "Entropie und der Zeitpfeil", "Das menschliche Erleben des „Jetzt“"],
    },
    explore: {
      about: [
        "Explore erzählt die Geschichte des menschlichen Strebens, den Mars zu erreichen, und präsentiert dabei ein breites Spektrum an Wissenschaft: von der Geschichte der Astronomie über das geo- und heliozentrische Weltbild bis zu den Keplerschen Gesetzen und Bahnmanövern.",
        "Astronauten verlassen die Erde, führen Hohmann-Transfers durch und koppeln an eine Raumstation an, bevor es zum Mars geht. In kinoreifen Bildern zeigt der Film, wie die Keplerschen Gesetze das Raumschiff von der Erde in den Orbit und darüber hinaus tragen.",
      ],
      learn: ["Geschichte der Astronomie", "Helio- und geozentrisches Weltbild", "Die drei Keplerschen Gesetze", "Bahnmanöver"],
      awardsNote: "Vielfach ausgezeichnet auf internationalen Festivals (u. a. Jena, IPS, Cannes, Brno).",
    },
    "the-stellars": {
      about: [
        "The Stellars ist eine CGI-Animation in Kinoqualität für die jüngsten Zuschauer (3-8 Jahre). Aki, Imani und John stürzen auf der Erde ab und machen sich mit Hilfe der Kinder im Planetarium auf, ihren kosmischen Wald Yumi-Plumi zu retten.",
        "Die Figuren durchbrechen die vierte Wand und binden die Kinder in eine gemeinsame Mission ein: herauszufinden, was Pflanzen zum Leben brauchen. Spiel trifft auf Lernen und weckt Fantasie und Neugier.",
      ],
      learn: ["Was Pflanzen zum Leben brauchen", "Die Vielfalt der Lebensräume auf der Erde", "Die Rolle der Wälder als Lebensraum", "Beobachtung und wissenschaftliche Methode"],
      awardsNote: "Weltpremiere beim IPS-Festival in Jena (2024).",
    },
  },
  zh: {
    "one-step-beyond": {
      about: [
        "One Step Beyond 带领观众完成从地球到火星的完整旅程。画面铺满整个穹顶，红色星球从四面八方与头顶将您包围。",
        "影片将电影级视觉效果与360°穹顶的沉浸感融为一体，让人真切感受到置身于一场宇宙远征之中。",
      ],
      learn: ["从地球到火星的旅程", "探索红色星球", "360°全穹顶沉浸体验"],
    },
    time: {
      about: [
        "TIME 是 Creative Planet 工作室为大龄儿童、家庭和成人打造的全穹顶作品。影片从自然的节律与人类最早的计时尝试出发，经由相对论与时空，一直讲到人类对「当下」的感知。",
        "亚里士多德、牛顿、麦克斯韦与爱因斯坦如同参与一场关于时间本质的持续辩论。TIME 不回避复杂的概念，而是循序渐进地展开，用沉浸感建立理解。",
      ],
      learn: ["自然与人类历史中的时间", "相对论与时空", "熵与时间之箭", "人类对「当下」的体验"],
    },
    explore: {
      about: [
        "Explore 讲述人类抵达火星的雄心，一路呈现广博的科学知识：从天文学史，到地心说与日心说，再到开普勒定律与轨道机动。",
        "宇航员离开地球，完成霍曼转移，与空间站对接，随后飞向火星。影片以电影级画面展示开普勒定律如何将飞船从地球送入轨道，并驶向更远处。",
      ],
      learn: ["天文学史", "日心说与地心说", "开普勒三定律", "轨道机动"],
      awardsNote: "屡获国际电影节大奖（包括 Jena、IPS、Cannes、Brno）。",
    },
    "the-stellars": {
      about: [
        "The Stellars 是一部面向最年幼观众（3-8岁）的电影级 CGI 动画。Aki、Imani 和 John 坠落到地球上，在天文馆孩子们的帮助下，踏上拯救宇宙森林 Yumi-Plumi 的旅程。",
        "角色们打破第四面墙，把孩子们带入一场共同的任务：发现植物生长需要什么。寓教于乐，激发想象力与好奇心。",
      ],
      learn: ["植物生长需要什么", "地球环境的多样性", "森林作为栖息地的作用", "观察与科学方法"],
      awardsNote: "在 Jena 举行的 IPS 电影节上全球首映（2024年）。",
    },
  },
};

// --- Etykiety UI podstrony ---
export type SubpageText = {
  back: string;
  trailer: string;
  about: string;
  learn: string;
  gallery: string;
  cta: string;
  studioLabel: string;
  awardsLabel: string;
  audienceLabel: string;
  formatLabel: string;
  nowShowing: string;
  showtimes: string;
  showtimesIntro: string;
  thisFilmAt: string;
  fullSchedule: string;
  today: string;
  notPlaying: string;
  alsoSee: string;
};
export const SUBPAGE_COPY: Record<Locale, SubpageText> = {
  pl: { back: "Wróć do repertuaru", trailer: "Obejrzyj zwiastun", about: "O filmie", learn: "Czego się dowiesz", gallery: "Kadry z filmu", cta: "Kup bilet", studioLabel: "Produkcja", awardsLabel: "Nagrody", audienceLabel: "Dla kogo", formatLabel: "Format", nowShowing: "Teraz w kopule", showtimes: "Godziny seansów", showtimesIntro: "Repertuar różni się w zależności od dnia tygodnia. Wybierz przedział dni, aby zobaczyć godziny.", thisFilmAt: "Ten film gra o", fullSchedule: "Pełny grafik dnia", today: "dziś", notPlaying: "W tych dniach ten seans nie jest wyświetlany.", alsoSee: "Zobacz też" },
  en: { back: "Back to repertoire", trailer: "Watch the trailer", about: "About the film", learn: "What you'll discover", gallery: "Stills from the film", cta: "Buy a ticket", studioLabel: "Production", awardsLabel: "Awards", audienceLabel: "Audience", formatLabel: "Format", nowShowing: "Now showing", showtimes: "Screening times", showtimesIntro: "The repertoire varies by day of the week. Pick a day range to see the times.", thisFilmAt: "This film plays at", fullSchedule: "Full daily schedule", today: "today", notPlaying: "This film isn't shown on these days.", alsoSee: "See also" },
  pt: { back: "Voltar ao repertório", trailer: "Ver o trailer", about: "Sobre o filme", learn: "O que vais descobrir", gallery: "Imagens do filme", cta: "Comprar bilhete", studioLabel: "Produção", awardsLabel: "Prémios", audienceLabel: "Público", formatLabel: "Formato", nowShowing: "Em exibição", showtimes: "Horários das sessões", showtimesIntro: "O repertório varia consoante o dia da semana. Escolhe um intervalo de dias para ver os horários.", thisFilmAt: "Este filme às", fullSchedule: "Programação do dia", today: "hoje", notPlaying: "Este filme não é exibido nestes dias.", alsoSee: "Vê também" },
  de: { back: "Zurück zum Programm", trailer: "Trailer ansehen", about: "Über den Film", learn: "Das erfahren Sie", gallery: "Bilder aus dem Film", cta: "Ticket kaufen", studioLabel: "Produktion", awardsLabel: "Auszeichnungen", audienceLabel: "Für wen", formatLabel: "Format", nowShowing: "Jetzt in der Kuppel", showtimes: "Vorstellungszeiten", showtimesIntro: "Das Programm unterscheidet sich je nach Wochentag. Wählen Sie einen Zeitraum, um die Uhrzeiten zu sehen.", thisFilmAt: "Dieser Film läuft um", fullSchedule: "Vollständiger Tagesplan", today: "heute", notPlaying: "An diesen Tagen wird dieser Film nicht gezeigt.", alsoSee: "Auch interessant" },
  zh: { back: "返回排片表", trailer: "观看预告片", about: "关于影片", learn: "您将了解到", gallery: "影片剧照", cta: "购票", studioLabel: "制作", awardsLabel: "奖项", audienceLabel: "适合人群", formatLabel: "格式", nowShowing: "正在放映", showtimes: "放映时间", showtimesIntro: "排片因星期而异。请选择日期区间以查看放映时间。", thisFilmAt: "本片放映时间", fullSchedule: "当日完整排片", today: "今天", notPlaying: "这几天不放映本片。", alsoSee: "更多推荐" },
};

// Repertuar — nagłówek sekcji akordeonu (współdzielony przez stronę kina i stronę główną).
export type RepertoireText = { kicker: string; title: string; intro: string; cta: string; more: string; nowShowing: string; watch: string };
export const REPERTOIRE_COPY: Record<Locale, RepertoireText> = {
  pl: { kicker: "Seanse", title: "Repertuar Kina 360", intro: "Cztery filmy fulldome 360°: każdy wypełnia całą kopułę dookoła i nad głową.", cta: "Kup bilet", more: "Obejrzyj trailer", nowShowing: "Teraz w kopule", watch: "Zobacz seans" },
  en: { kicker: "Screenings", title: "K360 repertoire", intro: "Four fulldome 360° films: each one fills the entire dome all around and overhead.", cta: "Buy a ticket", more: "Watch the trailer", nowShowing: "Now showing", watch: "See screening" },
  pt: { kicker: "Sessões", title: "Repertório do K360", intro: "Quatro filmes fulldome 360°: cada um preenche toda a cúpula à volta e por cima.", cta: "Comprar bilhete", more: "Ver o trailer", nowShowing: "Em exibição", watch: "Ver sessão" },
  de: { kicker: "Vorstellungen", title: "Programm von Kino 360", intro: "Vier Fulldome-360°-Filme: Jeder füllt die gesamte Kuppel rundum und über Ihrem Kopf.", cta: "Ticket kaufen", more: "Trailer ansehen", nowShowing: "Jetzt in der Kuppel", watch: "Ansehen" },
  zh: { kicker: "放映场次", title: "Kino 360 影院排片表", intro: "四部全穹顶360°影片：每一部都铺满整个穹顶，环绕四周与头顶。", cta: "购票", more: "观看预告片", nowShowing: "正在放映", watch: "查看该场次" },
};

// Grafik seansów — trzy przedziały dni, godziny wpisane ręcznie (seanse co ~45 min).
// Uwaga: TIME gra dopiero od czwartku (nie ma go w Pon-Śr).
// Sob-Nd = tak jak Czw-Pt, tylko z dodatkowym wcześniejszym seansem o 10:15.
export type ScheduleEntry = { time: string; slug: string };
export type DayGroupKey = "mon-wed" | "thu-fri" | "sat-sun";

export const DAY_GROUPS: readonly { key: DayGroupKey; label: Record<Locale, string> }[] = [
  { key: "mon-wed", label: { pl: "Pon-Śr", en: "Mon-Wed", pt: "Seg-Qua", de: "Mo-Mi", zh: "周一至周三" } },
  { key: "thu-fri", label: { pl: "Czw-Pt", en: "Thu-Fri", pt: "Qui-Sex", de: "Do-Fr", zh: "周四至周五" } },
  { key: "sat-sun", label: { pl: "Sob-Nd", en: "Sat-Sun", pt: "Sáb-Dom", de: "Sa-So", zh: "周六至周日" } },
];

const SCHEDULE_MON_WED: ScheduleEntry[] = [
  { time: "11:00", slug: "the-stellars" },
  { time: "11:45", slug: "one-step-beyond" },
  { time: "12:30", slug: "explore" },
  { time: "13:15", slug: "the-stellars" },
  { time: "14:00", slug: "one-step-beyond" },
  { time: "14:45", slug: "explore" },
  { time: "15:30", slug: "one-step-beyond" },
  { time: "16:15", slug: "explore" },
  { time: "17:00", slug: "one-step-beyond" },
];

const SCHEDULE_THU_FRI: ScheduleEntry[] = [
  { time: "11:00", slug: "the-stellars" },
  { time: "11:45", slug: "one-step-beyond" },
  { time: "12:30", slug: "explore" },
  { time: "13:15", slug: "time" },
  { time: "14:00", slug: "the-stellars" },
  { time: "14:45", slug: "one-step-beyond" },
  { time: "15:30", slug: "explore" },
  { time: "16:15", slug: "time" },
  { time: "17:00", slug: "explore" },
  { time: "17:45", slug: "time" },
];

const SCHEDULE_SAT_SUN: ScheduleEntry[] = [
  { time: "10:15", slug: "one-step-beyond" },
  ...SCHEDULE_THU_FRI,
];

export const SCHEDULES: Record<DayGroupKey, ScheduleEntry[]> = {
  "mon-wed": SCHEDULE_MON_WED,
  "thu-fri": SCHEDULE_THU_FRI,
  "sat-sun": SCHEDULE_SAT_SUN,
};

export function daySchedule(group: DayGroupKey): ScheduleEntry[] {
  return SCHEDULES[group];
}

export function filmShowtimes(slug: string, group: DayGroupKey): string[] {
  return SCHEDULES[group].filter((e) => e.slug === slug).map((e) => e.time);
}

// Przedział dni na podstawie dnia tygodnia JS (0 = niedziela ... 6 = sobota).
export function dayGroupForWeekday(weekday: number): DayGroupKey {
  if (weekday === 0 || weekday === 6) return "sat-sun";
  if (weekday >= 1 && weekday <= 3) return "mon-wed";
  return "thu-fri";
}
