import { SelectedDateContext } from "@/app/context/SeletedDateContext";
import { useContext } from "react";


export function useSelectedDate() {
  const context = useContext(SelectedDateContext);
  if (!context) {
    throw new Error("useSelectedDate must be used within a SelectedDateProvider");
  }
  return context;
}