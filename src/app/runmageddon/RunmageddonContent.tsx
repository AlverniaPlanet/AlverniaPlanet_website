"use client";

import { type CSSProperties } from "react";
import Image from "next/image";
import { Press_Start_2P } from "next/font/google";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import { useI18n } from "@/app/i18n-provider";
import { useTheme } from "@/app/theme-provider";

type Locale = "pl" | "en" | "pt";
const RUNMAGEDDON_BINGO_URL = "https://alverniaplanet.com/runnmageddon-bingo/";
const RUNMAGEDDON_GAME_URL = "https://alverniaplanet.com/runnmageddon-game/";
const RUNMAGEDDON_REGISTRATION_URL =
  "https://www.runmageddon.pl/wydarzenia/runmageddon-krakow-alvernia-planet-11-04-2026";
const RUNMAGEDDON_EVENT_END_AT = Date.parse("2026-04-12T23:59:59+02:00");

const pixelFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type RunmageddonScheduleItem = {
  label: string;
  time: string;
};

type RunmageddonCard = {
  badge: string;
  title: string;
  body: string;
  details: RunmageddonScheduleItem[];
};

type PixelFlyer = {
  top: string;
  duration: string;
  delay: string;
  opacity: number;
  startLeft: string;
  endLeft: string;
  driftY?: string;
  scaleX?: "1" | "-1";
  palette: {
    light: string;
    main: string;
    accent: string;
  };
  hideOnMobile?: boolean;
};

const PIXEL_FLYERS: PixelFlyer[] = [
  {
    top: "7%",
    duration: "8.2s",
    delay: "0s",
    opacity: 0.95,
    startLeft: "-56px",
    endLeft: "calc(100% + 56px)",
    driftY: "-2px",
    scaleX: "1",
    palette: { light: "#fff7dc", main: "#f2cb47", accent: "#53deee" },
  },
  {
    top: "19%",
    duration: "9.4s",
    delay: "-2.6s",
    opacity: 0.72,
    startLeft: "calc(100% + 56px)",
    endLeft: "-56px",
    driftY: "3px",
    scaleX: "-1",
    palette: { light: "#ffe8f3", main: "#ff6b98", accent: "#8ef6bc" },
  },
  {
    top: "36%",
    duration: "11.2s",
    delay: "-5.3s",
    opacity: 0.56,
    startLeft: "-56px",
    endLeft: "calc(100% + 56px)",
    driftY: "4px",
    scaleX: "1",
    palette: { light: "#f7f3ff", main: "#9d7af8", accent: "#7fd5ff" },
    hideOnMobile: true,
  },
  {
    top: "58%",
    duration: "8.8s",
    delay: "-4.1s",
    opacity: 0.66,
    startLeft: "calc(100% + 56px)",
    endLeft: "-56px",
    driftY: "-3px",
    scaleX: "-1",
    palette: { light: "#fff0e2", main: "#ff8a3d", accent: "#55f3c8" },
  },
  {
    top: "76%",
    duration: "10.6s",
    delay: "-7.4s",
    opacity: 0.52,
    startLeft: "-56px",
    endLeft: "calc(100% + 56px)",
    driftY: "2px",
    scaleX: "1",
    palette: { light: "#f4fff7", main: "#8be95d", accent: "#4ea8ff" },
    hideOnMobile: true,
  },
];

const COPY: Record<
  Locale,
  {
    tag: string;
    title: string;
    heroDescription?: string[];
    highlights: string[];
    endedHighlight: string;
    archiveTitle: string;
    archiveBody: string;
    activitiesTitle: string;
    activitiesDescription: string;
    activitiesArchivedDescription: string;
    bingoCta: string;
    bingoDescription: string;
    bingoEndedState: string;
    bingoEndedDescription: string;
    bingoEndedNote: string;
    gameCta: string;
    gameDescription: string;
    gameLaunchRibbon: string;
    gameLaunchNote: string;
    gameLockedState: string;
    gameEndedDescription: string;
    gameEndedRibbon: string;
    gameEndedNote: string;
    gameEndedState: string;
    verifiedLabel: string;
    introTitle: string;
    introBody?: string;
    cards: RunmageddonCard[];
    note: string;
    registrationCta: string;
    registrationEndedCta: string;
  }
