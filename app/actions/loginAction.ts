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
    const {data} = await apiServer.post(`/auth/login`, loginData);
    
    cookies().set('session-cookie', data?.accessToken, { secure: true })
    console.log(data)
    return data.professional;
  } catch (error) {
    const typedError: ErrorType = error as ErrorType;
    console.log(typedError);
  }
}
