import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import '../globals.css'
import { cn } from "@/lib/utils";

const PlusFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "Medical Schedule personal profile ",
  description: "personal dashboard and patient access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', PlusFont.variable)}>{children}</body>
    </html>
  );
}
