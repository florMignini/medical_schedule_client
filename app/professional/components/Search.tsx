"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@/utils";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import searchIcon from "../../../public/assets/icons/search.svg";
import { apiServer } from "@/api/api-server";
import { querySearch } from "@/app/actions";
import { Patient } from "@/interfaces";
import Link from "next/link";
import Image from "next/image";

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const value = useDebounce(query);
  const [result, setResult] = useState<any>([]);

  //search
  useEffect(() => {
    const loadQuery = async () => {
      const res: any = await apiServer.get(`/patients/search?value=${value}`);
      console.log(res);
      setResult(res);
    };
    loadQuery();
    setLoading(false);
  }, [value]);

  const clearInput = () => {
    setQuery("");
    setResult([]);
  };

  return (
    <div className="w-[99%] h-auto flex flex-col items-center justify-center mx-auto">
      {/* search section */}
      <div className="w-[80%] grid grid-cols-[20%,80%] align-middle justify-center bg-dark-200/80 rounded-lg ">
        <button className="w-[90%] flex items-center justify-center">
          <Icon src={searchIcon} alt="search-icon" width={20} height={20} />
        </button>
        <Input
          type="text"
          placeholder="Buscar Paciente"
          className="w-[90%] h-10 bg-transparent border-none focus:outline-none active:outline-none capitalize"
          value={query}
          autoComplete="off"
          onChange={({ target }) => setQuery(target.value)}
        />
      </div>
      {/* result section */}
      <>
        {value && (
          <div className="w-[80%] mt-1 rounded-md py-5 px-2 z-50 gap-2 bg-backdrop backdrop-blur-xl">
            {result && result?.data?.length > 0 ? (
              result?.data.map((patient: Patient) => (
                <Link
                  key={patient.id}
                  href={`/professional/patients/${patient.id}/info`}
                  className="w-[99%] grid grid-cols-[50%,50%] align-middle justify-center my-2 bg-opacity-55"
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
              <p className="w-[100%] flex items-center justify-center text-base font-bold text-white">
                {" "}
                No se encontraron resultados
              </p>
            )}
          </div>
        )}
      </>
    </div>
  );
};

export default Search;
