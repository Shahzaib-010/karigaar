"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import BookingFlow from "@/src/components/site/BookingFlow";
import ClientGuard from "@/src/components/site/ClientGuard";

export default function BookPage() {
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const priceCategoryId = Number(params.id);

  return (
    <ClientGuard locale={locale}>
      <BookingFlow locale={locale} priceCategoryId={priceCategoryId} />
    </ClientGuard>
  );
}
