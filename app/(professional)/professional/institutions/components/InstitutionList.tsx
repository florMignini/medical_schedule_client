"use client";
import { useState } from "react";
import { useInstitutions } from "../hooks/useInstitutions";
import { InstitutionForm } from "./InstitutionForm";
import { ICreateInstitution } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/useDebounce";
import { useProfessionalInstitutions } from "@/hooks/useProfessionalInstitutions";


export function InstitutionList() {
  const [search, setSearch] = useState("");
  // const debouncedSearch = useDebounce(search);
  // const { data, mutate } = useInstitutions(debouncedSearch);
  const { institutions, isLoading, error, mutate } = useProfessionalInstitutions();
  console.log("Institutions data:", institutions);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Partial<ICreateInstitution> | null>(null);
  const router = useRouter();

  return (
    <div className="relative space-y-4">
      {/* 🔍 Search input */}
      <div className="flex gap-2 items-center max-w-md">
        <Search className="text-muted-foreground" />
        <Input
          placeholder="Buscar institución..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🔄 Loading */}
      {isLoading ? (
        <p className="p-4">Cargando instituciones...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutions?.map((inst:ICreateInstitution) => (
            <Card
              key={inst.id}
              className="relative group overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/institutions/${inst.id}`)}
            >
              <CardHeader className="bg-muted/50 p-0">
                <Image
                  src={inst.institutionImage || "/fallback.jpg"}
                  alt={inst.name || "Institution"}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <CardTitle>{inst.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{inst.address}</p>
                <p className="text-sm">{inst.email}</p>
                <p className="text-sm">{inst.phone}</p>
              </CardContent>

              <button
                className="absolute top-2 right-2 bg-background hover:bg-muted p-2 rounded-full shadow transition-all z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInstitution(inst);
                  setFormOpen(true);
                }}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* ➕ Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setSelectedInstitution(null);
            setFormOpen(true);
          }}
          className="rounded-full shadow-xl h-14 w-14 p-0 text-xl"
        >
          +
        </Button>
      </div>

      <InstitutionForm
        open={formOpen}
        setOpen={setFormOpen}
        initialData={selectedInstitution ?? undefined}
        onSuccess={() => {
          mutate();
          setFormOpen(false);
          setSelectedInstitution(null);
        }}
      />
    </div>
  );
}
