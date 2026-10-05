"use client";

import AdaptiveVideo from "@/app/components/AdaptiveVideo";
import Card from "@/app/components/Card";
import ScrollMotionItem from "@/app/components/ScrollMotionItem";
import TourLineAccentTitle from "@/app/components/TourLineAccentTitle";
import TourLineGalleryRow from "@/app/components/TourLineGalleryRow";
import { useI18n } from "@/app/i18n-provider";
import { type Locale } from "@/lib/localizedRoutes";

type GalleryItem = { title: string; body: string; image: string };

const COPY: Record<
  Locale,
  {
    heroTag: string;
    heroTitle: string;
    heroLead: string;
    videoFallback: string;
    sectionTitle: string;
    paragraphs: string[];
    galleryTitle: string;
    galleryItems: GalleryItem[];
  }
> = {
  pl: {
    heroTag: "Wystawa",
    heroTitle: "Harry Potter: The Exhibition",
    heroLead:
      "Wystawa zakończona 17 sierpnia 2025. Dziękujemy za odwiedziny i czekamy na kolejną.",
    videoFallback: "Twój browser nie wspiera elementu video.",
    sectionTitle: "Harry Potter: The Exhibition",
    paragraphs: [
      "Pierwszym projektem B2C, który zrealizowaliśmy w Alvernia Planet, była wystawa Harry Potter: The Exhibition. Otwarto ją 11 kwietnia 2025 roku, dokładnie w 25. rocznicę premiery pierwszej opowieści o młodym czarodzieju, „Harry Potter i Kamień Filozoficzny”. Ekspozycja trwała do 17 sierpnia 2025, czyli 129 dni (około 18 tygodni).",
      "Saga o Harrym Potterze to najpopularniejsza młodzieżowa seria książek na świecie. Opowiada o sierocie i outsiderze, który odkrywa, że jest czarodziejem, a jego przyjaciele i odwaga kształtują magię tej historii. Książki o Harrym Potterze nazywane są bestsellerami wszech czasów i wciąż przyciągają nowe pokolenia czytelników.",
      "Wystawę odwiedziło około 200 000 gości. Dziękujemy za obecność i zapraszamy na kolejne wydarzenia.",
    ],
    galleryTitle: "Wspomnienia",
    galleryItems: [
      {
        title: "Wejście do ekspozycji",
        body: "Strefa wejściowa i kolejka przed kopułą.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
      },
      {
        title: "Knight Bus",
        body: "Dwupiętrowy bus reklamujący wystawę.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/2.webp",
      },
      {
        title: "Początek trasy",
        body: "Pierwsza sala z projekcją bramy do świata magii.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/3.webp",
      },
      {
        title: "Sala immersyjna",
        body: "Projekcje Mapy Huncwotów i efekty świetlne.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/4.webp",
      },
      {
        title: "Sala rejestracji",
        body: "Strefa wejściowa z bramkami i oznaczeniami VIP.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/5.webp",
      },
      {
        title: "Galeria portretów",
        body: "Ściana magicznych obrazów na finał trasy.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/6.webp",
      },
    ],
  },
  en: {
    heroTag: "Exhibition",
    heroTitle: "Harry Potter: The Exhibition",
    heroLead:
      "Exhibition closed on August 17, 2025. Thank you for visiting; stay tuned for the next one.",
    videoFallback: "Your browser does not support the video element.",
    sectionTitle: "Harry Potter: The Exhibition",
    paragraphs: [
      "Harry Potter: The Exhibition was the first B2C project we hosted at Alvernia Planet. It opened on April 11, 2025, exactly on the 25th anniversary of the release of the first story about the young wizard, “Harry Potter and the Philosopher’s Stone”. The exhibition ran until August 17, 2025, which is 129 days (around 18 weeks).",
      "The Harry Potter saga is the world’s most popular young adult book series. It tells the story of an orphan and outsider who discovers he is a wizard, with friends and courage shaping the magic of the tale. The books are bestsellers of all time and keep attracting new generations of readers.",
      "The exhibition welcomed about 200,000 guests. Thank you for joining us and see you at the next events.",
    ],
    galleryTitle: "Memories",
    galleryItems: [
      {
        title: "Exhibition entrance",
        body: "Entry area and queue in front of the dome.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
      },
      {
        title: "Knight Bus",
        body: "Double-decker promo bus for the exhibition.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/2.webp",
      },
      {
        title: "Route kickoff",
        body: "First room with a portal projection into the wizarding world.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/3.webp",
      },
      {
        title: "Immersive room",
        body: "Marauder’s Map projections with light effects.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/4.webp",
      },
      {
        title: "Registration hall",
        body: "Entry zone with gates and VIP signage.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/5.webp",
      },
      {
        title: "Portrait gallery",
        body: "A wall of magical paintings to close the route.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/6.webp",
      },
    ],
  },
  pt: {
    heroTag: "Exposição",
    heroTitle: "Harry Potter: The Exhibition",
    heroLead:
      "Exposição encerrada a 17 de agosto de 2025. Obrigado pela visita; aguardem a próxima.",
    videoFallback: "O seu navegador não suporta o elemento de vídeo.",
    sectionTitle: "Harry Potter: The Exhibition",
    paragraphs: [
      "O primeiro projeto B2C realizado na Alvernia Planet foi a exposição Harry Potter: The Exhibition. Abriu a 11 de abril de 2025, exatamente no 25.º aniversário do lançamento da primeira história do jovem feiticeiro, “Harry Potter e a Pedra Filosofal”. A exposição esteve patente até 17 de agosto de 2025, ou seja, 129 dias (cerca de 18 semanas).",
      "A saga de Harry Potter é a série de livros juvenis mais popular do mundo. Conta a história de um órfão e outsider que descobre ser feiticeiro, com amigos e coragem a moldarem a magia deste universo. Os livros são best-sellers de todos os tempos e continuam a atrair novas gerações de leitores.",
      "A exposição recebeu cerca de 200 000 visitantes. Obrigado por terem estado connosco e até aos próximos eventos.",
    ],
    galleryTitle: "Memórias",
    galleryItems: [
      {
        title: "Entrada da exposição",
        body: "Zona de entrada e fila em frente à cúpula.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
      },
      {
        title: "Knight Bus",
        body: "Autocarro de dois andares a promover a exposição.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/2.webp",
      },
      {
        title: "Início do percurso",
        body: "Primeira sala com a projeção de um portal para o mundo da magia.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/3.webp",
      },
      {
        title: "Sala imersiva",
        body: "Projeções do Mapa do Marauder e efeitos de luz.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/4.webp",
      },
      {
        title: "Sala de registo",
        body: "Zona de entrada com pórticos e sinalização VIP.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/5.webp",
      },
      {
        title: "Galeria de retratos",
        body: "Parede de quadros mágicos para encerrar o percurso.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/6.webp",
      },
    ],
  },
  de: {
    heroTag: "Ausstellung",
    heroTitle: "Harry Potter: The Exhibition",
    heroLead:
      "Die Ausstellung endete am 17. August 2025. Vielen Dank für Ihren Besuch – freuen Sie sich auf die nächste.",
    videoFallback: "Ihr Browser unterstützt das Video-Element nicht.",
    sectionTitle: "Harry Potter: The Exhibition",
    paragraphs: [
      "Harry Potter: The Exhibition war das erste B2C-Projekt, das wir in Alvernia Planet umgesetzt haben. Eröffnet wurde sie am 11. April 2025, genau am 25. Jahrestag des Erscheinens der ersten Geschichte über den jungen Zauberer, „Harry Potter und der Stein der Weisen“. Die Ausstellung lief bis zum 17. August 2025, also 129 Tage (rund 18 Wochen).",
      "Die Harry-Potter-Saga ist die beliebteste Jugendbuchreihe der Welt. Sie erzählt von einem Waisenkind und Außenseiter, der entdeckt, dass er ein Zauberer ist – Freundschaft und Mut prägen die Magie dieser Geschichte. Die Bücher zählen zu den Bestsellern aller Zeiten und begeistern bis heute neue Generationen von Leserinnen und Lesern.",
      "Rund 200 000 Gäste haben die Ausstellung besucht. Vielen Dank, dass Sie dabei waren – wir sehen uns bei den nächsten Veranstaltungen.",
    ],
    galleryTitle: "Erinnerungen",
    galleryItems: [
      {
        title: "Eingang zur Ausstellung",
        body: "Eingangsbereich und Warteschlange vor der Kuppel.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
      },
      {
        title: "Knight Bus",
        body: "Doppeldeckerbus als Werbung für die Ausstellung.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/2.webp",
      },
      {
        title: "Beginn des Rundgangs",
        body: "Erster Raum mit der Projektion eines Portals in die Zaubererwelt.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/3.webp",
      },
      {
        title: "Immersiver Raum",
        body: "Projektionen der Karte des Rumtreibers und Lichteffekte.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/4.webp",
      },
      {
        title: "Registrierungshalle",
        body: "Eingangszone mit Schleusen und VIP-Beschilderung.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/5.webp",
      },
      {
        title: "Porträtgalerie",
        body: "Eine Wand voller magischer Gemälde zum Abschluss des Rundgangs.",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/6.webp",
      },
    ],
  },
  zh: {
    heroTag: "展览",
    heroTitle: "Harry Potter: The Exhibition",
    heroLead:
      "展览已于 2025 年 8 月 17 日结束。感谢您的到访，敬请期待下一场展览。",
    videoFallback: "您的浏览器不支持视频播放。",
    sectionTitle: "Harry Potter: The Exhibition",
    paragraphs: [
      "Harry Potter: The Exhibition 是我们在 Alvernia Planet 举办的首个面向大众的项目。展览于 2025 年 4 月 11 日开幕，正值这位年轻魔法师的第一部故事《哈利·波特与魔法石》问世 25 周年。展期持续至 2025 年 8 月 17 日，共 129 天（约 18 周）。",
      "哈利·波特系列是全球最受欢迎的青少年小说。故事讲述一个孤儿、一个格格不入的少年发现自己是魔法师，友情与勇气造就了这段魔法旅程。这些作品是历久不衰的畅销书，持续吸引一代又一代读者。",
      "本次展览共迎来约 20 万名观众。感谢您的陪伴，期待在下一场活动中与您相见。",
    ],
    galleryTitle: "回忆",
    galleryItems: [
      {
        title: "展览入口",
        body: "圆顶前的入口区域与等候队伍。",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/1.webp",
      },
      {
        title: "Knight Bus",
        body: "为展览宣传的双层巴士。",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/2.webp",
      },
      {
        title: "参观路线起点",
        body: "第一个展厅，投影出通往魔法世界的入口。",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/3.webp",
      },
      {
        title: "沉浸式展厅",
        body: "《活点地图》投影与灯光效果。",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/4.webp",
      },
      {
        title: "登记大厅",
        body: "设有闸机与 VIP 指示牌的入口区域。",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/5.webp",
      },
      {
        title: "肖像画廊",
        body: "以一整面魔法画像墙为参观路线画上句点。",
        image: "/galeria/Wystawa/HarryPotter_TheExhibition/webp/6.webp",
      },
    ],
  },
};

