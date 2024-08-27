import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";

const PlusFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "Medical Schedule personal profile ",
  description: "personal dashboard and patient access",
};

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-dark-400 grid grid-cols-[20%,80%] h-screen min-h-screen">
      {/* sidebar */}
     <ProfessionalSidebar/>
      {/* content */}
      <div className="bg-dark-200 m-3 p-1 rounded-r-lg">{children}</div>
    </section>
  );
}
