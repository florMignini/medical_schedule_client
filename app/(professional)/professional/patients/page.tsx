import { apiServer } from "@/api/api-server";
import { cookies } from "next/headers";
import { PatientsIncluded, ProfessionalInformation } from "@/interfaces";

import { Dialog } from "@/components/ui/dialog";

import PatientsTable from "../components/PatientsTable";

const PatientsPage = async () => {
  const cookieStore = cookies();
  const professionalId = cookieStore.get("professional-id")?.value;

  let { data }: { data: ProfessionalInformation } = await apiServer.get(
    `/professional/get-professional/${professionalId}`
  );
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
