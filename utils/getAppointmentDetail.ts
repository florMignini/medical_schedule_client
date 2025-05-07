//-----------------------------------------

import { apiServer } from "@/api/api-server";
import { Patient } from "@/interfaces";
interface appointmentResult {
  cancellationReason: string | null;
  createdAt: string;
  id: string;
  notes: string;
  patientsIncluded: Patient[];
  reason: string;
  schedule: string;
  medicalInstitutionId: string | null;
  updatedAt: string;
}
// get appointment detail action
export const getAppointmentDetail = async (
  appointmentId: string
): Promise<appointmentResult | undefined> => {
  try {
    const { data } = await apiServer(
      `https://medical-schedule-server.onrender.com/api/appointment/get-appointment/${appointmentId}`
    );
    return data;
  } catch (error) {
    console.error(error);
  }
};
