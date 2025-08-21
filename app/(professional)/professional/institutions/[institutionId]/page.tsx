
import { notFound } from "next/navigation";
import { InstitutionHeader } from "../components/InstitutionHeader";
import { InstitutionTabs } from "../components/InstitutionTabs";
import { getInstitutionById } from "@/app/actions";

interface Props {
  params: { institutionId: string };
}

export default async function InstitutionDetailPage({ params }: Props) {

  const institution = await getInstitutionById(params.institutionId);
  if (!institution) return notFound();

  return (
    <section className="h-screen p-6 space-y-6 bg-white rounded-lg shadow-md">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <span className="text-primary font-semibold">Instituciones</span>
        {" / "}
        <span>{institution.name}</span>
      </nav>

      <InstitutionHeader institution={institution} />
      <InstitutionTabs institutionId={params.institutionId} />
    </section>
  );
}
