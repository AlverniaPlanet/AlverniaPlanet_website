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
        question: "Ile trwa zwiedzanie?",
        answer:
          "Sama Ścieżka filmowa trwa około 2,5 godziny. Kino K360 trwa około 30 minut, więc pakiet Ścieżka + Kino K360 to około 3 godziny łącznie.",
      },
      {
        question: "W jakim języku odbywa się oprowadzanie i seans?",
        answer:
          "Oprowadzanie Ścieżki filmowej oraz projekcje K360 odbywają się w języku polskim.",
      },
      {
        question: "Ile kosztuje zwiedzanie?",
        answer:
          "Bilet normalny kosztuje 79 zł za osobę, a bilet ulgowy 69 zł za osobę. W cenie jest zwiedzanie przestrzeni Alvernia Planet z przewodnikiem oraz część edukacyjna.",
      },
      {
        question: "Czy jest strefa gastro?",
        answer:
          "Na miejscu nie ma restauracji, natomiast działa sklepik z pamiątkami, w którym można kupić drobne przekąski i napoje.",
      },
      {
        question: "Czy mają państwo dostępne jakieś warsztaty?",
        answer:
          "Standardowa wizyta obejmuje zwiedzanie z przewodnikiem oraz część edukacyjną o produkcji filmowej. Oddzielne warsztaty nie są obecnie prowadzone w ramach standardowego zwiedzania.",
      },
      {
        question: "Czy można wejść bez wcześniejszej rezerwacji biletów?",
        answer:
          "Nie - obowiązuje wcześniejsza rezerwacja biletów, ponieważ zwiedzanie odbywa się w określonych godzinach i z przewodnikiem.",
      },
      {
        question: "Jakie są godziny otwarcia?",
        answer:
          "Infolinia działa od poniedziałku do piątku w godz. 9:00-16:00. Kino K360 jest otwarta od poniedziałku do czwartku 11:00-17:00, w piątki 11:00-18:00, a w soboty i niedziele 11:00-19:30. Ścieżka filmowa działa od poniedziałku do soboty 8:00-17:00, a w niedziele jest zamknięta.",
      },
      {
        question: "Kiedy otrzymam zwrot po anulowaniu rezerwacji?",
        answer:
          "W przypadku anulowania rezerwacji zwrot środków wraca do 14 dni roboczych na numer konta podany podczas zakładania rezerwacji.",
      },
      {
        question: "Czy można przyjechać z rodziną lub przyjaciółmi czy tylko grupy?",
        answer:
          "Oczywiście można przyjechać zarówno indywidualnie, na przykład z rodziną lub znajomymi, jak i w grupie zorganizowanej.",
      },
      {
        question: "Jaka produkcja była tu realizowana ostatnio?",
        answer:
          "W Alvernia Planet powstawało wiele produkcji filmowych, serialowych i reklamowych - między innymi Akademia Pana Kleksa, 99 Gra o wszystko oraz inne liczne międzynarodowe projekty.",
      },
      {
        question: "Czy wejdziemy na plan zdjęciowy jakiejś produkcji?",
        answer:
          "Nie - hale zdjęciowe są miejscem pracy ekip filmowych, dlatego podczas zwiedzania nie ma możliwości wejścia na aktywny plan zdjęciowy.",
      },
    ],
  },
  en: {
    badge: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Quick answers before your visit and booking.",
    items: [
      {
        question: "How long does the tour take?",
        answer:
          "The Film Path visit itself lasts about 2.5 hours. The K360 Cinema lasts about 30 minutes, so the Film Path + K360 Cinema package takes about 3 hours in total.",
      },
      {
        question: "What language are the tour and screening in?",
        answer:
          "The Film Path guided tour and K360 Cinema screenings are available in Polish.",
      },
      {
        question: "How much does the tour cost?",
        answer:
          "The standard ticket costs 79 PLN per person and the reduced ticket costs 69 PLN per person. The price includes a guided tour of the Alvernia Planet spaces and the educational part.",
      },
      {
        question: "Is there a food zone?",
        answer:
          "There is no restaurant on site, but there is a souvenir shop where you can buy small snacks and drinks.",
      },
      {
        question: "Do you offer any workshops?",
        answer:
          "The standard visit includes a guided tour and an educational segment about film production. Separate workshops are not currently offered as part of the standard visit.",
      },
      {
        question: "Can you enter without booking tickets in advance?",
        answer:
          "No. Advance ticket booking is required because visits take place at scheduled times and with a guide.",
      },
      {
        question: "What are the opening hours?",
        answer:
          "The info line is open Monday to Friday from 9:00 to 16:00. The K360 Cinema is open Monday to Thursday 11:00-17:00, Friday 11:00-18:00, and Saturday to Sunday 11:00-19:30. The Film Path is open Monday to Saturday 8:00-17:00 and closed on Sunday.",
      },
      {
        question: "When will I receive the refund after cancelling a booking?",
        answer:
          "If a booking is cancelled, the refund is returned within 14 business days to the account number provided when the reservation was created.",
      },
      {
        question: "Can I come with family or friends, or is it only for groups?",
        answer:
          "Of course. You can visit both individually, for example with family or friends, and as part of an organized group.",
      },
      {
        question: "What production was made here most recently?",
        answer:
          "Many film, TV and commercial productions have been created at Alvernia Planet, including Akademia Pana Kleksa, 99 Gra o wszystko and many other international projects.",
      },
      {
        question: "Will we enter an active film set during the visit?",
        answer:
          "No. Sound stages are workplaces for film crews, so there is no access to an active set during the visit.",
      },
    ],
  },
  pt: {
    badge: "FAQ",
    title: "Perguntas mais frequentes",
    subtitle: "Respostas rápidas antes da visita e da reserva.",
    items: [
      {
        question: "Quanto tempo dura a visita?",
        answer:
          "O Percurso de filmagem por si só dura cerca de 2,5 horas. A cinema K360 dura cerca de 30 minutos, por isso o pacote Percurso + Cinema K360 dura cerca de 3 horas no total.",
      },
      {
        question: "Em que idioma decorrem a visita e a sessão?",
        answer:
          "A visita guiada do Percurso de filmagem e as sessões da cinema K360 decorrem em polaco.",
      },
      {
        question: "Quanto custa a visita?",
        answer:
          "O bilhete normal custa 79 PLN por pessoa e o bilhete reduzido custa 69 PLN por pessoa. O preço inclui a visita guiada aos espaços da Alvernia Planet e a parte educativa.",
      },
      {
        question: "Existe zona de restauração?",
        answer:
          "No local não existe restaurante, mas há uma loja de recordações onde é possível comprar pequenos snacks e bebidas.",
      },
      {
        question: "Têm workshops disponíveis?",
        answer:
          "A visita standard inclui uma visita guiada e uma parte educativa sobre produção audiovisual. Workshops separados não são atualmente realizados no formato standard da visita.",
      },
      {
        question: "É possível entrar sem reservar bilhetes antecipadamente?",
        answer:
          "Não. É obrigatória a reserva prévia, porque as visitas decorrem em horários definidos e com guia.",
      },
      {
        question: "Quais são os horários de funcionamento?",
        answer:
          "A linha de informação funciona de segunda a sexta das 9:00 às 16:00. A cinema K360 abre de segunda a quinta das 11:00 às 17:00, à sexta das 11:00 às 18:00, e ao sábado e domingo das 11:00 às 19:30. O Percurso de filmagem funciona de segunda a sábado das 8:00 às 17:00 e está encerrado ao domingo.",
      },
      {
        question: "Quando recebo o reembolso após cancelar a reserva?",
        answer:
          "Em caso de cancelamento da reserva, o reembolso regressa no prazo de até 14 dias úteis para o número de conta indicado durante a criação da reserva.",
      },
      {
        question: "Posso visitar com família ou amigos ou é só para grupos?",
        answer:
          "Claro. Pode visitar individualmente, por exemplo com família ou amigos, e também em grupo organizado.",
      },
      {
        question: "Que produção foi realizada aqui mais recentemente?",
        answer:
          "Na Alvernia Planet foram realizadas muitas produções audiovisuais, séries e publicidade, incluindo Akademia Pana Kleksa, 99 Gra o wszystko e muitos outros projetos internacionais.",
      },
      {
        question: "Vamos entrar num set de filmagem ativo?",
        answer:
          "Não. Os estúdios são locais de trabalho das equipas de filmagem, por isso não existe acesso a um set ativo durante a visita.",
      },
    ],
  },
};

export default function FaqContent({ copy }: { copy: FaqCopy }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <main className="relative min-h-screen px-4 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-[56rem]">
        <Card title={copy.title} titleCentered titleDivider dense motion="off">
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
                        <p className="px-5 pb-5 text-sm leading-7 text-white/74 sm:px-6 sm:pb-6 sm:text-base">
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
      </div>
    </main>
  );
}
