import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import InstitutionInfo from "../components/InstitutionInfo";



const InstitutionInfoPage = async ({
  params,
}: {
  params: { institutionId: string };
}) => {
  const cookieStore = cookies();
  const isDemo = cookieStore.get("isDemo")?.value === "true";
  const { institutions } = await getProfessionalIncludesFromCookies();

  const institutionFound = institutions.find(
    (item) => item.institution.id === params.institutionId
  );

  if (!institutionFound) return notFound();

  return (
    <InstitutionInfo />
  );
};

export default InstitutionInfoPage;
