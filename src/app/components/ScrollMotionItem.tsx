"use client";

import { type ReactNode } from "react";

type ScrollMotionStrength = "soft" | "strong";

type ScrollMotionItemProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  strength?: ScrollMotionStrength;
  float?: boolean;
};

export default function ScrollMotionItem({
  children,
  className,
  delay = 0,
  strength = "soft",
  float = false,
}: ScrollMotionItemProps) {
  void delay;
  void strength;
  void float;

  return (
    <div className={className ?? ""}>{children}</div>
  );
}
