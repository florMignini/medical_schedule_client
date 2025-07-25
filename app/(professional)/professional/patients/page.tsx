import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import { PatientsIncluded, ProfessionalInformation } from "@/interfaces";

import { Dialog } from "@/components/ui/dialog";

import PatientsTable from "../components/PatientsTable";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";

const PatientsPage = async () => {
  const {data} = await getProfessionalIncludesFromCookies();
  // @ts-ignore
  const { patientsIncluded }: { patientsIncluded: PatientsIncluded[] } = data;

  return (
    <section className="w-[99%] p-6 mx-auto h-screen flex flex-col items-center justify-start gap-2 text-color bg-white rounded-lg shadow-md">
      <Dialog>
        <div className="w-full px-1">
        <PatientsTable patients={patientsIncluded} component={"patients"} />
        </div>
      </Dialog>
    </section>
  );
};

export default PatientsPage;
