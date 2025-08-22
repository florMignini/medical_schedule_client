
import { notFound } from "next/navigation";
import { InstitutionHeader } from "../components/InstitutionHeader";
import { InstitutionTabs } from "../components/InstitutionTabs";
import { getInstitutionById } from "@/app/actions";
import Link from "next/link";

interface Props {
  params: { institutionId: string };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const institution = await getInstitutionById(params.institutionId);
  if (!institution) return notFound();

  return (
    <section className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/institutions"
            className="text-blue-600 font-semibold hover:underline"
          >
            Instituciones
          </Link>
          <span>/</span>
          <span className="truncate">{institution.name}</span>
        </nav>

        <InstitutionHeader institution={institution} />
        <InstitutionTabs institutionId={params.institutionId} />
      </div>
    </section>
  );
}
