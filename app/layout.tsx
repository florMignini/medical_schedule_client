import type { Metadata } from "next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Roboto } from "next/font/google";
import "./globals.css";
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
// Create a tanStank client
const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      // Provide the client to your App
      <QueryClientProvider client={queryClient}>
        <body
          className={cn(
            "h-auto bg-dark-300 font-sans antialiased",
            PlusFont.variable
          )}
        >
          {children}
        </body>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </html>
  );
}
