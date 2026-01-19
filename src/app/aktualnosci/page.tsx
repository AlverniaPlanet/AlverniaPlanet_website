"use client";

import { motion, type Variants } from "framer-motion";
import { useI18n } from "@/app/i18n-provider";
import translationsData, { NEWS_META } from "./aktualnosci";
import Card from "@/app/components/Card";

// ===== Typy i tłumaczenia =====
type Locale = "pl" | "en";
type PostContent = { title: string; excerpt: string };
type LocaleBlock = {
  headline: string;
  posts: Record<string, PostContent>; // "1".."6"
};
type Translations = Record<Locale, LocaleBlock>;

// ===== Animations (identyczne jak u Ciebie) =====
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

// ===== Meta: daty i kategorie (zostają w kodzie) =====
export type NewsItem = {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  excerpt: string;
  category: "ścieżka filmowa" | "kino 360" | "ogólne";
};

const CATEGORY_LABELS: Record<NewsItem["category"], { pl: string; en: string }> = {
  "ścieżka filmowa": { pl: "Ścieżka filmowa", en: "Film path" },
  "kino 360": { pl: "Kino 360", en: "360 cinema" },
  ogólne: { pl: "Ogólne", en: "General" },
};

// To odpowiadało Twojej poprzedniej wersji (daty + kategorie)
export default function AktualnosciPage() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const t = (translationsData as Translations)[loc];

  // Sklej dane: bierzemy title/excerpt z JSON po id + meta (data/kategoria)
  const news: NewsItem[] = NEWS_META.map((m) => {
    const content = t.posts[m.id];
    return {
      id: m.id,
      title: content?.title ?? "",
      excerpt: content?.excerpt ?? "",
      date: m.date,
      category: m.category,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="relative z-10 min-h-screen text-white px-4 py-16 sm:py-20">
      {/* Header */}
      <header className="mx-auto w-full max-w-6xl text-center mb-10 sm:mb-12">
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
        >
          {t.headline}
        </motion.h1>
      </header>

      {/* LISTA KAFELKÓW (poziome, jeden pod drugim) */}
      <section className="mx-auto w-full max-w-6xl">
        <motion.ul
          initial="hidden"
          animate="show"
          variants={fade}
          className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12"
        >
          {news.map((item) => (
            <li key={item.id}>
              <NewsRow item={item} locale={loc} />
            </li>
          ))}
        </motion.ul>
      </section>
    </main>
  );
}

function NewsRow({ item, locale }: { item: NewsItem; locale: Locale }) {
  // Kolory kategorii — dokładnie jak wcześniej
  const categoryColors: Record<NewsItem["category"], string> = {
    "ścieżka filmowa": "from-amber-500 to-orange-500",
    "kino 360": "from-sky-500 to-blue-500",
    ogólne: "from-neutral-600 to-neutral-400",
  };
  const categoryLabel = CATEGORY_LABELS[item.category][locale === "en" ? "en" : "pl"];

  return (
    <Card variant="solid" className="relative z-0 w-full mx-2 sm:mx-3 md:mx-4 lg:mx-6 xl:mx-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        {/* LEWA KOLUMNA: data / meta */}
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Badge>{formatDate(item.date, locale)}</Badge>
          <span
            className={`rounded-full bg-gradient-to-r ${
              categoryColors[item.category] || "from-gray-600 to-gray-400"
            } px-3 py-1 text-xs font-semibold leading-none text-white shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
          >
            {categoryLabel}
          </span>
        </div>

        {/* PRAWA KOLUMNA: treść */}
        <div className="flex-1">
          <h3 id={`news-${item.id}-title`} className="text-xl font-semibold leading-snug">
            {item.title}
          </h3>
          <p className="mt-2 text-sm sm:text-base text-gray-100 leading-relaxed">
            {item.excerpt}
          </p>
        </div>
      </div>
    </Card>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-sky-500 px-3 py-1 text-[12px] font-semibold leading-tight text-white shadow-[0_0_16px_rgba(56,189,248,0.35)] ring-1 ring-white/10">
      {children}
    </span>
  );
}

function formatDate(input: string, locale: Locale) {
  try {
    const d = new Date(input);
    const lang = locale === "en" ? "en-GB" : "pl-PL";
    return d.toLocaleDateString(lang, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return input;
  }
}
