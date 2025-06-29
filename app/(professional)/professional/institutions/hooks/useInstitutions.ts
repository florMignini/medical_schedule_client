import useSWR from "swr";

import { ICreateInstitution } from "@/interfaces";
import { apiServer } from "@/api/api-server";

const fetcher = (url: string) => apiServer.get(url).then((res) => res.data);

export function useInstitutions(search?: string) {
  const query = search ? `?search=${search}` : "";
  const { data, isLoading, mutate } = useSWR(
    `/institutions${query}`,
    fetcher
  );

  return { data: data as ICreateInstitution[], isLoading, mutate };
}