export default function WystawaContent() {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const copy = COPY[loc];

  return (
    <main className="relative z-10 min-h-screen">
      <section className="relative z-10 px-4 pt-12 sm:pt-16">
        <div className="ap-shell mb-10 sm:mb-12">
          <div className="ap-tile ap-tile-lg relative overflow-hidden">
            <div className="relative aspect-[4/5] sm:aspect-[16/9] bg-black">
              <AdaptiveVideo
                mp4Src="/wystawa/AP_wystawaHPX.mp4"
                webmSrc="/wystawa/AP_wystawaHPX.webm"
                poster="/wystawa/AP_wystawaHPX_poster.webp"
                className="absolute inset-0 h-full w-full object-cover"
                sizes="(min-width: 1200px) 72rem, 100vw"
                fallbackText={copy.videoFallback}
                priority
                rootMargin="320px 0px"
                preferPosterOnLowPower
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85" />
              <div className="absolute inset-0 opacity-60 mix-blend-soft-light bg-[radial-gradient(circle_at_18%_22%,rgba(252,211,77,0.28),transparent_38%),radial-gradient(circle_at_78%_20%,rgba(244,114,182,0.24),transparent_36%),radial-gradient(circle_at_50%_78%,rgba(59,130,246,0.28),transparent_44%)]" />
              <div className="relative flex h-full items-center justify-center p-5 sm:p-10 text-center force-overlay">
                <div className="space-y-3 ap-page-intro-stagger">
                  <p className="ap-type-kicker force-overlay-muted">
                    {copy.heroTag}
                  </p>
                  <h1 className="ap-type-hero-title force-overlay drop-shadow-[0_0_24px_rgba(0,0,0,0.55)]">
                    {copy.heroTitle}
                  </h1>
                  <p className="ap-type-hero-subtitle force-overlay-dim max-w-3xl mx-auto">
                    {copy.heroLead}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-20">
        <div className="ap-shell ap-page-stack">
          <ScrollMotionItem strength="strong" delay={40} className="ap-deferred-section">
            <Card className="space-y-6" variant="solid" motion="off">
              <TourLineAccentTitle variant="green">{copy.sectionTitle}</TourLineAccentTitle>
              <div className="space-y-4 ap-type-section-body text-gray-100 max-w-7xl mx-auto">
                {copy.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Card>
          </ScrollMotionItem>

          <ScrollMotionItem strength="soft" delay={120} className="ap-deferred-section">
            <Card className="space-y-6" variant="glass" motion="off">
              <TourLineAccentTitle variant="green">{copy.galleryTitle}</TourLineAccentTitle>
              <TourLineGalleryRow items={copy.galleryItems} />
            </Card>
          </ScrollMotionItem>
        </div>
      </section>
    </main>
  );
}
