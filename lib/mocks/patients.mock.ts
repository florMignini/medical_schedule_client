import { Patient } from "@/interfaces";

export const demoPatients: Partial<Patient>[] = [
  {
    id: "p1",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@mail.com",
    isActive: true,
  },
  {
    id: "p2",
    firstName: "María",
    lastName: "López",
    email: "maria@mail.com",
    isActive: false,
  },
  {
    id: "p3",
    firstName: "Carlos",
    lastName: "Díaz",
    email: "carlos@mail.com",
    isActive: true,
  },
  {
    id: "p4",
    firstName: "Lucía",
    lastName: "Fernández",
    email: "lucia@mail.com",
    isActive: true,
  },
];
