"use client";
import * as React from "react";

function cx(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

type Variant = "solid" | "glass" | "outlined";

type CardProps = {
  /** Jaki element ma zostać wyrenderowany (domyślnie <article>) */
  as?: React.ElementType;
  title?: React.ReactNode;
  titleClassName?: string;
  titleCentered?: boolean;
  titleDivider?: boolean;
  titleDividerClassName?: string;
  children: React.ReactNode;
  className?: string;
  /** "solid" = pełne tło, "glass" = półprzezroczyste z blur */
  variant?: Variant;
  /** ciaśniejsze paddingi */
  dense?: boolean;
  /** subtelna poświata */
  glow?: boolean;
  /** bez paddingu (np. pod galerię) */
  noPad?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export default function Card({
  as = "article",
  title,
  titleClassName,
  titleCentered = false,
  titleDivider = false,
  titleDividerClassName,
  children,
  className,
  variant = "solid",
  dense = false,
  glow = false,
  noPad = false,
  ...rest
}: CardProps) {
  const Tag = as as React.ElementType;

  const base = "ap-card rounded-3xl ring-1 ring-[color:var(--ap-border)] shadow-[var(--ap-shadow)]";
  const bg =
    variant === "glass"
      ? "bg-[color:var(--ap-surface-strong)] backdrop-blur-md"
      : variant === "outlined"
      ? "bg-[color:var(--ap-surface-contrast)] border border-[color:var(--ap-border-strong)]"
      : "bg-[color:var(--ap-surface)]";
  const pad = noPad ? "" : dense ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const halo = glow
    ? "after:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:shadow-[0_0_80px_rgba(255,255,255,0.07)]"
    : "";

  return (
    <Tag className={cx("relative", base, bg, pad, halo, className)} {...rest}>
      {title != null && (
        <>
          <h2
            className={cx(
              "text-2xl sm:text-3xl md:text-4xl font-bold mb-2",
              titleCentered && "text-center",
              titleClassName,
            )}
          >
            {title}
          </h2>
          {titleDivider && (
            <div
              className={cx(
                "h-[1px] w-full bg-white/15 mb-6",
                titleCentered && "mx-auto",
                titleDividerClassName,
              )}
            />
          )}
        </>
      )}
      {children}
    </Tag>
  );
}
