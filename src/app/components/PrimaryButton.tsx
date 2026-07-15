"use client";

import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { useI18n } from "@/app/i18n-provider";
import { getLocalizedPath, type Locale } from "@/lib/localizedRoutes";

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
  "ap-primary-button inline-flex items-center justify-center rounded-[var(--ap-btn-radius)] font-semibold text-[color:var(--ap-accent-contrast)] bg-[color:var(--ap-accent)] ring-1 ring-[color:var(--ap-accent-ring)] shadow-[var(--ap-accent-shadow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ap-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ap-bg)] transition";

export function PrimaryButton(props: PrimaryButtonProps) {
  const { locale } = useI18n();
  const loc: Locale = (locale as Locale) ?? "pl";
  const { size = "md", className, children, ...rest } = props as PrimaryButtonProps & {
    size: Size;
  };
  const classes = cx(baseClass, sizeMap[size], className);

  if ("href" in props && props.href) {
    const { href, ...linkProps } = rest as AnchorProps;
    const hrefString = String(href);
    const normalizedHref = hrefString.startsWith("/") ? getLocalizedPath(hrefString, loc) : hrefString;
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
