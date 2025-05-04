import axios from "axios"
export const {
  NEXT_PUBLIC_BASE_URL: BASE_URL,
} = process.env;
export const apiServer = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
        // You can add other headers here like Authorization if needed
      }
})