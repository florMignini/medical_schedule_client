"use client"
import { Patient } from "@/interfaces";
import { useEffect, useState } from "react";


const PastAppointments = (patientInfo: Patient) => {
const [profInfo, setProfInfo] = useState<string | null>(null)
  useEffect(() => {
   const proffessionalInfo = JSON.parse(localStorage.getItem("infoProfSession")!)
   if (proffessionalInfo) {
    setProfInfo(proffessionalInfo);
   }
  }, [])
  
  // console.log(patientInfo)
  // console.log(profInfo)
  return (
    <section className="w-full h-auto flex flex-col items-center justify-start gap-3">
      <div className="w-[95%] h-auto flex flex-col items-start justify-start bg-dark-400 px-2 py-3 rounded-md">
        {/* title general */}
        <div className="flex items-center justify-start gap-2">
          <div className="h-5 border-x-2 border-white" />
          <h1>Citas Anteriores</h1>
        </div>
        {/* past appointments cards section */}
        <div className="w-[100%] flex items-center justify-start flex-wrap gap-12 pt-5">
          {/* past appointment card */}
          <div className="w-[200px] h-[100px] bg-dark-400/50 rounded-md px-4 py-3 flex flex-col items-center justify-center gap-2 text-dark-600 shadow-md shadow-dark-600 hover:scale-[1.01] hover:ease-in-out hover:transition-shadow">
            <h3 className="text-sm">15 de Octubre, 2022</h3>
            <h4 className="text-sm">10:00 AM</h4>
            <h5 className="text-sm">Doctor Juan Perez</h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastAppointments;
