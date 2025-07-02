"use client";
import { useState } from "react";
import { useInstitutions } from "../hooks/useInstitutions";
import { InstitutionForm } from "./InstitutionForm";
import { ICreateInstitution, InstitutionsIncluded } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pencil, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "../hooks/useDebounce";
import { useProfessionalInstitutions } from "@/hooks/useProfessionalInstitutions";
import InstitutionRegisterForm from "@/components/forms/InstitutionRegisterForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";


export function InstitutionList() {
  const [search, setSearch] = useState("");
  // const debouncedSearch = useDebounce(search);
  // const { data, mutate } = useInstitutions(debouncedSearch);
  const { data,institutions, isLoading, error } = useProfessionalInstitutions();

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
          {institutions?.map(({institution}:InstitutionsIncluded) => (
            <Card
              key={institution.id}
              className="relative group overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/institutions/${institution.id}`)}
            >
              <CardHeader className="bg-muted/50 p-0">
                <Image
                  src={institution.institutionImage || "/fallback.jpg"}
                  alt={institution.name || "Institution"}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <CardTitle>{institution.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{institution.address}</p>
                <p className="text-sm">{institution.email}</p>
                <p className="text-sm">{institution.phone}</p>
              </CardContent>

              <button
                className="absolute top-2 right-2 bg-background hover:bg-muted p-2 rounded-full shadow transition-all z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedInstitution(institution);
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

      {/* Mostrar modal/dialog con el formulario solo si formOpen === true */}
      {formOpen && (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="bg-white/50 glass-effect-vibrant backdrop:blur-lg max-w-lg max-h-[90vh] overflow-auto p-6">
            <InstitutionRegisterForm
              selectedInstitution={selectedInstitution}
              onClose={() => setFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
