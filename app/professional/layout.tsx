import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import ProfessionalDashboard from "./page";

const PlusFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "Medical Schedule personal profile",
  description: "personal dashboard and patient access",
};

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col bg-dark-400">
      {/* content */}
      <div className=" bg-dark-200 m-3 py-1 px-4 rounded-lg h-screen min-h-screen">
        <ProfessionalDashboard
        children={children}
        />
      </div>
    </section>
  );
}
