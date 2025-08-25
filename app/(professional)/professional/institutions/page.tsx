"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";
import { InstitutionsIncluded } from "@/interfaces";
import InstitutionCardWithActions from "./components/InstitutionCardWithActions";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

const ITEMS_PER_PAGE = 8;

export default function InstitutionsPage({ isDemo }: { isDemo: boolean }) {
  const [filtered, setFiltered] = useState<InstitutionsIncluded[]>([]);
  const [displayed, setDisplayed] = useState<InstitutionsIncluded[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
const { institutions} = useProfessionalIncludes();

  useEffect(() => {
    const filteredData = institutions.filter(({institution}) =>
      institution.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredData);
    setDisplayed(filteredData.slice(0, ITEMS_PER_PAGE));
    setPage(1);
  }, [search, institutions]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newItems = filtered.slice(0, nextPage * ITEMS_PER_PAGE);
    setDisplayed(newItems);
    setPage(nextPage);
  };

  return (
    <section className="w-[99%] mx-auto p-6 space-y-4 bg-white rounded-lg shadow-md min-h-screen">
      <header className="flex flex-col w-full h-14 items-start justify-center px-2 border-b border-gray-300">
        <h1 className="text-2xl text-black font-semibold">Instituciones</h1>
        <p className="hidden md:flex text-xs font-light text-gray-600">
          Aquí encontrará la lista de instituciones que se hallan en su cartera
        </p>
      </header>

      <Input
        placeholder="Buscar institución..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <InfiniteScroll
        dataLength={displayed.length}
        next={loadMore}
        hasMore={displayed.length < filtered.length}
        loader={<p className="text-center text-sm text-gray-500 py-2">Cargando más instituciones...</p>}
      >
        <InstitutionCardWithActions 
        showFloatingButton={true}
        institutionsIncluded={displayed} isDemo={isDemo} />
      </InfiniteScroll>
    </section>
  );
}
