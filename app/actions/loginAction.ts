"use server";
import { apiServer } from "@/api/api-server";
import {
  forgotPasswordResponse,
  LoginUserResponse,
} from "@/interfaces/loginUserResponse";
import { cookies } from "next/headers";

interface IloginData {
  username: string;
  password: string;
}
interface IForgotPasswordData {
  email: string;
}
interface IResetForgotPassword {
  token: string;
  newPassword: string;
}

type ErrorType = {
  message: string;
  statusCode: number;
  error: string;
};

export async function loginUser(loginData: IloginData) {
  "use server";
  try {
    const { data } = await apiServer.post<LoginUserResponse>(
      `https://medical-schedule-server.onrender.com/api/auth/login`,
      loginData
    );
    cookies().set("session-token", data?.access_token, { secure: true });
    cookies().set("professional-id", data?.professional.id, { secure: true });
    return data.professional;
  } catch (error: any) {
    console.log(error.response.data.message);
    return error.response.data.message;
  }
}

export async function forgotPassword(forgotPasswordData: IForgotPasswordData) {
  "use server";
  try {
    const { data } = await apiServer.post<forgotPasswordResponse>(
      `https://medical-schedule-server.onrender.com/api/password-reset/request`,
      forgotPasswordData
    );

    return data.successResponse;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data.message;
  }
}

export async function resetPassword(resetForgotPassword: IResetForgotPassword) {
  "use server";
  try {
    const { data } = await apiServer.post<forgotPasswordResponse>(
      `https://medical-schedule-server.onrender.com/api/password-reset/confirm`,
      resetForgotPassword
    );
    return data.successResponse;
  } catch (error: any) {
    console.log(error.response.data);
    return error.response.data.message;
  }
}
