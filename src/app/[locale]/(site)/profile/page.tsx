"use client";

import { useLocale } from "next-intl";

import ClientGuard from "@/src/components/site/ClientGuard";
import ProfileView from "@/src/components/site/ProfileView";

export default function ProfilePage() {
  const locale = useLocale();

  return (
    <ClientGuard locale={locale}>
      <ProfileView locale={locale} />
    </ClientGuard>
  );
}
