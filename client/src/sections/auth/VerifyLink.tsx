import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyByLink } from "@/hook/Auth/users/useVerifyByLink";
import Loader from "@/utils/loading/loading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const VerifyLink = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { mutate, isPending, isError } = useVerifyByLink();
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Liên kết xác minh không hợp lệ");
      return;
    }

    mutate(token, {
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          "Liên kết xác minh không hợp lệ hoặc đã hết hạn";
        setError(msg);
      },
    });
  }, [token, mutate]);

  if (isPending)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <Loader />
          <p className="text-gray-600 mt-2">Đang xác minh tài khoản...</p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        {error ? (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => nav("/auth/login")}>
                Đăng nhập
              </Button>
              <Button
                onClick={() => {
                  nav("/auth/resend");
                  toast.info("Vui lòng nhập email để nhận lại liên kết xác minh.");
                }}
              >
                Gửi lại mã
              </Button>
            </div>
          </>
        ) : (
          <p className="text-green-600">Xác minh tài khoản thành công!</p>
        )}
      </div>
    </div>
  );
};
