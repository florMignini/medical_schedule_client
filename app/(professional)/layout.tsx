import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";
import Head from "../head";




const PlusFont = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-plus",
  display: "swap", // Ensure font is loaded asynchronously to avoid FOIT (Flash of Invisible Text)
});

export const metadata: Metadata = {
  title: "Medical Schedule App",
  description: "Patients and activities organizer for medical professionals",
};

export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body  className={cn(
          "max-h-screen overflow-x-hidden flex flex-col font-sans antialiased m-0 p-0",
          PlusFont.variable
        )}>
          <Head/>
          {children}
          <Toaster/>
        </body>
      </html>
    );
  }
