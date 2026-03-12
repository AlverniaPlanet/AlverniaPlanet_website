"use client";

import { memo, type CSSProperties } from "react";
import Card from "@/app/components/Card";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import Image from "next/image";

type AttractionCardProps = {
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const AttractionCard = memo(function AttractionCard({
  title,
  description,
  cta,
  href,
  image,
  imageAlt,
}: AttractionCardProps) {
  return (
    <Card
      variant="solid"
      dense
      motion="off"
      className="group ap-interactive-surface h-full bg-white/8 ring-white/15 border border-white/12 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
      style={
        {
          "--ap-card-hover-base-shadow":
            "var(--ap-shadow), inset 0 0 0 1px rgba(255,255,255,0.04)",
        } as CSSProperties
      }
    >
      <div className="flex h-full flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.35)] aspect-[16/10]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 352px, (min-width: 640px) 332px, 300px"
            quality={70}
            fetchPriority="low"
            loading="lazy"
            decoding="async"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-lg sm:text-xl font-semibold leading-tight text-white">
            {title}
          </h3>
          <p className="text-gray-200 text-sm sm:text-base">{description}</p>
        </div>
        <div className="mt-auto pt-2">
          <PrimaryButton href={href} size="sm" className="w-full sm:w-auto">
            {cta}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
});
