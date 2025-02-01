"use client";
import { useCallback, useEffect, useState } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";

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
    <section className="md:grid lg:grid-cols-[20%,80%]">
      {/*leftside*/}
      <ProfessionalSidebar
        /* toggleSidebar={toggleSidebar} */ isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      {/* rightside */}
      <div className="gap-3 flex-1 flex-col bg-gradient rounded-lg">
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
        {children}
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
