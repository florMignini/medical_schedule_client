import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import { PatientsIncluded, ProfessionalInformation } from "@/interfaces";

import { Dialog } from "@/components/ui/dialog";

import PatientsTable from "../components/PatientsTable";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";

const PatientsPage = async () => {
  const { data } = await getProfessionalIncludesFromCookies();
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  return (
    <section className="w-[99%] mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md h-screen">
      <header className="flex flex-col w-[100%] h-14 items-start justify-center px-2 border-b-[1px] border-b-gray-500">
        <h1 className="text-2xl text-black font-semibold text-start">
          Pacientes
        </h1>
        <p className="hidden md:flex text-xs font-light text-gray-600">
          Aquí encontrara la lista de pacientes que se hallan en su cartera
        </p>
      </header>
      <PatientsTable patients={patientsIncluded} component={"patients"} />
    </section>
  );
};

export default PatientsPage;
