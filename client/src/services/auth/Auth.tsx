import type { LoginInterface, RegsiterInterface } from "@/types/Auth"
import { axiosInstance } from "@/utils/axios.util"

export const authApi = {
  Register: async (formData: RegsiterInterface) => {
    return await axiosInstance.post('auth/register', formData)
  },
  Login: async (formData: LoginInterface) => {
    return await axiosInstance.post('auth/login', formData)
  },
  
}