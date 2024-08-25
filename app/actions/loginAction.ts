"use server";

interface IloginData {
    username: string;
    password: string;
}
export async function loginUser(loginData:IloginData
) {
'use server'
  try {
    const res: any = await fetch(`http://localhost:3001/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const parsedRes = await res.json();
    console.log(parsedRes);
  } catch (error) {
    console.log(error);
  }
}
