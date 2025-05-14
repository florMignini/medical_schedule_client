"use client";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/utils";
import { Input } from "@/components/ui/input";

import searchIcon from "../../../public/assets/icons/search.svg";
import { apiServer } from "@/api/api-server";

import Link from "next/link";
import Image from "next/image";
import { Patient } from "@/interfaces";
import { capitalizeWords } from "@/utils/normalizeInput";

const Search = ({ path }: any) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const value: string = useDebounce(query);
  const [result, setResult] = useState<any>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // search
  useEffect(() => {
    if (!value) return;

    setLoading(true);

    const fetchSearchData = async () => {
      try {
        const normalizedValue = capitalizeWords(value);
        console.log(normalizedValue)
        if (path !== "dashboard" && path !== "appointments") {
          const { data } = await apiServer.get(`https://medical-schedule-server.onrender.com/api/${path}/search?value=${normalizedValue}`);
          setResult(data);
        } else {
          const resPatient = await apiServer.get(`https://medical-schedule-server.onrender.com/api/patients/search?value=${normalizedValue}`);
          const resInstitution = await apiServer.get(`https://medical-schedule-server.onrender.com/api/institutions/search?value=${normalizedValue}`);
          setResult((resInstitution.data as any[]).concat(resPatient.data as any[]));
        }
      } catch (err) {
        console.error("Error searching:", err);
        setResult([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchData();
  }, [value, path]);

  const clearInput = () => {
    setQuery("");
    setResult([]);
  };

  // Hide results if clicked outside the input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        //avoid close the search when click on the link
        setTimeout(() => {
          setIsFocused(false);
        }, 1000); 
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  return (
    <div className="relative w-[99%] h-auto flex flex-col items-center justify-center text-color">
      <div className="absolute w-[99%] h-20 flex flex-col items-center justify-center mx-auto">
        {/* search section */}
        <div className="w-[100%] grid grid-cols-[15%,85%] align-middle justify-center bg-white rounded-md px-2 shadow-md shadow-[#cccccc] border-[1px] border-[#cccccc]">
          <button className="w-[90%] gap-2 flex items-center justify-center">
            <Image src={searchIcon} alt="search-icon" width={15} height={15} />
            <div className="h-5 border-x-[1px] border-black/20" />
          </button>
          <Input
            ref={inputRef}
            type="text"
            placeholder={`buscar ${
              path === "institutions"
                ? "instituciones"
                : path === "patients"
                ? "pacientes"
                : "pacientes ó instituciones"
            }`}
            className="w-[95%] h-10 bg-transparent border-none focus:outline-none active:outline-none placeholder:text-color focus-visible:ring-offset-0"
            value={query}
            autoComplete="off"
            onChange={({ target }) => setQuery(target.value)}
            onFocus={() => setIsFocused(true)}
          />
        </div>

        {/* result section */}
        {value && isFocused && (
          <div className="w-[90%] absolute z-50 rounded-md py-5 px-2 top-[82px] gap-2 bg-backdrop backdrop-blur-[9px]">
            {loading ? (
              <p className="w-full text-center text-sm text-gray-500">Buscando...</p>
            ) : result && result.length > 0 ? (
              result.map((patient: Patient) => (
                <Link
                  key={patient.id}
                  href={`/professional/patients/${patient.id}/info`}
                  className="w-[99%] grid grid-cols-[50%,50%] align-middle justify-center my-2 px-1 py-2 hover:rounded-2xl hover:bg-gradient-to-b from-[#525252] to-[#979798] text-transparent hover:opacity-80 z-50"
                  onClick={clearInput}
                >
                  <div className="w-[100%] flex items-center justify-center">
                    <Image
                      src={patient.patientPhotoUrl}
                      alt="patient-photo"
                      width={50}
                      height={50}
                      className="rounded-full grid items-center justify-center"
                    />
                  </div>
                  <p className="text-black text-base flex items-center justify-start font-semibold">
                    {`${patient.firstName} ${patient.lastName}`}
                  </p>
                </Link>
              ))
            ) : (
              <p className="w-full text-center font-semibold">No se encontraron resultados</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
