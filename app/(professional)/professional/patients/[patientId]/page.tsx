import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import PatientInfo from "./info/page";

const PatientInfoPage = async ({ params }: { params: { patientId: string } }) => {
  const cookieStore = cookies();
  const isDemo = cookieStore.get("isDemo")?.value === "true";
  const { patients } = await getProfessionalIncludesFromCookies();

  const patientFound = patients.find(
    (item) => item?.patient.id === params.patientId
  );

  if (!patientFound) return notFound();

  return (
    <PatientInfo
      isDemo={isDemo}
    />
  );
};

export default PatientInfoPage;
