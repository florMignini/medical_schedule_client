"use client";

import { CalendarPlus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onCreateAppointment: () => void;
  onAddFollowUp: () => void;
};

export default function PatientActionBar({
  onCreateAppointment,
  onAddFollowUp,
}: Props) {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5 items-center justify-center sm:justify-end pt-4">
      <Button
        onClick={onCreateAppointment}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <CalendarPlus className="mr-2 h-4 w-4" />
        Crear turno
      </Button>

      {/* <Button
        onClick={onAddFollowUp}
        variant="outline"
        className="w-full sm:w-auto border-emerald-600 text-emerald-700 hover:bg-emerald-50"
      >
        <Stethoscope className="mr-2 h-4 w-4" />
        Agregar seguimiento
      </Button> */}
    </div>
  );
}
