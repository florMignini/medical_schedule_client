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
    <section className="grid grid-rows-[30%,70%] lg:grid-rows-[40%,60%] gap-5 text-white">
      {/* top - navbar */}
      <Navbar toggleSidebar={toggleSidebar} isOpen={isOpen} />
      {/* bottom - sidebar & main */}
      <div className="flex-1 lg:grid lg:grid-cols-[20%,80%]">
        {/* leftside */}
        <ProfessionalSidebar toggleSidebar={toggleSidebar} isOpen={isOpen} />

        {/* rightside */}
        <div className="">{children}</div>
      </div>
    </section>
  );
};

export default ProfessionalDashboard;
