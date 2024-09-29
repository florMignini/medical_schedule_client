"use client"
import { apiServer } from "@/api/api-server";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const [profId, setProfId] = useState();
useEffect(() => {
  const professionalId = JSON.parse(localStorage.getItem("infoProfSession")!);
  setProfId(professionalId.id);
}, []);


export const useProfessionalInfo = () => {
 
  const professionalInfoQuery = useQuery({
    queryKey: ["professional-info"],
    queryFn: async () => {
      try {
        const { data } = await apiServer.get(
          `/professional/get-professional/${profId}`
        );
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  return {
    professionalInfoQuery,
  };
};
