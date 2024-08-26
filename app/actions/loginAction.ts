"use server";
import { LoginUserResponse } from '@/interfaces/loginUserResponse';
import { cookies } from 'next/headers'

interface IloginData {
    username: string;
    password: string;
}

export async function loginUser(loginData:IloginData
) {
'use server'
  try {
    const res = await fetch(`http://localhost:3001/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const parsedRes :LoginUserResponse = await res.json();
    cookies().set('session-cookie', parsedRes.accessToken, { secure: true })
    return parsedRes.professional;
  } catch (error) {
    console.log(error);
  }
}
