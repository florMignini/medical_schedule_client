import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedDateContextProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const SelectedDateContext = createContext<SelectedDateContextProps | undefined>(undefined);

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
}


