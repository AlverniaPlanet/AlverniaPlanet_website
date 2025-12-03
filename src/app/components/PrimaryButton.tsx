"use client";

import Link, { type LinkProps } from "next/link";
import * as React from "react";

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
  "inline-flex items-center justify-center rounded-full font-semibold text-black bg-amber-400/90 ring-1 ring-black/15 shadow-[0_0_18px_rgba(251,191,36,0.35)] hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition";

export function PrimaryButton(props: PrimaryButtonProps) {
  const { size = "md", className, children, ...rest } = props as PrimaryButtonProps & {
    size: Size;
  };
  const classes = cx(baseClass, sizeMap[size], className);

  if ("href" in props && props.href) {
    const { href, ...linkProps } = rest as AnchorProps;
    return (
      <Link href={href} className={classes} {...linkProps}>
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
