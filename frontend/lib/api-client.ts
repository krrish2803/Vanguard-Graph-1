import axios from "axios"

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("vg_auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("vg_auth_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default apiClient
