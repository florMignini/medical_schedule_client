"use client";

import { useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";
import PatientCardWithActions from "./components/PatientCardWithAction";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

const ITEMS_PER_PAGE = 10;

const PatientsPage = () => {
  const { isDemo, data } = useProfessionalIncludes();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Garantizamos que patientsIncluded siempre sea array y filtramos nulls
  const patientsIncluded = useMemo(
    () =>
      (data?.patientsIncluded || []).filter(
        (item) => item?.patient != null
      ),
    [data]
  );

  // Filtrado por búsqueda
  const filtered = useMemo(() => {
    return patientsIncluded.filter(
      ({ patient }) =>
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [patientsIncluded, search]);

  // Paginación
  const displayed = useMemo(() => {
    return filtered.slice(0, page * ITEMS_PER_PAGE);
  }, [filtered, page]);

  const loadMore = () => setPage((prev) => prev + 1);

  return (
    <section className="w-[99%] mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md min-h-screen">
      <header className="flex flex-col w-full h-14 items-start justify-center px-2 border-b border-gray-300">
        <h1 className="text-2xl text-black font-semibold">Pacientes</h1>
        <p className="hidden md:flex text-xs font-light text-gray-600">
          Aquí encontrará la lista de pacientes que se hallan en su cartera
        </p>
      </header>

      <Input
        placeholder="Buscar paciente..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reiniciar página cuando cambia la búsqueda
        }}
        className="max-w-sm"
      />

      <InfiniteScroll
        dataLength={displayed.length}
        next={loadMore}
        hasMore={displayed.length < filtered.length}
        loader={
          <p className="text-center text-sm text-gray-500 py-2">
            Cargando más pacientes...
          </p>
        }
      >
        <PatientCardWithActions
          showFloatingButton={true}
          isDemo={isDemo}
          // patientsIncluded={displayed} // <-- pasamos solo los pacientes filtrados y paginados
        />
      </InfiniteScroll>
    </section>
  );
};

export default PatientsPage;
