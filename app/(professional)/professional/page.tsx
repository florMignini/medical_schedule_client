"use client";
import { useState, useEffect, useCallback } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";
import { SelectedDateProvider } from "../../context/SeletedDateContext";

const ProfessionalDashboard = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
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
    handleResize(); // Ejecuta al montar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SelectedDateProvider>
      <section className="flex min-h-screen bg-[#111111]">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block w-64">
          <ProfessionalSidebar
            setIsOpen={setIsOpen}
            isOpen={true}
            variant="desktop"
          />
        </div>

        {/* Sidebar Mobile con Motion */}
        <div className="lg:hidden">
          <ProfessionalSidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            variant="mobile"
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto max-h-screen">
          <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
          <div>{children}</div>
        </main>
      </section>
    </SelectedDateProvider>
  );
};

export default ProfessionalDashboard;
