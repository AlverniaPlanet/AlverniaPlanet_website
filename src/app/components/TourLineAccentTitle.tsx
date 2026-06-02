import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "warm" | "cool" | "green" | "red";
};

export default function TourLineAccentTitle({ children, className, variant = "warm" }: Props) {
  const underlineByVariant: Record<NonNullable<Props["variant"]>, string> = {
    warm: "from-[#f03c64] via-[#f77828] to-[#4fcfde]",
    cool: "from-[#4fcfde] via-[#a5e6f0] to-[#171730]",
    green: "from-[#aab4be] via-[#4fcfde] to-[#171730]",
    red: "from-[#f7486c] via-[#ff8a9b] to-[#471028]",
  };
  const underline = underlineByVariant[variant] ?? underlineByVariant.warm;

  return (
    <div className={`space-y-3 text-center ${className ?? ""}`}>
      <h2 className="text-3xl sm:text-4xl font-extrabold">{children}</h2>
      <div className={`mx-auto h-[2px] w-24 bg-gradient-to-r ${underline} rounded-full`} />
    </div>
  );
}
