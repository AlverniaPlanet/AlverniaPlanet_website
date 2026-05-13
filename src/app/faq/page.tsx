"use client";

import FaqContent, { FAQ_COPY } from "@/app/components/faqContent";
import { useI18n } from "@/app/i18n-provider";
import type { Locale } from "@/lib/localizedRoutes";

export default function FaqPage() {
  const { locale } = useI18n();
  const loc = ((locale as Locale) ?? "pl") as Locale;
  return <FaqContent copy={FAQ_COPY[loc]} />;
}
