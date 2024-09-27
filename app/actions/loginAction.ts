"use server";
import { apiServer } from '@/api/api-server';
import { LoginUserResponse } from '@/interfaces/loginUserResponse';
import { cookies } from 'next/headers'

interface IloginData {
    username: string;
    password: string;
}
type ErrorType = {
  message:string;
  statusCode: number;
  error: string;
}

export async function loginUser(loginData:IloginData
) {
'use server'
  try {
    const res:LoginUserResponse = await apiServer.post(`/auth/login`, loginData);

    cookies().set('session-cookie', res.accessToken, { secure: true })
    return res.professional;
  } catch (error) {
    const typedError: ErrorType = error as ErrorType;
    console.log(typedError);
  }
}
