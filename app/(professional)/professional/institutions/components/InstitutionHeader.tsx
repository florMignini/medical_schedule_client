import { ICreateInstitution } from "@/interfaces";
import Image from "next/image";

interface Props {
  institution: ICreateInstitution;
}

export function InstitutionHeader({ institution }: Props) {
  return (
    <div className="flex gap-6 items-center">
      {/* Contenedor limitado */}
      <div className="relative w-[200px] h-[150px] rounded-xl overflow-hidden shadow">
        <Image
          src={institution.institutionImage || "/fallback.jpg"}
          alt={institution.name || "Institution"}
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Info */}
      <div>
        <h2 className="text-2xl font-semibold">{institution.name}</h2>
        <p className="text-muted-foreground">{institution.address}</p>
        <p className="text-sm">
          {institution.email} · {institution.phone}
        </p>
        {institution.website && (
          <a
            href={institution.website}
            className="text-primary underline text-sm"
            target="_blank"
          >
            {institution.website}
          </a>
        )}
      </div>
    </div>
  );
}

