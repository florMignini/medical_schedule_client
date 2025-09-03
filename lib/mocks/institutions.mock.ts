import { Patient } from "@/interfaces";

export const demoInstitution = {
  id: "demo-1",
  name: "Clínica Médica Central",
  address: "Av. Siempre Viva 123",
  phone: "+54 11 1234-5678",
  email: "contacto@clinicademo.com",
website: "www.clinicademo.com",
  institutionImage: "https://cloud.appwrite.io/v1/storage/buckets/675c02f60020743a2297/files/68af4832000e8e5a63fd/view?project=66cb8cbf003b8c7fc69f",
  patients: [
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
  ] as Partial<Patient>[],
  offices: [
    { id: "o1", name: "Consultorio 101", floor: "1° piso", specialty: "Clínica Médica" },
    { id: "o2", name: "Consultorio 202", floor: "2° piso", specialty: "Pediatría" },
    { id: "o3", name: "Consultorio 303", floor: "3° piso", specialty: "Cardiología" },
  ],
};
