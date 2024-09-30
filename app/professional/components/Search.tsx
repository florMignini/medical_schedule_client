"use client";
import { useEffect, useState } from "react";
import { useDebounce } from "@/utils";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import searchIcon from "../../../public/assets/icons/search.svg";
import { apiServer } from "@/api/api-server";
import { querySearch } from "@/app/actions";

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const value = useDebounce(query);
  const [result, setResult] = useState([]);

  //search
  useEffect(() => {
   const loadQuery = async () => {
    const res:any = await apiServer.get(`/patients/search?value=${value}`);
    console.log(res);
    setResult(res)
   }
   loadQuery()
   setLoading(false)
  }, [value]);

  const clearInput = () => {
    setQuery("");
  };
  console.log(value);
  return (
    <div className="w-[99%] h-auto flex items-center justify-center mx-auto">
      <div className="w-[80%] grid grid-cols-[20%,80%] align-middle justify-center bg-dark-400 rounded-lg opacity-50">
        <button className="w-[90%] flex items-center justify-center">
          <Icon src={searchIcon} alt="search-icon" width={20} height={20} />
        </button>
        <Input
          type="text"
          placeholder="search anything"
          className="w-[90%] h-10 bg-transparent border-none focus:outline-none active:outline-none capitalize"
          value={query}
          autoComplete="off"
          onChange={({ target }) => setQuery(target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
