import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { authApi } from "../../../services/auth/Auth";

export const useVerifyByLink = () => {
  const nav = useNavigate();

  return useMutation({
    mutationFn: (token: string) => authApi.VerifyAccountByLink(token),
    onSuccess: (res) => {
      toast.success(res.data.message);
      localStorage.removeItem("verifyData");
      nav("/auth/login");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message;
      // toast.error(msg);
      switch (status) {
        case 400:
          toast.error(msg || "Liên kết không hợp lệ");
          break;
        case 401:
          toast.error(
            msg || "Liên kết đã hết hạn. Vui lòng yêu cầu gửi lại mã."
          );
          break;
        case 404:
          toast.error(msg || "Không tìm thấy tài khoản.");
          break;
        case 500:
          toast.error("Đã xảy ra lỗi server khi xác minh.");
          break;
        default:
          toast.error("Liên kết xác minh không hợp lệ hoặc đã hết hạn.");
      }
    },
  });
};
