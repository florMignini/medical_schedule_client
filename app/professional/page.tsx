"use client";
import { useCallback, useEffect, useState } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";
import { SelectedDateProvider } from "../context/SeletedDateContext";

const ProfessionalDashboard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // mobile side menu state & handler
  const [isOpen, setIsOpen] = useState(false);
  const [todayDate, setTodayDate] = useState<string>();
  const toggleSidebar = useCallback((value: boolean) => {
    setIsOpen(value);
  }, []);

  // //update to false in width < 768
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        toggleSidebar(false);
      }
    };

    //width event listener
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [toggleSidebar]);

  return (
    <SelectedDateProvider>
      <section className="md:grid p-3 bg-[#121133] lg:grid-cols-[20%,80%]">
      {/*leftside*/}
      <ProfessionalSidebar
        /* toggleSidebar={toggleSidebar} */ isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      {/* rightside */}
      <div className="gap-5 flex-1 flex-col bg-[#DFE0E0] rounded-lg">
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
        <div className="rounded-lg pt-3">{children}</div>
      </div>
    </section>
    </SelectedDateProvider>
  );
};

export default ProfessionalDashboard;
