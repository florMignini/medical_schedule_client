import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfessionalDashboard from "./page";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import Loading from "./components/Loading";

const PlusFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "Medical Schedule personal profile",
  description: "personal dashboard and professional access",
};

export default async function ProfessionalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;
  const isDemo = cookieStore.get("isDemo")?.value === "true";
  if(!professionalId){
    redirect("/introducing-medical-schedule")
  }
  const { data, appointments, institutions, patients } = await getProfessionalIncludesFromCookies();
  return (
    <section className="flex flex-col">
      {/* content */}     
       <Suspense fallback={<Loading />}>
       <ProfessionalDashboard
       professional={data}
       appointments={appointments}
       patients={patients}
       institutions={institutions}
       isDemo={isDemo}
       >
       {children}
       </ProfessionalDashboard>
       </Suspense>
    </section>
  );
}
