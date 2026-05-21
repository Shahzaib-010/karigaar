import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import { AuthProvider } from "@/context/AuthContext";
import { Open_Sans, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("h-full", "antialiased", openSans.variable, "font-sans", geist.variable)}>
      <body className="min-h-full">
        <TooltipProvider>
          <AuthProvider>
            <NextIntlClientProvider locale="en" messages={enMessages}>
              {children}
            </NextIntlClientProvider>
          </AuthProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
