"use client";

import { useLocale } from "next-intl";

import ClientGuard from "@/src/components/site/ClientGuard";
import MyBookings from "@/src/components/site/MyBookings";

export default function BookingsPage() {
  const locale = useLocale();

  return (
    <ClientGuard locale={locale}>
      <MyBookings locale={locale} />
    </ClientGuard>
  );
}
