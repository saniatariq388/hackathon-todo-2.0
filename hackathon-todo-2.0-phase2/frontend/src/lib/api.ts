// frontend\src\lib\api.ts
import axios from "axios"

const api = axios.create({
  // 👇 UPDATE: localhost ki jagah 127.0.0.1 use karein
  baseURL: "http://127.0.0.1:8000/api/v1", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api