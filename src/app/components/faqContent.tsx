"use client";

import { useState } from "react";
import Card from "@/app/components/Card";
import type { Locale } from "@/lib/localizedRoutes";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCopy = {
  badge: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
};

export const FAQ_COPY: Record<Locale, FaqCopy> = {
  pl: {
    badge: "FAQ",
    title: "Najczęściej zadawane pytania",
    subtitle: "Szybkie odpowiedzi przed wizytą i rezerwacją.",
    items: [
      {
        question: "Dla kogo są bilety ulgowe?",
        answer:
          "Bilet ulgowy przysługuje po okazaniu ważnego dokumentu:\n• dzieci i młodzież szkolna do ukończenia 19. roku życia (ważna legitymacja szkolna);\n• studenci i doktoranci do ukończenia 26. roku życia (legitymacja studencka lub doktorancka);\n• emeryci i renciści (legitymacja ze zdjęciem; przy legitymacji bez zdjęcia dodatkowo dokument tożsamości ze zdjęciem);\n• osoby z niepełnosprawnością (orzeczenie o niepełnosprawności lub legitymacja osoby z niepełnosprawnością);\n• jeden opiekun lub asystent osoby z niepełnosprawnością towarzyszący jej podczas zwiedzania.\n\nWstęp bezpłatny mają dzieci do ukończenia 3. roku życia oraz opiekun lub asystent osoby z niepełnosprawnością, która nie ukończyła 16. roku życia. Uprawnienie do ulgi może zostać zweryfikowane przy wejściu; brak odpowiedniego dokumentu może wiązać się z dopłatą do biletu normalnego. Szczegóły znajdują się w Regulaminie.",
      },
      {
        question: "W jakiej kolejności należy zwiedzać obiekt, posiadając bilet na wszystkie atrakcje?",
        answer:
          "Atrakcje można odwiedzać w dowolnej kolejności. Z naszej strony rekomendujemy trasę „Poznaj – Przeżyj – Zagraj”, która rozpoczyna się od Ścieżki Filmowej, następnie prowadzi do Kina 360, a kończy się na projekcie Mars.",
      },
      {
        question: "Ile czasu zajmuje skorzystanie ze wszystkich atrakcji?",
        answer: "Zwiedzanie wszystkich atrakcji we własnym tempie zajmuje średnio od 2 do 3 godzin.",
      },
      {
        question: "Czy można zmienić termin rezerwacji?",
        answer: "Tak, zmiana terminu rezerwacji jest możliwa po wcześniejszym kontakcie z naszą infolinią.",
      },
      {
        question: "Ile osób może jednocześnie korzystać z poszczególnych atrakcji?",
        answer:
          "Kino 360 – do 150 osób, Ścieżka Filmowa – do 50 osób, MARS – do 25 osób podczas jednej tury.",
      },
      {
        question: "Ile kopuł obejmuje zwiedzanie?",
        answer: "Podczas wizyty odwiedzą Państwo 5 kopuł znajdujących się na terenie naszego obiektu.",
      },
      {
        question: "Czy trasa jest dostępna dla osób poruszających się na wózkach?",
        answer:
          "Tak. Większość trasy jest w pełni dostępna dla osób poruszających się na wózkach. Na trasie znajduje się jedno miejsce ze schodami, które można ominąć alternatywnym przejściem.",
      },
      {
        question: "Czy małe dzieci znajdą u nas coś dla siebie?",
        answer:
          "Oczywiście. Nasze atrakcje zostały przygotowane w taki sposób, aby każdy uczestnik – niezależnie od wieku – znalazł coś interesującego i angażującego.",
      },
      {
        question: "Kiedy otwarta jest Wioska Barbarzyńców?",
        answer:
          "Wioska Barbarzyńców to atrakcja sezonowa, uruchamiana podczas wybranych wydarzeń, eventów oraz specjalnych okazji.",
      },
      {
        question: "Czy osoby starsze poradzą sobie podczas wizyty na Marsie?",
        answer:
          "Tak. Na terenie MARS obecny jest kierownik planu, który służy pomocą i odpowiada na wszelkie pytania uczestników.",
      },
      {
        question: "Jak dotrzeć do poszczególnych atrakcji?",
        answer:
          "Na terenie obiektu dostępne są mapy, które ułatwiają poruszanie się między atrakcjami. Dodatkowo pracownicy recepcji chętnie wskażą drogę i udzielą wszelkich informacji.",
      },
      {
        question: "Kim są Alver i Alvenia?",
        answer:
          "Alver i Alvenia to maskotki naszego obiektu. Ich wizerunki można spotkać w mediach społecznościowych, na pamiątkach oraz podczas zwiedzania Ścieżki Filmowej.",
      },
      {
        question: "Czy repertuar Kina 360 będzie się zmieniał?",
        answer:
          "Tak. Projekcje prezentowane w Kinie 360° będą regularnie aktualizowane i zmieniane w określonych odstępach czasu.",
      },
      {
        question: "Czy można wejść na teren obiektu z psem?",
        answer:
          "Psy są mile widziane na terenie naszego obiektu, jednak mogą przebywać wyłącznie w strefach zewnętrznych. Ze względu na intensywne efekty dźwiękowe i multimedialne wewnątrz kopuł, nie zalecamy wprowadzania zwierząt do atrakcji, aby zapewnić im komfort i bezpieczeństwo.",
      },
    ],
  },
  en: {
    badge: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Quick answers before your visit and booking.",
    items: [
      {
        question: "Who is eligible for a reduced-price ticket?",
        answer:
          "A reduced (concession) ticket is available, on presentation of a valid document, to:\n• children and school pupils up to the age of 19 (valid school ID);\n• students and doctoral candidates up to the age of 26 (valid student or doctoral ID);\n• pensioners and retirees (a photo ID card, or a non-photo card together with a photo identity document);\n• people with disabilities (a disability certificate or a disability ID card);\n• one carer or assistant accompanying a person with a disability during the visit.\n\nFree entry applies to children under 3 years of age and to the carer or assistant of a person with a disability who is under 16. Eligibility may be checked at the entrance; without the required document you may need to pay the difference up to a standard ticket. Full details are set out in the Regulations.",
      },
      {
        question: "In what order should I visit the venue with an all-attractions ticket?",
        answer:
          "You can visit the attractions in any order. We recommend the “Discover – Experience – Play” route, starting with the Film Path, then the 360° Cinema, and finishing with MARS.",
      },
      {
        question: "How long does it take to enjoy all the attractions?",
        answer: "Visiting all the attractions at your own pace takes on average 2 to 3 hours.",
      },
      {
        question: "Can I change my booking date?",
        answer: "Yes, you can change your booking date after contacting our info line in advance.",
      },
      {
        question: "How many people can use each attraction at the same time?",
        answer:
          "360° Cinema – up to 150 people, Film Path – up to 50 people, MARS – up to 25 people per session.",
      },
      {
        question: "How many domes does the tour cover?",
        answer: "During your visit you'll explore 5 domes located on our site.",
      },
      {
        question: "Is the route accessible for wheelchair users?",
        answer:
          "Yes. Most of the route is fully accessible for wheelchair users. There is one spot with stairs, which can be bypassed via an alternative passage.",
      },
      {
        question: "Will small children find something for them here?",
        answer:
          "Absolutely. Our attractions are designed so that every guest – regardless of age – finds something interesting and engaging.",
      },
      {
        question: "When is the Barbarians' Village open?",
        answer:
          "The Barbarians' Village is a seasonal attraction, opened during selected events and special occasions.",
      },
      {
        question: "Will older guests manage during the Mars visit?",
        answer:
          "Yes. A set manager is present at MARS to assist and answer any questions from participants.",
      },
      {
        question: "How do I get to each attraction?",
        answer:
          "Maps are available on site to help you move between attractions. Our reception staff will also gladly point the way and provide any information.",
      },
      {
        question: "Who are Alver and Alvenia?",
        answer:
          "Alver and Alvenia are our venue's mascots. You can meet them on social media, on souvenirs, and during the Film Path tour.",
      },
      {
        question: "Will the 360° Cinema repertoire change?",
        answer:
          "Yes. The screenings shown in the 360° Cinema will be regularly updated and rotated at set intervals.",
      },
      {
        question: "Can I enter the venue with a dog?",
        answer:
          "Dogs are welcome on our site, but only in the outdoor areas. Due to the intense sound and multimedia effects inside the domes, we don't recommend bringing animals into the attractions, for their comfort and safety.",
      },
    ],
  },
  pt: {
    badge: "FAQ",
    title: "Perguntas mais frequentes",
    subtitle: "Respostas rápidas antes da visita e da reserva.",
    items: [
      {
        question: "Quem tem direito a bilhete com desconto?",
        answer:
          "O bilhete com desconto está disponível, mediante apresentação de documento válido, para:\n• crianças e alunos até aos 19 anos (cartão de estudante escolar válido);\n• estudantes e doutorandos até aos 26 anos (cartão de estudante ou de doutorando válido);\n• reformados e pensionistas (cartão com fotografia, ou cartão sem fotografia acompanhado de documento de identificação com fotografia);\n• pessoas com deficiência (atestado de incapacidade ou cartão de pessoa com deficiência);\n• um acompanhante ou assistente que acompanhe a pessoa com deficiência durante a visita.\n\nA entrada gratuita aplica-se a crianças com menos de 3 anos e ao acompanhante ou assistente de pessoa com deficiência com menos de 16 anos. O direito ao desconto pode ser verificado à entrada; sem o documento exigido poderá ter de pagar a diferença para o bilhete normal. Os detalhes constam do Regulamento.",
      },
      {
        question: "Em que ordem devo visitar o espaço com o bilhete para todas as atrações?",
        answer:
          "Pode visitar as atrações em qualquer ordem. Recomendamos o percurso “Conhece – Vive – Joga”, que começa no Percurso de Filmagem, segue para o Cinema 360° e termina no MARS.",
      },
      {
        question: "Quanto tempo demora a desfrutar de todas as atrações?",
        answer: "Visitar todas as atrações ao teu ritmo demora, em média, 2 a 3 horas.",
      },
      {
        question: "É possível alterar a data da reserva?",
        answer: "Sim, a alteração da data da reserva é possível após contacto prévio com a nossa linha de informação.",
      },
      {
        question: "Quantas pessoas podem usar cada atração ao mesmo tempo?",
        answer:
          "Cinema 360° – até 150 pessoas, Percurso de Filmagem – até 50 pessoas, MARS – até 25 pessoas por sessão.",
      },
      {
        question: "Quantas cúpulas inclui a visita?",
        answer: "Durante a visita irá conhecer 5 cúpulas existentes no nosso espaço.",
      },
      {
        question: "O percurso é acessível para pessoas em cadeira de rodas?",
        answer:
          "Sim. A maior parte do percurso é totalmente acessível a pessoas em cadeira de rodas. Existe um ponto com escadas, que pode ser contornado por uma passagem alternativa.",
      },
      {
        question: "As crianças pequenas vão encontrar algo para elas?",
        answer:
          "Claro. As nossas atrações foram preparadas para que cada visitante – independentemente da idade – encontre algo interessante e envolvente.",
      },
      {
        question: "Quando está aberta a Aldeia dos Bárbaros?",
        answer:
          "A Aldeia dos Bárbaros é uma atração sazonal, ativada durante eventos selecionados e ocasiões especiais.",
      },
      {
        question: "As pessoas mais velhas vão conseguir durante a visita ao Mars?",
        answer:
          "Sim. No MARS está presente um chefe de set que ajuda e responde a todas as perguntas dos participantes.",
      },
      {
        question: "Como chegar a cada atração?",
        answer:
          "No espaço existem mapas que facilitam a deslocação entre atrações. Além disso, a equipa da receção indica o caminho e presta todas as informações.",
      },
      {
        question: "Quem são o Alver e a Alvenia?",
        answer:
          "O Alver e a Alvenia são as mascotes do nosso espaço. Podes encontrá-los nas redes sociais, em recordações e durante a visita ao Percurso de Filmagem.",
      },
      {
        question: "O repertório do Cinema 360° vai mudar?",
        answer:
          "Sim. As sessões apresentadas no Cinema 360° serão regularmente atualizadas e alteradas em intervalos definidos.",
      },
      {
        question: "É possível entrar no espaço com um cão?",
        answer:
          "Os cães são bem-vindos no nosso espaço, mas apenas nas zonas exteriores. Devido aos intensos efeitos sonoros e multimédia dentro das cúpulas, não recomendamos levar animais para as atrações, para o seu conforto e segurança.",
      },
    ],
  },
};

