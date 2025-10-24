import { QueryKey } from "@/constants/query-key";
import { authApi } from "@/services/auth/Auth";
import type { RegsiterInterface } from "@/types/Auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useRegister = () => {
  const queryClient = useQueryClient();
  const nav = useNavigate();

  return useMutation({
    mutationFn: (data: RegsiterInterface) => authApi.Register(data),

    onSuccess: async (res, variables) => {
      // ✅ biến `variables` chính là data gửi từ mutationFn (formData)
      const user = res.data.user;
      const via = variables.via || "email";

      // ✅ Thông báo thành công
      toast.success(res.data.message || "Đăng ký thành công, vui lòng xác minh tài khoản!");

      // ✅ Lưu lại thông tin xác minh
      localStorage.setItem(
        "verifyData",
        JSON.stringify({
          email: user.email,
          phone: user.phone,
          via,
        })
      );

      nav("/auth/select-method");

      await queryClient.invalidateQueries({ queryKey: [QueryKey.AUTH] });
    },

    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error?.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
      toast.error(msg);
      console.error("❌ useRegister Error:", error);
    },
  });
};
