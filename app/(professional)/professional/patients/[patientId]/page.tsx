import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import PatientInfo from "./info/page";

const PatientInfoPage = async ({ params }: { params: { patientId: string } }) => {
  const cookieStore = cookies();
  const isDemo = cookieStore.get("isDemo")?.value === "true";
  const { data } = await getProfessionalIncludesFromCookies();

  const patientsIncluded = data?.patientsIncluded || [];

  const patientFound = patientsIncluded.find(
    (item) => item.patient.id === params.patientId
  );

  if (!patientFound) return notFound();

  return (
    <PatientInfo
      patient={patientFound.patient}
      isDemo={isDemo}
    />
  );
};

export default PatientInfoPage;
