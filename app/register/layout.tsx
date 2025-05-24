import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";



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

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return (
      <section className="w-full h-screen flex flex-col items-center justify-center">
        {children}
        <Toaster />
      </section>
    );
  }
  