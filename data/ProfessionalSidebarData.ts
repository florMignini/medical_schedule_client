import person from "../public/assets/icons/users.svg"
import institute from "../public/assets/icons/institute.svg"
import calendar from "../public/assets/icons/calendar.svg"
export const ProfessionalSidebarData =  [
      {
        label: "Pacientes",
        icon: person,
        path: "/professional/patients",
      },
      {
        label: "Instituciones",
        icon: institute,
        path: "/professional/institutions",
      },
      {
        label: "Mis Citas",
        icon: calendar,
        path: "/professional/appointments",
      },
    ];