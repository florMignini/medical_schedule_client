import type { Metadata } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "./providers";


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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
    className="bg-[#222222] h-full"
    >
      <body
        className={cn(
          "h-full flex flex-col bg-[#222222] font-sans antialiased m-0 p-0 overflow-x-hidden",
          PlusFont.variable
        )}
      >
        {children}
        
      </body>
    </html>
  );
}
