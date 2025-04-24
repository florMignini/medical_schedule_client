import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedDateContextProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

export const SelectedDateContext = createContext<SelectedDateContextProps | undefined>(undefined);

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
}


