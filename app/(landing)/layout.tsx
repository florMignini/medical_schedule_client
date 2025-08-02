import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";

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


export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
          className={cn(
            "h-screen flex flex-col bg-[#F2F3F0] font-sans antialiased m-0 p-0 overflow-x-hidden",
            PlusFont.variable
          )}
        >
          {children}
        </div>
    );
  }
  