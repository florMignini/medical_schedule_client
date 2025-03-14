import { useState } from "react";

export default function useSelectedDate() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return { selectedDate, setSelectedDate };
}