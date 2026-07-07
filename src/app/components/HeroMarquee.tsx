"use client";

import type { CSSProperties } from "react";
import styles from "./HeroMarquee.module.css";

type HeroMarqueeProps = {
  /** Accent-colored verb, e.g. "ZAGRAJ" / "PRZEŻYJ" / "POZNAJ". */
  verb: string;
  /** Page accent color (hex/rgb/etc.), e.g. "#f77828". */
  accent: string;
  /** Second word, stays white. Defaults to "FILM". */
  word?: string;
  /** Loop duration in seconds. Defaults to 26s. */
  durationSeconds?: number;
  /** Extra classes for the outer bar (e.g. opacity transition wrappers). */
  className?: string;
};

// Ile razy slogan powtarza się w JEDNEJ kopii toru. Tor renderujemy DWA razy i
// przesuwamy 0 → -50%, więc pętla jest bezszwowa, ALE tylko gdy jedna kopia
// jest SZERSZA niż viewport. Inaczej po -50% odsłania się pusta przerwa.
// 20 powtórzeń z zapasem przekracza nawet bardzo szerokie ekrany.
const REPEATS_PER_TRACK = 20;
// Sekundy na jedno powtórzenie, utrzymuje stałe tempo niezależnie od liczby
// powtórzeń (oryginał: 26s / 6 ≈ 4.3s na powtórzenie).
const SECONDS_PER_REPEAT = 4.3;

function MarqueeUnit({ verb, word }: { verb: string; word: string }) {
  return (
    <span className={styles.unit}>
      <span className={styles.verb}>{verb}</span>
      <span className={styles.word}>{word}</span>
      <span className={styles.bullet} aria-hidden="true">
        ●
      </span>
    </span>
  );
}

/**
 * Decorative infinite horizontal ticker that replaces a hero facts bar.
 * - Seamless loop: two identical track copies, translateX 0 -> -50% (linear).
 * - GPU-friendly: transform + will-change only.
 * - prefers-reduced-motion: animation stops, slogan shown once, centered.
 * - aria-hidden: it's a repeating slogan, not content.
 */
export function HeroMarquee({
  verb,
  accent,
  word = "FILM",
  durationSeconds = REPEATS_PER_TRACK * SECONDS_PER_REPEAT,
  className = "",
}: HeroMarqueeProps) {
  const styleVars = {
    "--ap-marquee-accent": accent,
    "--ap-marquee-duration": `${durationSeconds}s`,
  } as CSSProperties;

  // One track copy: the slogan repeated REPEATS_PER_TRACK times.
  const unit = <MarqueeUnit verb={verb} word={word} />;
  const trackCopy = Array.from({ length: REPEATS_PER_TRACK }, (_, i) => (
    <span key={i} className={styles.copyItem}>
      {unit}
    </span>
  ));

  return (
    <div
      className={`${styles.bar} ${className}`}
      style={styleVars}
      aria-hidden="true"
    >
      <div className={styles.viewport}>
        <div className={styles.track}>
          {/* Copy A + Copy B, identical, so -50% lands exactly on the seam. */}
          <div className={styles.copy}>{trackCopy}</div>
          <div className={styles.copy}>{trackCopy}</div>
        </div>
      </div>
    </div>
  );
}

export default HeroMarquee;
