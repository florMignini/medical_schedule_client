import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import ProfessionalDashboard from "./page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PlusFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "Medical Schedule personal profile",
  description: "personal dashboard and professional access",
};

export default function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;
  if(!professionalId){
    redirect("/")
  }
  return (
    <section className="flex flex-col bg-dark-400 py-2">
      {/* content */}
      <div className="bg-dark-200 m-3 p-1 rounded-lg ">
        <ProfessionalDashboard
        children={children}
        />
      </div>
    </section>
  );
}
