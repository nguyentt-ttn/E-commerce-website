import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { authApi } from "@/services/auth/Auth";

export const useVerifyAccount = () => {
  const nav = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; code: string }) =>
      authApi.VerifyAccount(data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Xác minh thành công");
      localStorage.removeItem("verifyData");
      nav("/auth/login");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error?.response?.data?.message || "Mã xác minh không hợp lệ";
      toast.error(msg);
    },
  });
};
