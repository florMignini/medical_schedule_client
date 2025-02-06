import { AppointmentsIncluded } from "@/interfaces";
import dayjs from "dayjs";

export const filterTodayAppointments = (appointments: AppointmentsIncluded[]) => {
    const today = new Date().toDateString();
    let result = appointments.filter((appointment) => {
        return new Date(appointment.appointment.schedule).toDateString() === today;
    });
    return result;
}
