"use client";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/utils";
import { capitalizeWords } from "@/utils/normalizeInput";

import Image from "next/image";
import Link from "next/link";

import { Patient, ICreateInstitution } from "@/interfaces";

type SearchProps = {
  path: string;
  isDemo: boolean;
};

const Search = ({ path, isDemo }: SearchProps) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "patients" | "institutions">("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<(Patient | ICreateInstitution)[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedValue: string = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const API_BASE = isDemo
    ? "https://medical-schedule-server-demo.onrender.com/api"
    : "https://medical-schedule-server.onrender.com/api";

  useEffect(() => {
    if (!debouncedValue) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const value = capitalizeWords(debouncedValue);
        let data: any[] = [];

        if (filter === "patients") {
          const res = await fetch(`${API_BASE}/patients/search?value=${value}`);
          data = await res.json();
        } else if (filter === "institutions") {
          const res = await fetch(`${API_BASE}/institutions/search?value=${value}`);
          data = await res.json();
        } else {
          const [resPatients, resInstitutions] = await Promise.all([
            fetch(`${API_BASE}/patients/search?value=${value}`).then(r => r.json()),
            fetch(`${API_BASE}/institutions/search?value=${value}`).then(r => r.json()),
          ]);
          data = [...resPatients, ...resInstitutions];
        }

        setResults(data);
      } catch (err) {
        console.error("Error fetching search data:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedValue, filter, API_BASE]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setTimeout(() => setIsFocused(false), 300);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearInput = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto mt-1 px-1 bg-backdrop-blur-md rounded-lg shadow-lg p-1">
      {/* Input + Clear */}
      <div className="flex items-center border border-zinc-300 rounded-full bg-white shadow-sm px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-zinc-400">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={`Buscar ${
            path === "patients"
              ? "pacientes"
              : path === "institutions"
              ? "instituciones"
              : "pacientes o instituciones"
          }`}
          className="flex-1 bg-transparent border-none text-sm focus:outline-none"
        />
        {query && (
          <button
            onClick={clearInput}
            className="ml-2 text-zinc-400 hover:text-zinc-600 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      {isFocused && (
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          <button
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === "all" ? "bg-black text-white" : "bg-zinc-200 text-zinc-800"
            }`}
            onClick={() => setFilter("all")}
          >
            🔍 Todos
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === "patients" ? "bg-black text-white" : "bg-zinc-200 text-zinc-800"
            }`}
            onClick={() => setFilter("patients")}
          >
            🧑 Pacientes
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm transition ${
              filter === "institutions" ? "bg-black text-white" : "bg-zinc-200 text-zinc-800"
            }`}
            onClick={() => setFilter("institutions")}
          >
            🏥 Instituciones
          </button>
        </div>
      )}

      {/* Results */}
      {isFocused && query && (
        <div className="absolute w-full mt-2 z-50 max-h-72 overflow-y-auto bg-white border border-zinc-200 shadow-xl rounded-md animate-fadeIn scale-95 transition-transform duration-300">
          {loading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : results.length > 0 ? (
            results.map((item: any) => (
              <Link
                key={item.id}
                href={
                  "firstName" in item
                    ? `/professional/patients/${item.id}/info`
                    : `/professional/institutions/${item.id}`
                }
                onClick={clearInput}
                className="flex items-center gap-3 p-3 hover:bg-zinc-100 transition"
              >
                <Image
                  src={
                    "firstName" in item
                      ? item.patientPhotoUrl
                      : item.institutionImage || "/images/default-institution.jpg"
                  }
                  alt="foto"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-medium text-sm truncate">
                    {"firstName" in item
                      ? `${item.firstName} ${item.lastName}`
                      : item.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {"firstName" in item
                      ? item.email
                      : item.address || "Sin dirección"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-center p-4 text-zinc-500">
              No se encontraron resultados.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
