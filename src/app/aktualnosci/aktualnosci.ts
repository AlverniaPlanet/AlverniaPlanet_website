// src/app/aktualnosci/aktualnosci.ts
const translations = {
  pl: {
    headline: "Aktualności",
    intro: "Wydarzenia, ogłoszenia i ciekawostki z Alvernia Planet.",
    posts: {
      "1": {
        title: "Rozpoczęcie wystawy: Harry Potter™: The Exhibition",
        excerpt:
          "Zajrzyj do Alvernia Planet — futurystyczne 13 kopuł łączą rozrywkę, edukację i eventy. 30–35 km od Krakowa, tuż przy A4. Poznaj świat filmu!",
      },
      "2": {
        title: "Zakończenie wystawy: Harry Potter™: The Exhibition",
        excerpt:
          "17 sierpnia 2025 kończymy ekspozycję Harry Potter™: The Exhibition. Nie przegap ostatnich terminów zwiedzania!",
      },
      "3": {
        title: "Przebudowa ścieżki filmowej",
        excerpt:
          "20 października rozpoczynamy prace nad nową odsłoną ścieżki filmowej. Wkrótce więcej informacji o atrakcjach.",
      },
    },
  },
  en: {
    headline: "News",
    intro: "Events, announcements and highlights from Alvernia Planet.",
    posts: {
      "1": {
        title: "Opening: Harry Potter™: The Exhibition",
        excerpt:
          "On April 10, 2025, we open the Harry Potter™: The Exhibition at Alvernia Planet. Check tickets and dates!",
      },
      "2": {
        title: "Closing: Harry Potter™: The Exhibition",
        excerpt:
          "On August 17, 2025, the Harry Potter™: The Exhibition ends. Don’t miss the final dates!",
      },
      "3": {
        title: "Film Path refurbishment",
        excerpt:
          "On October 20, we begin revamping the film path. More details on new attractions coming soon.",
      },
    },
  },
  pt: {
    headline: "Notícias",
    intro: "Eventos, anúncios e novidades da Alvernia Planet.",
    posts: {
      "1": {
        title: "Abertura: Harry Potter™: The Exhibition",
        excerpt:
          "A 10 de abril de 2025 abrimos a Harry Potter™: The Exhibition na Alvernia Planet. Consulte bilhetes e datas!",
      },
      "2": {
        title: "Encerramento: Harry Potter™: The Exhibition",
        excerpt:
          "A 17 de agosto de 2025 termina a Harry Potter™: The Exhibition. Não perca as últimas datas!",
      },
      "3": {
        title: "Renovação do percurso cinematográfico",
        excerpt:
          "A 20 de outubro iniciamos a renovação do percurso cinematográfico. Mais detalhes sobre novas atrações em breve.",
      },
    },
  },
} as const;

export type NewsMeta = {
  id: string;
  date: string;
  category: "ścieżka filmowa" | "kino 360" | "ogólne";
};

export const NEWS_META: NewsMeta[] = [
  { id: "1", date: "2025-04-10", category: "ogólne" },          // start wystawy HP
  { id: "2", date: "2025-08-17", category: "ogólne" },          // koniec wystawy HP
  { id: "3", date: "2025-10-20", category: "ścieżka filmowa" }, // przebudowa ścieżki
];

export default translations;
