import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import InstitutionsPage from "../page";


const InstitutionInfoPage = async ({
  params,
}: {
  params: { institutionId: string };
}) => {
  const cookieStore = cookies();
  const isDemo = cookieStore.get("isDemo")?.value === "true";
  const { institutions } = await getProfessionalIncludesFromCookies();

  const patientFound = institutions.find(
    (item) => item.institution.id === params.institutionId
  );

  if (!patientFound) return notFound();

  return <InstitutionsPage isDemo={isDemo} />;
};

export default InstitutionInfoPage;
