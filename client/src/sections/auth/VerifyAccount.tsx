import { useState, useEffect } from "react";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useVerifyAccount } from "@/hook/Auth/users/useVerifyAccount";
import { useResendCode } from "@/hook/Auth/users/useResendCode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const VerifyAccount = () => {
  const verifyData = JSON.parse(localStorage.getItem("verifyData") || "{}");
  const { email, phone, via = "email" } = verifyData;

  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [isCounting, setIsCounting] = useState(false);

  const { mutate, isPending } = useVerifyAccount();
  const { mutate: resend, isPending: resendPending } = useResendCode();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && seconds > 0) {
      timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [isCounting, seconds]);

  const handleVerify = () => {
    const identifier = via === "sms" ? phone : email;
    if (!identifier) {
      toast.error("Không tìm thấy thông tin xác minh. Vui lòng đăng ký lại!");
      return;
    }
    if (!code) {
      toast.error("Vui lòng nhập mã xác minh!");
      return;
    }
    mutate({ email, code });
  };

  const handleResend = () => {
    const identifier = via === "sms" ? phone : email;
    if (!identifier) {
      toast.error("Không tìm thấy thông tin xác minh. Vui lòng đăng ký lại!");
      return;
    }
    resend({ email, via });
    setIsCounting(true);
    setSeconds(60);
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Xác minh tài khoản
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Mã xác minh đã được gửi qua{" "}
        <b>{via === "sms" ? `số điện thoại ${phone}` : `email ${email}`}</b>
      </p>

      <div className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Nhập mã xác minh 6 chữ số"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="text-center text-lg tracking-widest"
          maxLength={6}
        />

        <Button
          onClick={handleVerify}
          disabled={isPending || !code}
          className="w-full"
        >
          {isPending && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
          Xác minh
        </Button>

        <div className="text-center text-sm text-gray-500">
          Bạn chưa nhận được mã?
        </div>

        <Button
          variant="outline"
          onClick={handleResend}
          disabled={resendPending || isCounting}
          className="w-full"
        >
          {resendPending ? (
            <>
              <Loader2 className="animate-spin mr-2 w-4 h-4" /> Đang gửi lại...
            </>
          ) : isCounting ? (
            `Gửi lại sau ${seconds}s`
          ) : (
            "Gửi lại mã xác minh"
          )}
        </Button>
      </div>
    </div>
  );
};
