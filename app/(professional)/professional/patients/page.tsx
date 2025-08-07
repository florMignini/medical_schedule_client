
import { PatientsIncluded, ProfessionalInformation } from "@/interfaces";

import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import PatientCardWithActions from "./components/PatientCardWithAction";

const PatientsPage = async () => {
  const { data, isDemo } = await getProfessionalIncludesFromCookies();
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
      <PatientCardWithActions patientsIncluded={patientsIncluded}
              isDemo={isDemo!} />
    </section>
  );
};

export default PatientsPage;
