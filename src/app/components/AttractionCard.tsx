"use client";

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

export function AttractionCard({
  title,
  description,
  cta,
  href,
  image,
  imageAlt,
}: AttractionCardProps) {
  return (
    <Card
      variant="glass"
      dense
      className="h-full bg-white/8 ring-white/15 border border-white/12 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
    >
      <div className="flex flex-col h-full gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.35)] aspect-[16/10]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-200 text-sm sm:text-base">{description}</p>
        </div>
        <div className="mt-auto pt-2">
          <PrimaryButton href={href} size="md" className="w-full sm:w-auto">
            {cta}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}
