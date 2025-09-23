import type { RegsiterInterface } from "@/types/Auth"
import { axiosInstance } from "@/utils/axios.util"

export const authApi = {
  Register: async (formData: RegsiterInterface) => {
    return await axiosInstance.post('auth/register', formData)
  },
  
}