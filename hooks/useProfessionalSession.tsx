"use client";

import { useEffect, useState } from "react";
import { AppointmentsIncluded, PatientsIncluded, ProfessionalInformation } from "@/interfaces";
import Cookies from "js-cookie";
import { getProfessionalIncludesFromCookies } from "@/utils/getProfessionalIncludesFromCookies";
import { useProfessionalIncludes } from "./useProfessionalIncludes";

export function useProfessionalSession() {
  const [professional, setProfessional] = useState<ProfessionalInformation | null>(null);
  const [appointments, setAppointments] = useState<AppointmentsIncluded[]>([]);
  const [patients, setPatients] = useState<PatientsIncluded[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
const {data, refetch} = useProfessionalIncludes();
  
  return {
    professional,
    appointments,
    patients,
    isDemo,
    isLoading,
    refetch,
  };
}
