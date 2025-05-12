import { Appointment, AppointmentsIncluded } from "@/interfaces";

export const getTodayAppointments = (appointments: AppointmentsIncluded[], scheduleDate: Date) => {
const todayAppointments = appointments.filter((appointment) => {
   if(scheduleDate !== null){
    const appointmentDate = new Date(appointment.appointment.schedule);
    const today = new Date();
    return (
    appointmentDate.getDate() === scheduleDate.getDate() &&
    appointmentDate.getMonth() === scheduleDate.getMonth() &&
    appointmentDate.getFullYear() === scheduleDate.getFullYear()
    );
   }
});
return todayAppointments;
}