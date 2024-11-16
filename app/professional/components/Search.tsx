"use client";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/utils";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import searchIcon from "../../../public/assets/icons/search.svg";
import { apiServer } from "@/api/api-server";
import { Patient } from "@/interfaces";
import Link from "next/link";
import Image from "next/image";

const Search = ({ path }: any) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const value:string = useDebounce(query);
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
  }, [value]);

  const clearInput = () => {
    setQuery("");
    setResult([]);
  };

  return (
    <div className="relative w-[99%] h-auto flex flex-col items-center justify-center">
      <div className="absolute w-[99%] h-20 flex flex-col items-center justify-center lg:justify-end mx-auto">
        {/* search section */}
        <div className="w-[100%] grid grid-cols-[15%,85%] align-middle justify-center bg-transparent rounded-2xl px-2 shadow-[inset_2px_-4px_10px_rgba(85,82,172,0.2)]">
          <button className="w-[90%] flex items-center justify-center">
            <Image src={searchIcon} alt="search-icon" width={15} height={15} />
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
            className="w-[95%] h-10 bg-transparent border-none focus:outline-none active:outline-none"
            value={query}
            autoComplete="off"
            onChange={({ target }) => setQuery(target.value)}
          />
        </div>

 {/* result section */}
 <>
        {value && (
          <div className="absolute w-[90%] rounded-md py-5 px-2 z-40 top-[82px] gap-2 bg-backdrop backdrop-blur-[9px]">
            {result && result?.length > 0 ? (
              result?.map((patient: any) => (
                <Link
                  key={patient.id}
                  href={`/professional/patients/${patient.id}/info`}
                  className=" w-[99%] grid grid-cols-[50%,50%] align-middle justify-center my-2 px-1 py-2 hover:rounded-2xl hover:bg-gradient-to-b from-black to-[#545455] text-transparent hover:opacity-80 z-50"
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
                  <p className="text-[#bdbfb7] text-base flex items-center justify-start font-semibold">
                    {`${patient.firstName} ${patient.lastName}`}
                  </p>
                </Link>
              ))
            ) : (
              <p className="w-[100%] flex items-center justify-center text-base font-bold text-[#5653AF]">
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
