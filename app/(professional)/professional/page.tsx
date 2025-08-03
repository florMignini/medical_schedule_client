
"use client";
import { useEffect, useState, useCallback } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";
import { SelectedDateProvider } from "../../context/SeletedDateContext";
import { ProfessionalInformation } from "@/interfaces";

interface Props {
  children: React.ReactNode;
  professional: ProfessionalInformation;
  appointments: any[];
  patients: any[];
  institutions: any[];
  isDemo: boolean;
}

export default function ProfessionalDashboard({
  children,
  professional,
  appointments,
  patients,
  institutions,
  isDemo,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<"desktop" | "mobile">("mobile");

  const toggleSidebar = useCallback((value: boolean) => {
    setIsOpen(value);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
        setVariant("desktop");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SelectedDateProvider>
      <section className="flex min-h-screen bg-[#111111]">
        <div className="hidden lg:block w-52">
          <ProfessionalSidebar setIsOpen={setIsOpen} isOpen={true} variant="desktop" />
        </div>

        <div className="lg:hidden">
          <ProfessionalSidebar isOpen={isOpen} setIsOpen={setIsOpen} variant="mobile" />
        </div>

        <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
          <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
          <div className="p-4">
            {isDemo && (
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded shadow mb-4">
                Estás navegando en modo demo. Los cambios no son persistentes.
              </div>
            )}
            {children}
          </div>
        </main>
      </section>
    </SelectedDateProvider>
  );
}
