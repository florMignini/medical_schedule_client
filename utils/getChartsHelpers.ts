import { AppointmentsIncluded, Patient, PatientsIncluded } from "@/interfaces";
import dayjs from "dayjs";
const today = new Date()

export const filterTodayAppointments = (
  appointments: AppointmentsIncluded[] = []
): AppointmentsIncluded[] => {
  const today = new Date().toDateString();

  return appointments.filter((appointment) => {
    const scheduleDate = new Date(appointment.appointment.schedule).toDateString();
    return scheduleDate === today;
  });
};


// filter by age and gender fn
export function filtrarByAgeRange(data: PatientsIncluded[], beginAge: number, endAge: number, gender: string) {
  return data.filter(({patient} : PatientsIncluded) => 
      (today.getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365) >= beginAge && 
      (today.getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365) <= endAge && 
      patient.gender === gender
    );
  }