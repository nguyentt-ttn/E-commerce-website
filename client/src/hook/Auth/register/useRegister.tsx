import { QueryKey } from "@/constants/query-key";
import { authApi } from "@/services/auth/register"
import type { RegsiterInterface } from "@/types/Auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";

export const useRegister = () => {
    const queryClient = useQueryClient()
    const nav = useNavigate()

    return useMutation({
        mutationFn: (data: RegsiterInterface) => authApi.Register(data),
        onSuccess: async (res: any) => {
            nav('/login')
            toast.success(res.data.message)
            console.log("useRegister", res.data.message);
            await queryClient.invalidateQueries({ queryKey: [QueryKey.AUTH] })
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "Có lỗi xảy ra"
            toast.error(msg)
            console.log("useRegister", error);
        },
    })
}
