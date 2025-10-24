import { useQuery } from "@tanstack/react-query"
import { QueryKey } from "@/constants/query-key"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import type { UserInterface } from "@/types/Auth"
import { authApi } from "@/services/auth/Auth"

export const useGetAllUsers = () => {
  return useQuery<UserInterface[], AxiosError>({
    queryKey: [QueryKey.USER_LIST],
    queryFn: async () => {
      const res = await authApi.GetAllUsers()
      return res.data
    },
    meta: {
      onError: (error: AxiosError) => {
        const msg =
          (error.response?.data as { message?: string })?.message ||
          "Không thể lấy danh sách người dùng"
        toast.error(msg)
        console.error("useGetAllUsers", error)
      },
    },
  })
}
