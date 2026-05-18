import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/sections/Navbar";
import enMessages from "../../../messages/en.json";
import urMessages from "../../../messages/ur.json";

type Locale = (typeof routing.locales)[number];
type Messages = typeof enMessages;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
