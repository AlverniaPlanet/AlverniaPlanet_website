"use client";

import Image from "next/image";

type BrandLogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

const LOGO_SOURCES = {
  light: "/Loga/Logo_pozytyw.svg",
  dark: "/Loga/Logo_negatyw.svg",
} as const;

export default function BrandLogo({ variant = "dark", className }: BrandLogoProps) {
  const src = LOGO_SOURCES[variant];

  return (
    <span className={`inline-flex h-10 md:h-12 ${className ?? ""}`}>
      <Image
        src={src}
        alt="Alvernia Planet"
        width={841}
        height={295}
        className="h-full w-auto"
        priority
      />
    </span>
  );
}
