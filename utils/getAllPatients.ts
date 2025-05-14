import { apiServer } from "@/api/api-server";

export const getAllPatients = async () => {
  const { data } = await apiServer.get(`https://medical-schedule-server.onrender.com/api/patients/get-all-patients`);
  return data;
};