// Sam akordeon FAQ (Card + lista), reużywalny na podstronie /faq oraz na home.
// titleAs: na /faq tytuł jest głównym nagłówkiem strony (h1); przy osadzeniu
// w innej stronie (np. home) zostaje domyślne h2.
export function FaqAccordion({ copy, titleAs = "h2" }: { copy: FaqCopy; titleAs?: "h1" | "h2" }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <Card title={copy.title} titleAs={titleAs} titleCentered titleDivider dense motion="off">
      <p className="ap-type-section-body mx-auto max-w-2xl text-center">{copy.subtitle}</p>

      <ul className="mt-8 space-y-3">
        {copy.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <li key={item.question}>
              <div className={`ap-tile ap-tile-interactive ${isOpen ? "is-active" : ""}`}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7ef6ff]/76">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-base font-semibold leading-snug text-white sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className={`text-white/60 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                  >
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5.5 7.5 10 12l4.5-4.5" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
                >
                  <div className="min-h-0">
                    <p className="whitespace-pre-line px-5 pb-5 text-sm leading-7 text-white/74 sm:px-6 sm:pb-6 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default function FaqContent({ copy }: { copy: FaqCopy }) {
  return (
    <main className="relative min-h-screen px-4 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[56rem]">
        <FaqAccordion copy={copy} titleAs="h1" />
      </div>
    </main>
  );
}
