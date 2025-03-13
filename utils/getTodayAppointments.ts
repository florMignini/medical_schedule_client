export const getTodayAppointments = (appointments:any) => {
const todayAppointments = appointments.filter((appointment:any) => {
    const appointmentDate = new Date(appointment.appointment.schedule);
    const today = new Date();
    return (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
    );
});
return todayAppointments;
}