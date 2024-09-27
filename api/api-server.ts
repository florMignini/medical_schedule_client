import axios from "axios"

export const apiServer = axios.create({
    baseURL: `http://localhost:3001/api`,
    headers: {
        'Content-Type': 'application/json',
        // You can add other headers here like Authorization if needed
      }
})