import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useResendCode } from "@/hook/Auth/users/useResendCode";

export const SelectVerificationMethod = () => {
  const verifyData = JSON.parse(localStorage.getItem("verifyData") || "{}");
  const { email, phone } = verifyData;
  const [via, setVia] = useState<"email" | "sms" | "">("");
  const { mutate: resend, isPending } = useResendCode();
  const nav = useNavigate();

  const handleContinue = () => {
    if (!via) {
      toast.error("Vui lòng chọn phương thức xác minh!");
      return;
    }

    if (via === "sms" && (!phone || phone === "Chưa cập nhật")) {
      toast.error("Bạn chưa có số điện thoại để gửi mã!");
      return;
    }

    resend(
      { email, via },
      {
        onSuccess: (res) => {
          localStorage.setItem(
            "verifyData",
            JSON.stringify({ email, phone, via })
          );
          toast.success(res.data.message);
          nav("/auth/verify");
        },
      }
    );
  };

  if (!email) {
    toast.error("Không tìm thấy thông tin đăng ký. Vui lòng đăng ký lại!");
    nav("/auth/register");
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Chọn phương thức xác minh
      </h2>
      <Card className="mb-4 cursor-pointer" onClick={() => setVia("email")}>
        <CardContent
          className={`p-4 ${
            via === "email" ? "border border-blue-500" : "border-transparent"
          }`}
        >
          <p className="font-medium">Gửi mã qua Email</p>
          <p className="text-gray-500 text-sm">{email}</p>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer ${
          !phone || phone === "Chưa cập nhật" ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => phone && setVia("sms")}
      >
        <CardContent
          className={`p-4 ${
            via === "sms" ? "border border-blue-500" : "border-transparent"
          }`}
        >
          <p className="font-medium">Gửi mã qua SMS</p>
          <p className="text-gray-500 text-sm">
            {phone && phone !== "Chưa cập nhật" ? phone : "Không có số điện thoại"}
          </p>
        </CardContent>
      </Card>

      <Button
        onClick={handleContinue}
        disabled={isPending}
        className="w-full mt-6"
      >
        {isPending ? "Đang gửi mã..." : "Tiếp tục"}
      </Button>
    </div>
  );
};
