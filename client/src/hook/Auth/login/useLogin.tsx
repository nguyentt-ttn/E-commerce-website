import { QueryKey } from "@/constants/query-key";
import type { LoginInterface } from "@/types/Auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";
import { useAuthContext } from "../useAuthContext";
import { authApi } from "@/services/auth/Auth";

export const useLogin = () => {
    const queryClient = useQueryClient()
    const nav = useNavigate()
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: (data: LoginInterface) => authApi.Login(data),
        onSuccess: async (res) => {
            const { message, token, user } = res.data;
            toast.success(message)
            login(user, token);
            nav('/')
            await queryClient.invalidateQueries({ queryKey: [QueryKey.AUTH] })
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const msg = error?.response?.data?.message || "Có lỗi xảy ra"
            toast.error(msg)
            console.log("useLogin", error);
        },
    })
}
