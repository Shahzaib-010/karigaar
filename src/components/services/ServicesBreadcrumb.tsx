"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

export default function ServicesBreadcrumb() {
  const locale = useLocale();
  const t = useTranslations("servicesListing.breadcrumb");

  return (
    <nav aria-label={t("aria")} className="flex items-center gap-1.5 text-[13px]">
      <Link
        href={`/${locale}`}
        className="font-semibold text-[#6B6B6B] transition-colors hover:text-[#1D9E75]"
      >
        {t("home")}
      </Link>
      <ChevronRight className="size-3.5 text-[#6B6B6B]" aria-hidden />
      <span className="font-semibold text-[#1A1A1A]">{t("services")}</span>
    </nav>
  );
}
