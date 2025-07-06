import { apiServer } from "@/api/api-server";

// get institutions
export async function getInstitutions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/institutions`);
  if (!res.ok) throw new Error("Error al obtener instituciones");
  return res.json();
}
export interface deleteInstitutionsIDS {
  institutionId: string;
  professionalId: string | undefined;
}
// delete institution
export const deleteInstitution = async (ids: deleteInstitutionsIDS) => {
  try {
    const response = await apiServer.delete(
      `https://medical-schedule-server.onrender.com/api/institutions/${ids.institutionId}/${ids.professionalId}`
    );
  } catch (error) {
    console.error("Error al eliminar institución:", error);
    throw new Error("No se pudo eliminar la institución");
  }
};
