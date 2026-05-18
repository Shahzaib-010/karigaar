import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/sections/Navbar";
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
    <html
      lang={locale}
      dir={isUrdu ? "rtl" : "ltr"}
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
