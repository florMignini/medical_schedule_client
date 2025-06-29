
import { notFound } from "next/navigation";
import { InstitutionHeader } from "../components/InstitutionHeader";
import { InstitutionTabs } from "../components/InstitutionTabs";
import { getInstitutionById } from "@/app/actions";

interface Props {
  params: { id: string };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const institution = await getInstitutionById(params.id);
  if (!institution) return notFound();

  return (
    <section className="p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <span className="text-primary font-semibold">Instituciones</span>
        {" / "}
        <span>{institution.name}</span>
      </nav>

      <InstitutionHeader institution={institution} />
      <InstitutionTabs institutionId={params.id} />
    </section>
  );
}
