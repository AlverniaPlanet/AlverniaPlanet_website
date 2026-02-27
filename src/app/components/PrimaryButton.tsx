"use client";

import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { useI18n } from "@/app/i18n-provider";

function cx(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  size?: Size;
};

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> &
  LinkProps & {
    href: string;
  };

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export type PrimaryButtonProps = AnchorProps | ButtonProps;

const sizeMap: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm sm:text-[0.95rem]",
  md: "px-5 py-2 text-sm sm:text-base",
  lg: "px-6 py-2.5 text-base",
};

const baseClass =
  "inline-flex items-center justify-center rounded-full font-semibold text-[color:var(--ap-accent-contrast)] bg-[color:var(--ap-accent)] ring-1 ring-[color:var(--ap-accent-ring)] shadow-[0_4px_10px_rgba(79,207,222,0.18)] hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ap-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ap-bg)] transition";

export function PrimaryButton(props: PrimaryButtonProps) {
  const { locale } = useI18n();
  const { size = "md", className, children, ...rest } = props as PrimaryButtonProps & {
    size: Size;
  };
  const classes = cx(baseClass, sizeMap[size], className);
  const plToIntl: Record<string, string> = {
    "/wydarzenia": "/events",
    "/jak-dojechac": "/getting-there",
    "/bilety": "/tickets",
    "/o-alvernia-planet": "/about",
    "/galeria": "/gallery",
    "/kontakt": "/contact",
    "/aktualnosci": "/news",
    "/atrakcje/wystawa": "/attractions/exhibition",
    "/atrakcje/sciezka-filmowa": "/attractions/film-path",
    "/atrakcje/kino-360": "/attractions/cinema-360",
  };

  if ("href" in props && props.href) {
    const { href, ...linkProps } = rest as AnchorProps;
    const normalizedHref = (() => {
      if (!href.startsWith("/")) return href;
      if (href.startsWith("/en") || href.startsWith("/pt") || href.startsWith("/legal/")) return href;
      if (locale !== "en" && locale !== "pt") return href;
      const mapped = plToIntl[href] ?? href;
      if (mapped === "/") return `/${locale}`;
      return `/${locale}${mapped.startsWith("/") ? mapped : `/${mapped}`}`;
    })();
    return (
      <Link href={normalizedHref} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonProps;
  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
