import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import { AuthProvider } from "@/context/AuthContext";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karigaar",
  description: "Your multi-language platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${openSans.variable}`}>
      <body className="min-h-full">
        <AuthProvider>
          <NextIntlClientProvider locale="en" messages={enMessages}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
