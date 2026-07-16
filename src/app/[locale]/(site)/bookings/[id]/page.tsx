"use client";

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import BookingDetail from "@/src/components/site/BookingDetail";
import ClientGuard from "@/src/components/site/ClientGuard";

export default function BookingDetailPage() {
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const orderId = Number(params.id);

  return (
    <ClientGuard locale={locale}>
      <BookingDetail locale={locale} orderId={orderId} />
    </ClientGuard>
  );
}
