"use client";

import { useLocale } from "next-intl";

import ClientGuard from "@/src/components/site/ClientGuard";
import UserDashboard from "@/src/components/site/UserDashboard";

export default function DashboardPage() {
  const locale = useLocale();

  return (
    <ClientGuard locale={locale}>
      <UserDashboard locale={locale} />
    </ClientGuard>
  );
}
