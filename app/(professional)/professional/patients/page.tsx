"use client";

import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";
import { PatientsIncluded } from "@/interfaces";
import PatientCardWithActions from "./components/PatientCardWithAction";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

const ITEMS_PER_PAGE = 10;

const PatientsPage = () => {
  const {isDemo, patients} = useProfessionalIncludes();
  const [filtered, setFiltered] = useState<PatientsIncluded[]>([]);
  const [displayed, setDisplayed] = useState<PatientsIncluded[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
 

  useEffect(() => {
    const filteredData = patients.filter(({patient}) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
    setDisplayed(filteredData.slice(0, ITEMS_PER_PAGE));
    setPage(1);
  }, [search, patients]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newItems = filtered.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayed(newItems);
    setPage(nextPage);
  };

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
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <InfiniteScroll
        dataLength={displayed.length}
        next={loadMore}
        hasMore={displayed.length < filtered.length}
        loader={<p className="text-center text-sm text-gray-500 py-2">Cargando más pacientes...</p>}
      >
        <PatientCardWithActions patientsIncluded={displayed} isDemo={isDemo} />
      </InfiniteScroll>
    </section>
  );
};

export default PatientsPage;
