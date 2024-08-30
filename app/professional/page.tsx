"use client";
import { useState } from "react";
import ProfessionalSidebar from "@/components/ProfessionalSidebar";
import Navbar from "./components/Navbar";

const ProfessionalDashboard = () => {

  // mobile side menu state & handler
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <section className="grid grid-rows-[40%,60%] text-white">
      {/* top - navbar */}
      <Navbar 
      toggleSidebar={toggleSidebar}
      isOpen={isOpen}
      />
      {/* bottom - sidebar & main */}
      <div className="flex-1 lg:grid lg:grid-cols-[20%,80%]">
        {/* leftside */}
        <div>
          <ProfessionalSidebar 
          isOpen={isOpen}
          />
        </div>
        {/* rightside */}

        <div className="grid grid-col-[50%,50%] py-5">
          {/* information side */}
          <div className="flex flex-col gap-4">
            {/* patient section */}
            <div className="w-[95%] bg-dark-400 rounded-md">
              <p className="p-3 font-bold">Pacientes</p>
            </div>

            {/* institutions section */}
            <div className="w-[95%] bg-dark-400 rounded-md">
              <p className="p-3 font-bold">Instituciones</p>
            </div>
          </div>
          {/* profile side */}
          <div className="w-full hidden lg:flex p-1 bg-dark-400 rounded-md">
            <div className="w-[99%] h-10 flex items-center justif rounded-lg bg-dark-300">
              <h1 className="text-18-bold text-left pl-1">Mi Perfil</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDashboard;


