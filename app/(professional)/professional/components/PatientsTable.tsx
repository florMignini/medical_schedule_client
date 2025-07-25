"use client";
import React, { useState } from "react";
import ConfigButton from "./ConfigButton";
import Mail from "./icons/Mail";
import Phone from "./icons/Phone";
import Image from "next/image";
import Link from "next/link";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Plus from "./icons/Plus";
import { PatientsIncluded } from "@/interfaces";
import { useActivefilter } from "@/utils/useActiveFilter";
import { ScrollArea } from "@/components/ui/scroll-area";
import PatientRegistrationForm from "@/components/forms/PatientRegisterForm";
import User from "./icons/User";

const PatientsTable = ({ patients, component }: any) => {
  const activePatients = useActivefilter(patients);

  return (
    <>
      {component && component === "dashboard" ? (
        <Table activePatients={activePatients} />
      ) : (
        <>
          {/* Title */}
          <div className="flex flex-col w-[100%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
            <h1 className="text-2xl text-black font-semibold text-start">
              Pacientes
            </h1>
            <p className="hidden md:flex text-xs font-light text-gray-600">
              Aquí encontrara la lista de pacientes que se hallan en su cartera
            </p>
          </div>
          {/* top section */}
          <div className="w-[90%] flex items-center justify-between my-5">
            {/* leftside */}
            <div className="w-[50%] flex items-center justify-start gap-2">
              <User height={25} width={25} />
              <div className="flex flex-col items-start justify-center">
                <p className="text-xs font-light text-gray-600">
                  Actualmente posee:{" "}
                </p>
                <div className="text-[14px] font-semibold md:text-18-bold flex items-center justify-start gap-1 ">
                  <h1 className="">{activePatients.length}</h1>
                  <p className="">
                    {activePatients.length < 2 ? `paciente` : `pacientes`}
                  </p>
                </div>
              </div>
            </div>
            {/* rightside */}
            <div className="w-[50%] flex items-center justify-end">
              <DialogTrigger asChild>
                <button className="transition duration-200 ease-in-out flex items-center justify-center gap-2.5 p-1 border-[1px] border-gray-600 rounded-md bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:bg-gradient-to-b hover:from-white hover:to-[#222222] hover:text-[#1c1c1c]">
                  <p className="text-[12px] md:text-[14px] font-medium">
                    Agregar Paciente
                  </p>
                  <Plus width={15} height={15} />
                </button>
              </DialogTrigger>
            </div>
          </div>
          {/* add patient modal */}
          <DialogContent className="w-[90%] max-w-none lg:w-[70%] lg:max-w-[60%] h-[90%] bg-white flex flex-col items-start justify-start  bg-opacity-90 p-2 rounded-lg shadow-md gap-5">
            <ScrollArea className="h-[98%] w-[99%]">
              <PatientRegistrationForm />
            </ScrollArea>
          </DialogContent>
          {/* patients table */}
          <Table activePatients={activePatients} />
        </>
      )}
    </>
  );
};

export default PatientsTable;

export const Table = ({ activePatients }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 20;
  const totalPages = Math.ceil(activePatients.length / patientsPerPage);
  
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = activePatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full border-[1px] rounded-lg shadow-md transition-shadow shadow-gray-400 border-gray-400 flex flex-col mt-2">
      <div className="mx-auto mb-1 w-[99%] ">
        <p className="px-3 py-2 font-semibold text-[18px] text-gray-900">Pacientes</p>
      </div>
      {/* patients table */}
      <div className="w-[100%] p-1 flex flex-col items-center">
        {activePatients && activePatients?.length! < 1 ? (
          <div className="w-[90%] flex items-center justify-center gap-10">
            <p>Aún no posee pacientes activos</p>
            <DialogTrigger asChild>
              <button className="transition duration-200 ease-in-out flex items-center justify-center gap-2.5 p-1 border-[1px] border-gray-600 rounded-md bg-gradient-to-b from-black to-[#807f7f] text-white text-center hover:bg-gradient-to-b hover:from-white hover:to-[#222222] hover:text-[#1c1c1c]">
                <p className="text-[12px] md:text-[14px] font-medium">
                  agregar
                </p>
                <Plus width={15} height={15} />
              </button>
            </DialogTrigger>
          </div>
        ) : (
          <>
            {/*header*/}
            <div className="w-[99%] px-3 flex items-center justify-between border-b-[1px] mb-1 text-xs lg:text-sm text-start font-semibold border-b-gray-900 text-gray-500 ">
              <p className="w-[25%] max-[690px]:w-[50%] h-5 truncate">
                Nombre Completo
              </p>
              <p className="w-[25%] max-[690px]:w-[50%] h-5 truncate">
                Teléfono
              </p>
              <p className="w-[25%] h-5 max-[690px]:hidden truncate">
                Mail
              </p>
              <p className="w-[25%] h-5 max-[690px]:hidden truncate">
                Dirección
              </p>
            </div>
            <div className="w-full px-1 gap-2">
              {currentPatients.map(({ patient }: PatientsIncluded) => (
                <div
                  className="w-[100%] flex items-center gap-1 justify-center"
                  key={patient.id}
                >
                  <Link
                    href={`/professional/patients/${patient.id}/info`}
                    className="w-[85%] md:w-[98%] mx-auto px-2 flex items-center justify-between hover:transition-shadow rounded-md mb-1 hover:shadow-md hover:shadow-gray-400 hover:border-[1px] hover:border-gray-300 text-gray-600"
                  >
                    <div
                      key={patient.identityNumber}
                      className="w-[25%] max-[690px]:w-[50%] px-1 py-2"
                    >
                      <div className="flex gap-1 items-center justify-start">
                        <Image
                          src={patient.patientPhotoUrl}
                          alt="patient-profile-photo"
                          width={40}
                          height={40}
                          className="rounded-full bg-gradient-to-b from-black to-[#001E80]"
                        />
                        <p className="text-[14px] font-semibold truncate">
                          {`${patient.firstName} ${patient.lastName}`}
                        </p>
                      </div>
                    </div>
                    <div
                      className="w-[25%] max-[690px]:w-[50%] px-1 py-2"
                      key={patient.phone}
                    >
                      <div className="text-[14px] font-normal flex gap-1">
                        <Phone width={20} height={20} />
                        <p className="truncate">{patient.phone}</p>
                      </div>
                    </div>
                    <div
                      className="max-[690px]:hidden w-[25%] px-1 py-2"
                      key={patient.email}
                    >
                      <div className="text-[14px] font-normal flex gap-1">
                        <Mail width={20} height={20} />
                        <p className="truncate">{patient.email}</p>
                      </div>
                    </div>
                    <div
                      className="max-[690px]:hidden w-[25%] px-1 py-2"
                      key={patient.address}
                    >
                      <div className="text-[14px] font-normal">
                        {patient.address}
                      </div>
                    </div>
                  </Link>
                  <div className="w-[15%] md:w-[10%] flex items-center justify-center">
                    <ConfigButton id={patient.id} component={"patients"} />
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="w-full flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Anterior
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md border ${
                        currentPage === page
                          ? "bg-gray-900 text-white"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
