import { AppointmentsIncluded } from "@/interfaces";
import dayjs from "dayjs";
const today = new Date()

export const filterTodayAppointments = (appointments: 
AppointmentsIncluded[] | null | undefined) => {
  
    const today = new Date().toDateString();

    const result = appointments?.filter((appointment) => {
      const scheduleDate = new Date(appointment.appointment.schedule).toDateString();
      return scheduleDate === today;
    });
  
    return result;
  
};

// filter by age and gender fn
export function filtrarByAgeRange(data: any, beginAge: number, endAge: number, gender: string) {
  return data.filter(({patient} : any) => 
      (today.getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365) >= beginAge && 
      (today.getTime() - new Date(patient.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365) <= endAge && 
      patient.gender === gender
    );
  }