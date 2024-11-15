"use client";
import { useEffect, useState } from "react";
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
  const toggleSidebar = () => setIsOpen(!isOpen);
  // //update to false in width < 768
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };

    //width event listener
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="flex flex-col md:grid lg:grid-cols-[20%,80%]">
        {/*leftside*/}
        <ProfessionalSidebar toggleSidebar={toggleSidebar} isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* rightside */}
        <div className="overflow-y-clip gap-3 flex-1 flex-col bg-white rounded-lg">
          <Navbar toggleSidebar={toggleSidebar} isOpen={isOpen} />
          {children}
        </div>

    </section>
  );
};

export default ProfessionalDashboard;
