import type { CSSProperties } from "react";

/* Tekst nagłówka sekcji z wejściem „rozszczepienie barw" — tym samym, które
   pierwsze dostał nagłówek „Rok 2035": napis wyłania się i podnosi, a dwie
   kopie (turkusowa w pasy i czerwona) zjeżdżają się w niego z boków i gasną.
   Rysuje to arkusz (`.mars-rozszczepienie` w `mars.css`); tu stoi tylko tekst
   i jego kopia w `data-tekst`, z której biorą treść pseudoelementy.

   Wejście rusza, gdy sekcja wjeżdża w kadr (`data-ujawnij`). `startMs`
   przesuwa je w czasie — w scenach z zaprzeczeniem („Czym jest", „Real
   humanoids") nagłówek wchodzi dopiero po przekreśleniu. */
export function TekstNaglowka({ tekst, startMs }: { tekst: string; startMs?: number }) {
  return (
    <span
      className="mars-rozszczepienie"
      data-tekst={tekst}
      style={
        startMs === undefined
          ? undefined
          : ({ "--ms-naglowek-opoznienie": `${startMs}ms` } as CSSProperties)
      }
    >
      {tekst}
    </span>
  );
}
