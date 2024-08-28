import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";

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
    <section className="bg-dark-400 grid grid-cols-[15%,85%] h-screen min-h-screen">
      {/* sidebar */}
      <ProfessionalSidebar />
      {/* content */}
      <div className="flex flex-col bg-dark-200 m-3 py-1 px-4 rounded-r-lg">
        <div className="my-3">
          <Navbar />
        </div>
        {children}
      </div>
    </section>
  );
}
