"use client";
import { useState, useEffect, useCallback } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";
import { SelectedDateProvider } from "../../context/SeletedDateContext";

const ProfessionalDashboard = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback((value: boolean) => {
    setIsOpen(value);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Ejecuta al montar
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SelectedDateProvider>
      <section className="flex max-h-screen overflow-hidden bg-gradient-to-br from-neutral-900 to-zinc-800 text-white">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block w-64">
          <ProfessionalSidebar 
          setIsOpen={setIsOpen}
          isOpen={true} variant="desktop" />
        </div>

        {/* Sidebar Mobile con Motion */}
        <div className="lg:hidden">
          <ProfessionalSidebar isOpen={isOpen} setIsOpen={setIsOpen} variant="mobile" />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex-col w-full overflow-y-auto">
          <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
          <div>{children}</div>
        </main>
      </section>
    </SelectedDateProvider>
  );
};

export default ProfessionalDashboard;
