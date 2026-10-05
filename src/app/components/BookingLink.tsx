"use client";

import Link from "next/link";
import * as React from "react";

/**
 * Link do systemu sprzedaży biletów.
 *
 * Sprzedaż jest w Iksorisie, czyli pod adresami ZEWNĘTRZNYMI
 * (bilety.alverniaplanet.com), ale część odnośników w serwisie nadal prowadzi
 * do tras wewnętrznych (np. /rezerwuj). Te dwa przypadki wymagają różnych
 * elementów:
 *
 *   • trasa wewnętrzna → <Link> z next/link, żeby zadziałała nawigacja
 *     kliencka; zwykłe <a> przeładowałoby całą stronę,
 *   • adres zewnętrzny → zwykłe <a>; <Link> jest komponentem routera i nie
 *     ma tu czego routować.
 *
 * Ten komponent rozstrzyga to sam po kształcie adresu, więc przełączenie
 * systemu sprzedaży nie wymaga przepisywania miejsc wywołania.
 */
type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: React.ReactNode;
};

export default function BookingLink({ href, children, ...rest }: Props) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
