import { authApi } from "@/services/auth/Auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResendCode = () => {
  return useMutation({
    mutationFn: (data: { email: string; via: "email" | "sms" }) =>
      authApi.ResendVerificationCode(data),
    onSuccess: (res) => {
      toast.success(res.data.message || "Đã gửi lại mã xác minh!");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Gửi lại mã thất bại";
      toast.error(msg);
    },
  });
};
