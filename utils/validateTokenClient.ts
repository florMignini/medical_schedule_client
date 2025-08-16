import axios from "axios";


export const validateTokenClient = async (token: string) => {
  try {
    const response = await axios.get(`https://medical-schedule-server.onrender.com/auth/validate-token?token=${token}`);
    return response.data;
  } catch (error: any) {
    console.error("Error al validar token (cliente):", error.response?.data || error.message);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Error al validar token, intente nuevamente"
    };
  }
};
