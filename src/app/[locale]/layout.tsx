import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import enMessages from "../../../messages/en.json";
import urMessages from "../../../messages/ur.json";

type Locale = (typeof routing.locales)[number];
type Messages = typeof enMessages;

export const metadata: Metadata = {
  title: "Karigaar",
  description: "Your multi-language platform",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function isLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

const messagesByLocale: Record<Locale, Messages> = {
  en: enMessages,
  ur: urMessages,
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = messagesByLocale[locale];
  const isUrdu = locale === "ur";

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className={isUrdu ? "urdu-font min-h-full flex flex-col" : "min-h-full flex flex-col"}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </div>
  );
}
