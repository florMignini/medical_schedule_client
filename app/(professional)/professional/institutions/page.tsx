"use client";

import { useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";
import InstitutionCardWithActions from "./components/InstitutionCardWithActions";
import { useProfessionalIncludes } from "@/hooks/useProfessionalIncludes";

const ITEMS_PER_PAGE = 8;

export default function InstitutionsPage() {
  const { institutions, isDemo } = useProfessionalIncludes();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return institutions.filter(({ institution }) =>
      institution.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [institutions, search]);

  const displayed = useMemo(() => {
    return filtered.slice(0, page * ITEMS_PER_PAGE);
  }, [filtered, page]);

  const loadMore = () => setPage((prev) => prev + 1);

  return (
    <section className="w-[99%] px-4 md:px-12 lg:px-24 mx-auto p-6 space-y-4 bg-white min-h-screen">
      <header className="flex flex-col w-full h-14 items-start justify-center px-2 border-b border-gray-300">
        <h1 className="text-2xl text-black font-semibold">Instituciones</h1>
        <p className="hidden md:flex text-xs font-light text-gray-600">
          Aquí encontrará la lista de instituciones que se hallan en su cartera
        </p>
      </header>

      <Input
        placeholder="Buscar institución..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // reinicia la paginación al cambiar la búsqueda
        }}
        className="max-w-sm"
      />

      <InfiniteScroll
        dataLength={displayed.length}
        next={loadMore}
        hasMore={displayed.length < filtered.length}
        loader={
          <p className="text-center text-sm text-gray-500 py-2">
            Cargando más instituciones...
          </p>
        }
      >
        <InstitutionCardWithActions
          showFloatingButton={true}
          isDemo={isDemo}
        />
      </InfiniteScroll>
    </section>
  );
}
