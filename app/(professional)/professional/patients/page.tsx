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
    <section className="w-[99%] pt-5 mx-auto h-auto flex flex-col items-center justify-start gap-2 text-color bg-gradient-to-b from-white to-gray-100">
      <Dialog>
        <PatientsTable patients={patientsIncluded} component={"patients"} />
      </Dialog>
    </section>
  );
};

export default PatientsPage;
