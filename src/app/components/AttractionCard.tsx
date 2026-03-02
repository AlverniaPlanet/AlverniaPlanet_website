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
      variant="solid"
      dense
      motion="off"
      className="group h-full bg-white/8 ring-white/15 border border-white/12 text-white/90 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(79,207,222,0.18)] hover:ring-[rgba(79,207,222,0.35)]"
    >
      <div className="flex h-full flex-col gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.35)] aspect-[16/10]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority={false}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold leading-tight text-white">
            {title}
          </h3>
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
