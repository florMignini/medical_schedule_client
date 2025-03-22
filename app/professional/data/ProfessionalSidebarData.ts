import CalendarIcon from "../components/icons/CalendarIcon";
import Institution from "../components/icons/Institution"
import Users from "../components/icons/Users";


export const ProfessionalSidebarData =  [
      {
        label: "Pacientes",
        component: Users,
        path: "/professional/patients",
      },
      {
        label: "Instituciones",
        component: Institution,
        path: "/professional/institutions",
      },
      {
        label: "Mis Citas",
        component: CalendarIcon,
        path: "/professional/appointments",
      },
    ];