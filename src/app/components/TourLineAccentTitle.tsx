import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "warm" | "cool" | "green";
};

export default function TourLineAccentTitle({ children, className, variant = "warm" }: Props) {
  const underlineByVariant: Record<NonNullable<Props["variant"]>, string> = {
    warm: "from-amber-400 via-fuchsia-500 to-indigo-500",
    cool: "from-sky-300 via-cyan-400 to-blue-700",
    green: "from-emerald-200 via-green-400 to-emerald-700",
  };
  const underline = underlineByVariant[variant] ?? underlineByVariant.warm;

  return (
    <div className={`space-y-3 text-center ${className ?? ""}`}>
      <h2 className="text-3xl sm:text-4xl font-extrabold">{children}</h2>
      <div className={`mx-auto h-[2px] w-24 bg-gradient-to-r ${underline} rounded-full`} />
    </div>
  );
}
