import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karigaar",
  description: "Your multi-language platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
