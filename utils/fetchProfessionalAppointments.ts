// apiHelpers.ts (o donde prefieras)
import { apiServer } from "@/api/api-server";

export async function fetchProfessionalAppointments(professionalId: string) {
  const response = await apiServer.get(`/professional/get-professional/${professionalId}`);
  const data = response?.data ?? {} as any;

  const appointmentsIncluded = data.appointmentsIncluded ?? [];
  const patientsIncluded = data.patientsIncluded ?? [];

  return { appointmentsIncluded, patientsIncluded };
}