> = {
  pl: {
    tag: "Wydarzenie czasowe",
    title: "W Alvernia Planet",
    heroDescription: [
      "Kraków lubi swoje legendy. Smoki, hejnały, obwarzanki...",
      "Ale tym razem zostawiamy to za sobą i odlatujemy na trasę nie z tej Ziemi.",
      "Chcesz sprawdzić na co Cię stać?",
      "Nojlepiej kaj? Na naszej trasie, wiadomo.",
    ],
    highlights: ["09-12.04.2026", "KRAKÓW ALVERNIA PLANET", "Oficjalne zapisy online"],
    endedHighlight: "EDYCJA ZAKOŃCZONA",
    archiveTitle: "Runmageddon 2026 w Alvernia Planet już się zakończył",
    archiveBody:
      "Weekend wydarzenia, gra i Bingo były aktywne do niedzieli, 12 kwietnia 2026. Zapisy i aktywności specjalne są już zamknięte.",
    activitiesTitle: "Interaktywne aktywności",
    activitiesDescription:
      "Dwie aktywności na czas wydarzenia: jedna w pełni online, druga realizowana w Alvernia Planet.",
    activitiesArchivedDescription:
      "Aktywności miały charakter czasowy i zakończyły się razem z wydarzeniem 12.04.2026.",
    bingoCta: "Bingo",
    bingoDescription:
      "Interaktywna gra terenowa podczas Runmageddonu. Wykonujesz zadania, zapisujesz odpowiedzi, dodajesz zdjęcia i śledzisz postęp bezpośrednio na planszy Bingo.",
    bingoEndedState: "Bingo zakończone",
    bingoEndedDescription:
      "Gra terenowa była dostępna wyłącznie podczas weekendu Runmageddon w Alvernia Planet i została już zamknięta.",
    bingoEndedNote: "Aktywność była aktywna do 12.04.2026.",
    gameCta: "Gra RUNMAGEDDON",
    gameDescription:
      "Prosta gra zręcznościowa. 10 najlepszych wyników do końca niedzieli, 12 kwietnia 2026, wygrywa kody rabatowe na wszystkie atrakcje Alvernia Planet. Po zakończeniu akcji rozdamy kody.",
    gameLaunchRibbon: "OD 07.04.2026",
    gameLaunchNote: "Start od wtorku, 7 kwietnia 2026.",
    gameLockedState: "Gra jeszcze niedostępna",
    gameEndedDescription:
      "Gra zręcznościowa została zakończona. Wyniki były zbierane do końca niedzieli, 12 kwietnia 2026.",
    gameEndedRibbon: "ZAKOŃCZONE",
    gameEndedNote: "Nagrody rozdamy do niedzieli, 19.04.2026.",
    gameEndedState: "Gra zakończona",
    verifiedLabel: "Aktywności",
    introTitle: "Harmonogram wydarzenia",
    cards: [
      {
        badge: "Czwartek",
        title: "9 kwietnia 2026",
        body: "Trening otwierający weekend Runmageddonu w Alvernia Planet.",
        details: [
          { label: "Treningi", time: "17:30-19:00" },
        ],
      },
      {
        badge: "Sobota",
        title: "11 kwietnia 2026",
        body: "Sobotnia rozpiska dla formuł Rekrut, Kids, Intro U-16, Intro i Nocny Rekrut.",
        details: [
          { label: "Rekrut (1/2) Elite", time: "07:30-07:50" },
          { label: "Rekrut (1/2) Open", time: "08:00-14:00" },
          { label: "Kids", time: "12:20-14:40" },
          { label: "Intro U-16", time: "16:30" },
          { label: "Intro (1/4)", time: "16:45-17:45" },
          { label: "Nocny Rekrut (1/2)", time: "20:45-21:15" },
        ],
      },
      {
        badge: "Niedziela",
        title: "12 kwietnia 2026",
        body: "Niedzielna rozpiska dla głównego Runmageddonu, Kids i formuły Family.",
        details: [
          { label: "Runmageddon Elite", time: "07:30-07:50" },
          { label: "Runmageddon Open", time: "08:00-10:00" },
          { label: "Kids Open", time: "11:00-12:40" },
          { label: "Kids Elite", time: "13:15-14:00" },
          { label: "Family", time: "14:00-16:00" },
        ],
      },
    ],
    note: "Szczegóły wydarzenia i formularze zapisów prowadzą do oficjalnej strony Runmageddon.",
    registrationCta: "Zapisz się już teraz!",
    registrationEndedCta: "Zapisy zamknięte",
  },
  en: {
    tag: "Limited-Time Event",
    title: "Runmageddon Kraków Alvernia Planet",
    highlights: ["09-12.04.2026", "KRAKÓW ALVERNIA PLANET", "Official online registration"],
    endedHighlight: "EVENT ENDED",
    archiveTitle: "Runmageddon 2026 at Alvernia Planet has ended",
    archiveBody:
      "The event weekend, the arcade game, and Bingo were active until Sunday, April 12, 2026. Registration and special activities are now closed.",
    activitiesTitle: "Interactive activities",
    activitiesDescription:
      "Two quick online activities for the event weekend: a field Bingo challenge and a simple prize-based arcade game.",
    activitiesArchivedDescription:
      "These activities were time-limited and closed together with the event on April 12, 2026.",
    bingoCta: "Bingo",
    bingoDescription:
      "Interactive field game during Runmageddon. Complete tasks, save answers, add photos, and track your progress directly on the Bingo board.",
    bingoEndedState: "Bingo closed",
    bingoEndedDescription:
      "The field Bingo challenge was available only during the Runmageddon weekend at Alvernia Planet and is now closed.",
    bingoEndedNote: "This activity was available until April 12, 2026.",
    gameCta: "RUNMAGEDDON",
    gameDescription:
      "Simple arcade skill game. The top 10 scores submitted by Sunday win discount codes for all Alvernia Planet attractions. Codes will be distributed after the campaign ends.",
    gameLaunchRibbon: "FROM 07.04.2026",
    gameLaunchNote: "Available from Tuesday, April 7, 2026.",
    gameLockedState: "Game not available yet",
    gameEndedDescription:
      "The arcade game campaign has ended. Scores were collected until the end of Sunday, April 12, 2026.",
    gameEndedRibbon: "ENDED",
    gameEndedNote: "Rewards will be distributed by Sunday, April 19, 2026.",
    gameEndedState: "Game ended",
    verifiedLabel: "Activities",
    introTitle: "Event schedule",
    introBody:
      "This section keeps only the three key days from the official schedule: Thursday training plus the main Saturday and Sunday start windows.",
    cards: [
      {
        badge: "Thursday",
        title: "April 9, 2026",
        body: "Opening training session before the main race weekend.",
        details: [
          { label: "Training", time: "17:30-19:00" },
        ],
      },
      {
        badge: "Saturday",
        title: "April 11, 2026",
        body: "Saturday schedule for Rekrut, Kids, Intro U-16, Intro, and Night Rekrut.",
        details: [
          { label: "Rekrut (1/2) Elite", time: "07:30-07:50" },
          { label: "Rekrut (1/2) Open", time: "08:00-14:00" },
          { label: "Kids", time: "12:20-14:40" },
          { label: "Intro U-16", time: "16:30" },
          { label: "Intro (1/4)", time: "16:45-17:45" },
          { label: "Night Rekrut (1/2)", time: "20:45-21:15" },
        ],
      },
      {
        badge: "Sunday",
        title: "April 12, 2026",
        body: "Sunday schedule for the full Runmageddon, Kids, and Family formats.",
        details: [
          { label: "Runmageddon Elite", time: "07:30-07:50" },
          { label: "Runmageddon Open", time: "08:00-10:00" },
          { label: "Kids Open", time: "11:00-12:40" },
          { label: "Kids Elite", time: "13:15-14:00" },
          { label: "Family", time: "14:00-16:00" },
        ],
      },
    ],
    note: "Event details and registration are linked to the official Runmageddon page.",
    registrationCta: "Register now!",
    registrationEndedCta: "Registration closed",
  },
  pt: {
    tag: "Evento por tempo limitado",
    title: "Runmageddon Kraków Alvernia Planet",
    highlights: ["09-12.04.2026", "KRAKÓW ALVERNIA PLANET", "Inscrições oficiais online"],
    endedHighlight: "EVENTO ENCERRADO",
    archiveTitle: "O Runmageddon 2026 na Alvernia Planet já terminou",
    archiveBody:
      "O fim de semana do evento, o jogo arcade e o Bingo estiveram ativos até domingo, 12 de abril de 2026. As inscrições e atividades especiais já estão encerradas.",
    activitiesTitle: "Atividades interativas",
    activitiesDescription:
      "Duas atividades online rápidas para o fim de semana do evento: Bingo de campo e um mini jogo arcade com prémios.",
    activitiesArchivedDescription:
      "Estas atividades eram temporárias e terminaram juntamente com o evento em 12 de abril de 2026.",
    bingoCta: "Bingo",
    bingoDescription:
      "Jogo de campo interativo durante o Runmageddon. Complete tarefas, guarde respostas, adicione fotos e acompanhe o progresso diretamente no cartão Bingo.",
    bingoEndedState: "Bingo encerrado",
    bingoEndedDescription:
      "O Bingo de campo esteve disponível apenas durante o fim de semana Runmageddon na Alvernia Planet e já foi encerrado.",
    bingoEndedNote: "A atividade esteve disponível até 12 de abril de 2026.",
    gameCta: "RUNMAGEDDON",
    gameDescription:
      "Jogo simples de destreza. Os 10 melhores resultados até domingo ganham códigos de desconto para todas as atrações da Alvernia Planet. Os códigos serão entregues após o fim da ação.",
    gameLaunchRibbon: "DESDE 07.04.2026",
    gameLaunchNote: "Disponível a partir de terça-feira, 7 de abril de 2026.",
    gameLockedState: "Jogo ainda indisponível",
    gameEndedDescription:
      "A campanha do jogo arcade terminou. As pontuações foram recolhidas até ao fim de domingo, 12 de abril de 2026.",
    gameEndedRibbon: "ENCERRADO",
    gameEndedNote: "Os prémios serão atribuídos até domingo, 19 de abril de 2026.",
    gameEndedState: "Jogo encerrado",
    verifiedLabel: "Atividades",
    introTitle: "Horário do evento",
    introBody:
      "Aqui ficam apenas os três dias principais do horário oficial: o treino de quinta-feira e as janelas de partida de sábado e domingo.",
    cards: [
      {
        badge: "Quinta-feira",
        title: "9 de abril de 2026",
        body: "Sessão oficial de treino antes do fim de semana principal.",
        details: [
          { label: "Treinos", time: "17:30-19:00" },
        ],
      },
      {
        badge: "Sábado",
        title: "11 de abril de 2026",
        body: "Horário de sábado para Rekrut, Kids, Intro U-16, Intro e Nocny Rekrut.",
        details: [
          { label: "Rekrut (1/2) Elite", time: "07:30-07:50" },
          { label: "Rekrut (1/2) Open", time: "08:00-14:00" },
          { label: "Kids", time: "12:20-14:40" },
          { label: "Intro U-16", time: "16:30" },
          { label: "Intro (1/4)", time: "16:45-17:45" },
          { label: "Nocny Rekrut (1/2)", time: "20:45-21:15" },
        ],
      },
      {
        badge: "Domingo",
        title: "12 de abril de 2026",
        body: "Horário de domingo para o Runmageddon principal, Kids e Family.",
        details: [
          { label: "Runmageddon Elite", time: "07:30-07:50" },
          { label: "Runmageddon Open", time: "08:00-10:00" },
          { label: "Kids Open", time: "11:00-12:40" },
          { label: "Kids Elite", time: "13:15-14:00" },
          { label: "Family", time: "14:00-16:00" },
        ],
      },
    ],
    note: "Os detalhes do evento e as inscrições estão ligados à página oficial do Runmageddon.",
    registrationCta: "Inscreve-te já!",
    registrationEndedCta: "Inscrições encerradas",
  },
};

