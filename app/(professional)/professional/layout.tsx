import { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfessionalDashboard from "./page";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import LayoutLoading from "./components/LayoutLoading";

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

  const { showFloatingButton, data, appointments, institutions, patients } =
    await getProfessionalIncludesFromCookies();
  if (!professionalId || !data) {
    redirect("/introducing-medical-schedule");
  }

  return (
    <section className="flex flex-col">
      {/* content */}
      <Suspense fallback={<LayoutLoading />}>
        <ProfessionalDashboard
          professional={data}
          appointments={appointments}
          patients={patients}
          institutions={institutions}
          isDemo={isDemo}
          showFloatingButton={showFloatingButton}
        >
          {children}
        </ProfessionalDashboard>
      </Suspense>
    </section>
  );
}
