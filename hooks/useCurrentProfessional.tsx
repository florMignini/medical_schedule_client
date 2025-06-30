import { useState, useEffect } from "react";

export type ProfessionalType = {
  id: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
};

export function useCurrentProfessional() {
  const [professional, setProfessional] = useState<ProfessionalType | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("infoProfSession");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfessional(parsed);
      } else {
        setProfessional(null);
      }
    } catch (error) {
      console.error("Error parsing infoProfSession from localStorage", error);
      setProfessional(null);
    }
  }, []);

  return professional;
}
