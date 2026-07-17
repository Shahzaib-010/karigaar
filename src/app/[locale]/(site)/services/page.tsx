"use client";

import { useLocale } from "next-intl";

import ServicesBrowse from "@/src/components/site/ServicesBrowse";

export default function ServicesPage() {
  const locale = useLocale();

  // Public — anyone can browse the catalog. The Book action (in ServicesBrowse)
  // is the auth checkpoint: signed-out users are sent to login first.
  return <ServicesBrowse locale={locale} />;
}
