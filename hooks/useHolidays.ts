// hooks/useHolidays.ts
import axios from "axios";
import { useEffect, useState } from "react";

export type Holiday = {
  fecha: string; // formato: "2025-05-01"
  nombre: string;
  tipo: string;
};

export const useHolidays = () => {
  const [holidays, setHolidays] = useState<Holiday[]| string[]>([]);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const {data} = await axios.get<Holiday[]>(
          'https://api.argentinadatos.com/v1/feriados/2025'
        );
        setHolidays(data);
      } catch (error) {
        console.error("Error al obtener feriados:", error);
      }
    };

    fetchHolidays();
  }, []);

  return holidays;
};
