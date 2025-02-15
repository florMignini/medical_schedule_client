"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@/utils";
import { Input } from "@/components/ui/input";

import searchIcon from "../../../public/assets/icons/search.svg";
import { apiServer } from "@/api/api-server";

import Link from "next/link";
import Image from "next/image";

const Search = ({ path }: any) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const value: string = useDebounce(query);
  const [result, setResult] = useState<any>([]);

  //search
  useEffect(() => {
    if (path !== "dashboard") {
      setLoading(true);
      const fetchSearchData = async () => {
        const { data } = await apiServer.get(`/${path}/search?value=${value}`);
        setResult(data);
        setLoading(false);
      };
      fetchSearchData();
    } else {
      setLoading(true);
      const fetchFullSearchData = async () => {
        const resPatient = await apiServer.get(
          `/patients/search?value=${value}`
        );
        const resInstitution = await apiServer.get(
          `/institutions/search?value=${value}`
        );
        setResult(resInstitution.data.concat(resPatient.data));
        setLoading(false);
      };
      fetchFullSearchData();
    }
  }, [value, path]);

  const clearInput = () => {
    setQuery("");
    setResult([]);
  };

  return (
    <div className="relative w-[99%] h-auto flex flex-col items-center justify-center text-color">
      <div className="absolute w-[99%] h-20 flex flex-col items-center justify-center lg:justify-end mx-auto">
        {/* search section */}
        <div className="w-[100%] grid grid-cols-[15%,85%] align-middle justify-center bg-white rounded-md px-2 shadow-md shadow-[#cccccc] border-[1px] border-[#cccccc]">
          <button className="w-[90%] gap-2 flex items-center justify-center">
            <Image src={searchIcon} alt="search-icon" width={15} height={15} />
            <div className="h-5 border-x-[1px] border-black/20" />
          </button>
          <Input
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
          />
        </div>

        {/* result section */}
        <>
          {value && (
            <div className="w-[90%] absolute z-50 rounded-md py-5 px-2 top-[82px] gap-2 bg-backdrop backdrop-blur-[9px]">
              {result && result?.length > 0 ? (
                result?.map((patient: any) => (
                  <Link
                    key={patient.id}
                    href={`/professional/patients/${patient.id}/info`}
                    className=" w-[99%] grid grid-cols-[50%,50%] align-middle justify-center my-2 px-1 py-2 hover:rounded-2xl hover:bg-gradient-to-b from-[#525252] to-[#979798] text-transparent hover:opacity-80 z-50"
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
                <p className="w-[100%] flex items-center justify-center text-base font-bold text-">
                  {" "}
                  No se encontraron resultados
                </p>
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Search;