export default function RunmageddonContent() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];
  const isLight = theme === "light";
  const hasEventEnded = Date.now() > RUNMAGEDDON_EVENT_END_AT;
  const isGameLocked = hasEventEnded;
  const highlights = hasEventEnded
    ? [copy.highlights[0], copy.highlights[1], copy.endedHighlight]
    : copy.highlights;
  const activitiesDescription = hasEventEnded
    ? copy.activitiesArchivedDescription
    : copy.activitiesDescription;
  const bingoDescription = hasEventEnded ? copy.bingoEndedDescription : copy.bingoDescription;
  const gameDescription = hasEventEnded ? copy.gameEndedDescription : copy.gameDescription;
  const gameRibbon = hasEventEnded ? copy.gameEndedRibbon : copy.gameLaunchRibbon;
  const gameStatusLabel = hasEventEnded ? copy.gameEndedState : copy.gameLockedState;
  const gameNote = hasEventEnded ? copy.gameEndedNote : copy.gameLaunchNote;
  const bingoCardClasses = cx(
    "group relative flex min-h-[11.5rem] flex-col items-center justify-start rounded-[0.45rem] border-2 px-5 py-4 text-center transition duration-200",
    hasEventEnded
      ? isLight
        ? "cursor-not-allowed border-[#cbd5e1] bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] shadow-[0_0_0_2px_rgba(255,255,255,0.92),6px_6px_0_rgba(203,213,225,0.62)]"
        : "cursor-not-allowed border-[#45657e] bg-[#32465a] shadow-[0_0_0_2px_rgba(5,28,38,0.84),6px_6px_0_rgba(9,13,22,0.5)]"
      : isLight
        ? "border-[#86d9e5] bg-[linear-gradient(180deg,#f2feff_0%,#d8f8ff_100%)] shadow-[0_0_0_2px_rgba(255,255,255,0.9),6px_6px_0_rgba(156,222,232,0.62)] hover:-translate-y-0.5 hover:border-[#53deee] hover:bg-[linear-gradient(180deg,#f8ffff_0%,#caf6ff_100%)]"
        : "border-[#2d7c92] bg-[#48d4ee] shadow-[0_0_0_2px_rgba(5,28,38,0.84),6px_6px_0_rgba(9,13,22,0.5)] hover:-translate-y-0.5 hover:bg-[#68e6f4]",
  );
  const bingoCardContent = (
    <>
      <span
        className={cx(
          "absolute inset-x-0 top-0 h-[3px]",
          hasEventEnded ? (isLight ? "bg-slate-300" : "bg-white/20") : isLight ? "bg-[#53deee]/55" : "bg-white/35",
        )}
      />
      <span
        className={cx(
          pixelFont.className,
          "text-[0.46rem] uppercase tracking-[0.12em]",
          hasEventEnded
            ? isLight
              ? "text-slate-600"
              : "text-white/70"
            : isLight
              ? "text-[#155e75]/78"
              : "text-[#0b3441]/78",
        )}
      >
        {hasEventEnded ? copy.bingoEndedState : isLight ? "Online" : "Mini Game"}
      </span>
      <span
        className={cx(
          "mt-3 text-3xl font-black leading-none tracking-[-0.05em] sm:text-[2.35rem]",
          hasEventEnded ? (isLight ? "text-slate-800" : "text-white") : isLight ? "text-[#0f2f3c]" : "text-[#082432]",
        )}
      >
        {copy.bingoCta}
      </span>
      <span
        className={cx(
          "mt-3 text-sm leading-relaxed sm:text-[0.95rem]",
          hasEventEnded
            ? isLight
              ? "text-slate-600"
              : "text-white/78"
            : isLight
              ? "text-[#164e63]"
              : "text-[#082432]/84",
        )}
      >
        {bingoDescription}
      </span>
      {hasEventEnded ? (
        <span
          className={cx(
            pixelFont.className,
            "mt-4 inline-flex rounded-[0.35rem] border px-3 py-2 text-[0.46rem] uppercase tracking-[0.12em]",
            isLight
              ? "border-slate-300 bg-white/70 text-slate-600"
              : "border-white/15 bg-white/10 text-white/75",
          )}
        >
          {copy.bingoEndedNote}
        </span>
      ) : null}
    </>
  );
  const gameCardClasses = cx(
    "group relative flex min-h-[11.5rem] w-full flex-col items-center justify-start overflow-hidden rounded-[0.45rem] border-2 px-5 py-4 text-center transition duration-200",
    isGameLocked
      ? isLight
        ? "border-[#d85c5c] bg-[linear-gradient(180deg,#fff1f1_0%,#ffc9c9_100%)] shadow-[0_0_0_2px_rgba(255,238,238,0.92),6px_6px_0_rgba(224,124,124,0.54)]"
        : "border-[#a93c4d] bg-[#d44f63] shadow-[0_0_0_2px_rgba(64,10,18,0.68),6px_6px_0_rgba(47,8,17,0.48)]"
      : isLight
        ? "border-[#e8d594] bg-[linear-gradient(180deg,#fff9d9_0%,#ffe89b_100%)] shadow-[0_0_0_2px_rgba(255,252,232,0.94),6px_6px_0_rgba(232,213,148,0.58)] hover:-translate-y-0.5 hover:border-[#f2cb47] hover:bg-[linear-gradient(180deg,#fffbe6_0%,#ffe38a_100%)]"
        : "border-[#b99214] bg-[#f2cb47] shadow-[0_0_0_2px_rgba(63,44,8,0.72),6px_6px_0_rgba(9,13,22,0.48)] hover:-translate-y-0.5 hover:bg-[#ffd45f]",
  );
  const gameCardContent = (
    <>
      <span
        className={cx(
          pixelFont.className,
          "absolute right-[-3.4rem] top-4 z-10 w-[12rem] rotate-45 border-y px-2 py-1 text-center text-[0.42rem] uppercase tracking-[0.16em]",
          isGameLocked
            ? isLight
              ? "border-[#d66c6c] bg-[#ef4444] text-white"
              : "border-[#f08a94] bg-[#ef4444] text-white"
            : isLight
              ? "border-[#e8d594] bg-[#fff1bf] text-[#7a5208]"
              : "border-[#f2cb47] bg-[#f2cb47] text-[#21180a]",
        )}
      >
        {gameRibbon}
      </span>
      <span
        className={cx(
          "absolute inset-x-0 top-0 h-[3px]",
          isGameLocked
            ? "bg-[#ef4444]"
            : isLight
              ? "bg-[#f2cb47]/55"
              : "bg-white/35",
        )}
      />
      <span
        className={cx(
          pixelFont.className,
          "text-[0.46rem] uppercase tracking-[0.12em]",
          isGameLocked
            ? isLight
              ? "text-[#9f1239]"
              : "text-[#fff3f3]"
            : isLight
              ? "text-[#8a5b00]/78"
              : "text-[#0b3441]/78",
        )}
      >
        {isGameLocked ? gameStatusLabel : isLight ? "Arcade" : "Mini Game"}
      </span>
      <span
        className={cx(
          "mt-3 text-3xl font-black leading-none tracking-[-0.05em] sm:text-[2.35rem]",
          isGameLocked
            ? isLight
              ? "text-[#7f1d1d]"
              : "text-white"
            : isLight
              ? "text-[#3b2a04]"
              : "text-[#082432]",
        )}
      >
        {copy.gameCta}
      </span>
      <span
        className={cx(
          "mt-3 text-sm leading-relaxed sm:text-[0.95rem]",
          isGameLocked
            ? isLight
              ? "text-[#7f1d1d]"
              : "text-white/88"
            : isLight
              ? "text-[#5b4308]"
              : "text-[#082432]/84",
        )}
      >
        {gameDescription}
      </span>
      <span
        className={cx(
          pixelFont.className,
          "mt-4 inline-flex rounded-[0.35rem] border px-3 py-2 text-[0.46rem] uppercase tracking-[0.12em]",
          isGameLocked
            ? isLight
              ? "border-[#fca5a5] bg-[#fee2e2] text-[#b91c1c]"
              : "border-white/25 bg-white/12 text-white"
            : isLight
              ? "border-[#f3d77b] bg-white/55 text-[#8a5b00]"
              : "border-white/15 bg-white/10 text-white/90",
        )}
      >
        {gameNote}
      </span>
    </>
  );

  return (
    <main
      className={cx(
        "runmageddon-page relative min-h-screen overflow-hidden px-4 py-12 sm:py-16",
        isLight ? "bg-[#f5f8fc] text-slate-900" : "bg-[#120f22] text-white",
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          isLight
            ? "bg-[linear-gradient(180deg,#fbfdff_0%,#f4f9ff_36%,#fdf8ee_100%)]"
            : "bg-[#120f22]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-0 [background-size:20px_20px]",
          isLight
            ? "opacity-[0.3] [background-image:linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)]"
            : "opacity-[0.2] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-0 [background-size:44px_44px]",
          isLight
            ? "opacity-[0.18] [background-image:radial-gradient(circle,rgba(15,23,42,0.16)_1px,transparent_1.5px)]"
            : "opacity-[0.14] [background-image:radial-gradient(circle,rgba(255,255,255,0.92)_1px,transparent_1.5px)]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          isLight
            ? "bg-[radial-gradient(circle_at_top_left,rgba(83,222,238,0.2),transparent_36%),radial-gradient(circle_at_top_right,rgba(242,203,71,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.12),transparent_34%)]"
            : "opacity-[0.1] [background-image:radial-gradient(circle,rgba(242,203,71,0.88)_1px,transparent_1.5px)] [background-position:22px_18px] [background-size:82px_82px]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          isLight
            ? "opacity-[0.12] [background-image:linear-gradient(90deg,rgba(242,203,71,0.16)_0,rgba(242,203,71,0.16)_18px,transparent_18px,transparent_120px),linear-gradient(180deg,rgba(83,222,238,0.14)_0,rgba(83,222,238,0.14)_18px,transparent_18px,transparent_136px)] [background-size:260px_260px,320px_320px]"
            : "opacity-[0.09] [background-image:radial-gradient(circle,rgba(83,222,238,0.92)_1px,transparent_1.5px)] [background-position:10px_14px] [background-size:68px_68px]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          isLight
            ? ""
            : "opacity-[0.06] [background-image:radial-gradient(circle,rgba(255,255,255,0.96)_2px,transparent_2.5px)] [background-position:0_0,40px_34px,88px_16px] [background-size:140px_140px]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          isLight
            ? ""
            : "opacity-[0.18] [background-image:linear-gradient(90deg,rgba(242,203,71,0.1)_0,rgba(242,203,71,0.1)_24px,transparent_24px,transparent_120px),linear-gradient(180deg,rgba(83,222,238,0.08)_0,rgba(83,222,238,0.08)_20px,transparent_20px,transparent_140px)] [background-size:260px_260px,320px_320px]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-x-0 top-0 [background-size:16px_3px]",
          isLight
            ? "h-24 opacity-[0.2] [background-image:linear-gradient(90deg,rgba(83,222,238,0.22)_0,rgba(83,222,238,0.22)_8px,transparent_8px,transparent_16px)]"
            : "h-32 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(242,203,71,0.24)_0,rgba(242,203,71,0.24)_8px,transparent_8px,transparent_16px)]",
        )}
      />
      <div
        className={cx(
          "pointer-events-none absolute inset-x-0 bottom-0",
          isLight
            ? "h-40 bg-[linear-gradient(180deg,rgba(245,248,252,0)_0%,rgba(245,248,252,0.7)_22%,rgba(220,236,248,0.95)_100%)]"
            : "h-44 opacity-[0.22] [background-image:linear-gradient(180deg,transparent_0,transparent_58px,rgba(16,13,28,0.95)_58px,rgba(16,13,28,0.95)_100%),linear-gradient(90deg,rgba(36,30,52,0.9)_0,rgba(36,30,52,0.9)_44px,transparent_44px,transparent_88px)] [background-size:100%_100%,176px_88px]",
        )}
      />
      <div className="pointer-events-none absolute left-[6%] top-[16%] h-3 w-3 bg-[#f2cb47] opacity-80 shadow-[12px_0_0_#ffffff,36px_18px_0_#53deee,84px_6px_0_#f2cb47,120px_24px_0_#ffffff]" />
      <div className="pointer-events-none absolute right-[10%] top-[18%] h-2.5 w-2.5 bg-[#ffffff] opacity-85 shadow-[18px_14px_0_#53deee,-28px_22px_0_#f2cb47,56px_40px_0_#ffffff,-74px_8px_0_#53deee]" />
      <div className="pointer-events-none absolute left-[12%] top-[58%] h-2.5 w-2.5 bg-[#53deee] opacity-75 shadow-[22px_-18px_0_#ffffff,74px_10px_0_#f2cb47,110px_-12px_0_#ffffff]" />
      <div className="pointer-events-none absolute right-[14%] top-[64%] h-3 w-3 bg-[#f2cb47] opacity-75 shadow-[-32px_16px_0_#ffffff,-78px_-4px_0_#53deee,42px_22px_0_#ffffff]" />
      {PIXEL_FLYERS.map((flyer) => (
        <div
          key={`${flyer.top}-${flyer.duration}`}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 z-0 overflow-hidden ${
            flyer.hideOnMobile ? "hidden md:block" : ""
          }`}
          style={{ top: flyer.top, height: "2.5rem", opacity: flyer.opacity } as CSSProperties}
        >
          <div className="runmageddon-pixel-runner-track">
            <div
              className="runmageddon-pixel-runner"
              style={{
                animationDuration: flyer.duration,
                animationDelay: flyer.delay,
                "--runner-start-left": flyer.startLeft,
                "--runner-end-left": flyer.endLeft,
                "--runner-drift-y": flyer.driftY ?? "0px",
                "--runner-scale-x": flyer.scaleX ?? "1",
                "--runner-light": flyer.palette.light,
                "--runner-main": flyer.palette.main,
                "--runner-accent": flyer.palette.accent,
              } as CSSProperties}
            />
          </div>
        </div>
      ))}
      <div className="relative z-10 ap-shell ap-page-stack">
        <header
          className="runmageddon-pixel-enter text-center space-y-7"
          style={{ "--pixel-enter-delay": "40ms" } as CSSProperties}
        >
          <p
            className={cx(
              pixelFont.className,
              "text-[0.62rem] uppercase tracking-[0.42em]",
              isLight ? "text-[#2d89a6]/84" : "text-[#f2cb47]/82",
            )}
          >
            {copy.tag}
          </p>
          <div className="mx-auto w-full max-w-[20rem] px-2">
            <Image
              src="/Runmageddon/rmg_zolty.webp"
              alt="Runmageddon"
              width={1200}
              height={400}
              priority
              className="mx-auto h-auto w-full object-contain"
            />
          </div>
          <h1
            className={cx(
              "ap-type-hero-title",
              isLight ? "text-[#102033]" : "text-white drop-shadow-[0_6px_0_rgba(8,7,18,0.42)]",
            )}
          >
            {copy.title}
          </h1>
          {copy.heroDescription ? (
            <div
              className={cx(
                "mx-auto max-w-5xl space-y-3 text-center text-[clamp(1rem,0.94rem+0.6vw,1.55rem)] leading-[1.5] font-medium",
                isLight ? "text-slate-700" : "text-white/92",
              )}
            >
              {copy.heroDescription.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          ) : null}
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2.5">
            {highlights.map((item) => (
              <span
                key={item}
                className={cx(
                  pixelFont.className,
                  "inline-flex rounded-[0.4rem] border-2 px-4 py-2 text-[0.58rem] uppercase tracking-[0.16em]",
                  isLight
                    ? "border-[#d4e4ef] bg-white/95 text-[#102033] shadow-[0_0_0_1px_rgba(255,255,255,0.9),4px_4px_0_rgba(196,221,236,0.58)]"
                    : "border-[#6b5725] bg-[#2a2435] text-[#f2cb47] shadow-[0_0_0_1px_rgba(14,12,24,0.85),4px_4px_0_rgba(9,8,18,0.42)]",
                )}
              >
                {item}
              </span>
            ))}
          </div>
          {hasEventEnded ? (
            <div className="relative mx-auto w-full max-w-5xl px-1 pt-2">
              <div
                className={cx(
                  "relative overflow-hidden rounded-[0.7rem] border-2 px-5 py-5 text-center sm:px-6",
                  isLight
                    ? "border-[#d4e4ef] bg-white/95 shadow-[0_0_0_2px_rgba(255,255,255,0.95),10px_10px_0_rgba(196,221,236,0.58)]"
                    : "border-[#6b5724] bg-[#1c172a]/94 shadow-[0_0_0_2px_rgba(10,9,18,0.9),10px_10px_0_rgba(8,7,16,0.42)]",
                )}
              >
                <div
                  className={cx(
                    "absolute inset-0 [background-size:16px_16px]",
                    isLight
                      ? "opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)]"
                      : "opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
                  )}
                />
                <span
                  className={cx(
                    pixelFont.className,
                    "relative inline-flex rounded-[0.35rem] border-2 px-4 py-2 text-[0.52rem] uppercase tracking-[0.18em]",
                    isLight
                      ? "border-[#f5c36b] bg-[#fff7dd] text-[#8a5b00]"
                      : "border-[#f2cb47] bg-[#2a2435] text-[#f2cb47]",
                  )}
                >
                  {copy.endedHighlight}
                </span>
                <h2
                  className={cx(
                    "relative mt-4 text-2xl font-black tracking-[-0.03em] sm:text-3xl",
                    isLight ? "text-[#102033]" : "text-white",
                  )}
                >
                  {copy.archiveTitle}
                </h2>
                <p
                  className={cx(
                    "relative mx-auto mt-3 max-w-3xl text-sm leading-relaxed sm:text-base",
                    isLight ? "text-slate-600" : "text-white/76",
                  )}
                >
                  {copy.archiveBody}
                </p>
              </div>
            </div>
          ) : null}
          <div className="relative mx-auto w-full max-w-6xl px-1 pt-2">
            <div
              className={cx(
                "relative overflow-hidden rounded-[0.7rem] border-2 px-4 py-5 sm:px-6 sm:py-6",
                isLight
                  ? "border-[#d4e4ef] bg-white/95 shadow-[0_0_0_2px_rgba(255,255,255,0.95),10px_10px_0_rgba(196,221,236,0.58)]"
                  : "border-[#6b5724] bg-[#1c172a]/94 shadow-[0_0_0_2px_rgba(10,9,18,0.9),10px_10px_0_rgba(8,7,16,0.42)]",
              )}
            >
              <div
                className={cx(
                  "absolute inset-0 [background-size:16px_16px]",
                  isLight
                    ? "opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)]"
                    : "opacity-[0.09] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]",
                )}
              />
              <div
                className={cx(
                  "absolute inset-0",
                  isLight
                    ? "bg-[radial-gradient(circle_at_top_left,rgba(83,222,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(242,203,71,0.12),transparent_30%)]"
                    : "",
                )}
              />
              <span className="absolute left-3 top-3 h-3 w-3 bg-[#f2cb47]" aria-hidden="true" />
              <span className="absolute right-3 top-3 h-3 w-3 bg-[#53deee]" aria-hidden="true" />
              <span className="absolute bottom-3 left-3 h-3 w-3 bg-[#53deee]" aria-hidden="true" />
              <span className="absolute bottom-3 right-3 h-3 w-3 bg-[#f2cb47]" aria-hidden="true" />
              <span
                className={cx(
                  "absolute inset-x-6 top-0 h-[3px]",
                  isLight
                    ? "bg-[linear-gradient(90deg,rgba(83,222,238,0),rgba(83,222,238,0.92),rgba(242,203,71,0.88),rgba(242,203,71,0))]"
                    : "bg-[linear-gradient(90deg,rgba(242,203,71,0),rgba(242,203,71,0.95),rgba(242,203,71,0))]",
                )}
                aria-hidden="true"
              />
              <div className="relative text-center">
                <h2
                  className={cx(
                    "text-center text-2xl font-black tracking-[-0.03em] sm:text-3xl",
                    isLight ? "text-[#102033]" : "text-white",
                  )}
                >
                  {copy.activitiesTitle}
                </h2>
                <p
                  className={cx(
                    "mx-auto mt-2 max-w-3xl text-sm leading-relaxed sm:text-[0.96rem]",
                    isLight ? "text-slate-600" : "text-white/72",
                  )}
                >
                  {activitiesDescription}
                </p>
              </div>
              <div className="relative mx-auto grid w-full max-w-5xl gap-4 pt-8 md:grid-cols-2">
                {hasEventEnded ? (
                  <div aria-disabled="true" className={bingoCardClasses}>
                    {bingoCardContent}
                  </div>
                ) : (
                  <a
                    href={RUNMAGEDDON_BINGO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={bingoCardClasses}
                  >
                    {bingoCardContent}
                  </a>
                )}
                {isGameLocked ? (
                  <div aria-disabled="true" className={gameCardClasses}>
                    {gameCardContent}
                  </div>
                ) : (
                  <a
                    href={RUNMAGEDDON_GAME_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={gameCardClasses}
                  >
                    {gameCardContent}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div
            className={cx(
              "mx-auto h-[4px] w-44",
              isLight
                ? "bg-[linear-gradient(90deg,rgba(83,222,238,0)_0%,rgba(83,222,238,0.92)_24%,rgba(242,203,71,0.88)_76%,rgba(242,203,71,0)_100%)]"
                : "bg-[linear-gradient(90deg,rgba(242,203,71,0)_0%,rgba(242,203,71,0.95)_18%,rgba(242,203,71,0.95)_82%,rgba(242,203,71,0)_100%)]",
            )}
          />
        </header>

        <ScrollMotionItem strength="strong" delay={60} className="ap-deferred-section">
          <section
            className={cx(
              "runmageddon-pixel-enter relative overflow-hidden rounded-[0.6rem] border-2 p-5 sm:p-6",
              isLight
                ? "border-[#d4e4ef] bg-white/95 shadow-[0_0_0_2px_rgba(255,255,255,0.95),10px_10px_0_rgba(196,221,236,0.58)]"
                : "border-[#6b5724] bg-[#1a1628] shadow-[0_0_0_2px_rgba(10,9,18,0.9),10px_10px_0_rgba(7,6,14,0.5)]",
            )}
            style={{ "--pixel-enter-delay": "180ms" } as CSSProperties}
          >
            <div
              className={cx(
                "absolute inset-0 [background-size:16px_16px]",
                isLight
                  ? "opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)]"
                  : "opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]",
              )}
            />
            <div
              className={cx(
                "absolute inset-0",
                isLight
                  ? "bg-[radial-gradient(circle_at_top,rgba(83,222,238,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(242,203,71,0.12),transparent_32%)]"
                  : "bg-[radial-gradient(circle_at_top,rgba(242,203,71,0.1),transparent_38%)]",
              )}
            />
            <div className="relative mx-auto max-w-3xl text-center space-y-4">
              <div className="flex justify-center">
                <span
                  className={cx(
                    pixelFont.className,
                    "inline-flex rounded-[0.4rem] border-2 px-4 py-2 text-[0.52rem] uppercase tracking-[0.18em]",
                    isLight
                      ? "border-[#d4e4ef] bg-white text-[#2d89a6] shadow-[0_0_0_1px_rgba(255,255,255,0.9),4px_4px_0_rgba(196,221,236,0.56)]"
                      : "border-[#6b5724] bg-[#2a2435] text-[#f2cb47] shadow-[0_0_0_1px_rgba(14,12,24,0.85),4px_4px_0_rgba(9,8,18,0.42)]",
                  )}
                >
                  {copy.verifiedLabel}
                </span>
              </div>
              <h2
                className={cx(
                  "text-2xl font-black tracking-[-0.03em] sm:text-3xl",
                  isLight ? "text-[#102033]" : "text-white",
                )}
              >
                {copy.introTitle}
              </h2>
              {copy.introBody ? (
                <p
                  className={cx(
                    "text-base leading-relaxed sm:text-lg",
                    isLight ? "text-slate-600" : "text-white/72",
                  )}
                >
                  {copy.introBody}
                </p>
              ) : null}
            </div>

            <div className="relative mt-16 grid gap-5 md:grid-cols-3 md:gap-6">
              {copy.cards.map((card, index) => (
                <article
                  key={card.title}
                  className={cx(
                    "relative overflow-hidden rounded-[0.45rem] border-2 px-5 py-5",
                    isLight
                      ? "border-[#d4e4ef] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,251,255,0.94))] shadow-[0_0_0_2px_rgba(255,255,255,0.95),6px_6px_0_rgba(196,221,236,0.54)]"
                      : "border-[#6b5724] bg-[#241e34] shadow-[0_0_0_2px_rgba(10,9,18,0.9),6px_6px_0_rgba(8,7,16,0.45)]",
                  )}
                >
                  <div
                    className={cx(
                      "absolute inset-0 [background-size:12px_12px]",
                      isLight
                        ? "opacity-[0.08] [background-image:linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)]"
                        : "opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]",
                    )}
                  />
                  <div
                    className={cx(
                      "absolute inset-x-0 top-0 h-[4px]",
                      isLight ? "bg-[linear-gradient(90deg,#53deee,#f2cb47)]" : "bg-[#f2cb47]",
                    )}
                  />
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className={cx(
                        pixelFont.className,
                        "inline-flex h-10 w-10 items-center justify-center rounded-[0.35rem] border-2 text-[0.6rem]",
                        isLight
                          ? "border-[#d4e4ef] bg-[#eefaff] text-[#2d89a6] shadow-[3px_3px_0_rgba(196,221,236,0.56)]"
                          : "border-[#6b5724] bg-[#3a3120] text-[#f2cb47] shadow-[3px_3px_0_rgba(10,9,18,0.42)]",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cx(
                        pixelFont.className,
                        "text-[0.54rem] uppercase tracking-[0.18em]",
                        isLight ? "text-[#2d89a6]/82" : "text-[#f2cb47]/82",
                      )}
                    >
                      {card.badge}
                    </span>
                  </div>
                  <h3
                    className={cx(
                      "relative text-xl font-black tracking-[-0.03em]",
                      isLight ? "text-[#102033]" : "text-white",
                    )}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={cx(
                      "relative mt-3 text-sm leading-relaxed sm:text-base",
                      isLight ? "text-slate-600" : "text-white/68",
                    )}
                  >
                    {card.body}
                  </p>
                  <ul
                    className={cx(
                      "relative mt-5 space-y-0 border-t pt-4 text-sm leading-relaxed",
                      isLight
                        ? "border-slate-200 text-slate-700"
                        : "border-[#f2cb47]/14 text-white/76",
                    )}
                  >
                    {card.details.map((detail) => (
                      <li
                        key={`${detail.label}-${detail.time}`}
                        className={cx(
                          "flex items-center justify-between gap-4 border-b py-2.5 last:border-b-0",
                          isLight ? "border-slate-200" : "border-white/8",
                        )}
                      >
                        <span className={cx("font-medium", isLight ? "text-slate-800" : "text-white/82")}>
                          {detail.label}
                        </span>
                        <span
                          className={cx(
                            pixelFont.className,
                            "whitespace-nowrap text-[0.55rem]",
                            isLight ? "text-[#8a5b00]" : "text-[#f2cb47]",
                          )}
                        >
                          {detail.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="relative mt-5 space-y-4">
              {!hasEventEnded ? (
                <p
                  className={cx(
                    "text-center text-sm leading-relaxed",
                    isLight ? "text-slate-600" : "text-white/68",
                  )}
                >
                  {copy.note}
                </p>
              ) : null}
              <div className="flex justify-center">
                {hasEventEnded ? (
                  <div
                    aria-disabled="true"
                    className={cx(
                      pixelFont.className,
                      "inline-flex items-center justify-center rounded-[0.45rem] border-2 px-5 py-3 text-[0.58rem] uppercase tracking-[0.16em]",
                      isLight
                        ? "border-slate-300 bg-slate-100 text-slate-500 shadow-[0_0_0_2px_rgba(255,255,255,0.95),6px_6px_0_rgba(203,213,225,0.56)]"
                        : "border-white/15 bg-white/10 text-white/65 shadow-[0_0_0_2px_rgba(10,9,18,0.9),6px_6px_0_rgba(8,7,16,0.42)]",
                    )}
                  >
                    {copy.registrationEndedCta}
                  </div>
                ) : (
                  <a
                    href={RUNMAGEDDON_REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(
                      pixelFont.className,
                      "inline-flex items-center justify-center rounded-[0.45rem] border-2 px-5 py-3 text-[0.58rem] uppercase tracking-[0.16em] transition duration-200 hover:-translate-y-0.5",
                      isLight
                        ? "border-[#cfe0eb] bg-[linear-gradient(180deg,#ffffff_0%,#eefaff_100%)] text-[#102033] shadow-[0_0_0_2px_rgba(255,255,255,0.95),6px_6px_0_rgba(196,221,236,0.56)] hover:border-[#53deee] hover:bg-[linear-gradient(180deg,#ffffff_0%,#def8ff_100%)]"
                        : "border-[#6b5724] bg-[#2a2435] text-[#f2cb47] shadow-[0_0_0_2px_rgba(10,9,18,0.9),6px_6px_0_rgba(8,7,16,0.42)] hover:bg-[#342c48]",
                    )}
                  >
                    {copy.registrationCta}
                  </a>
                )}
              </div>
            </div>

          </section>
        </ScrollMotionItem>
      </div>
    </main>
  );
}
