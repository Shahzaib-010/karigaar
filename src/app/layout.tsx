import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
