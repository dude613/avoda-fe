import axios from "axios"
import { toast } from "react-hot-toast"

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error?.response && error.response.status === 401) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("userRole")

        toast.error("Your session has expired. Please sign in again.")
        window.location.href = "/login"
      }
      return Promise.reject(error)
    },
  )
}
