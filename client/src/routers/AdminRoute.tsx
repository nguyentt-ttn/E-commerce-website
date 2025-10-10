import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/hook/Auth/useAuthContext";
import { useEffect, useRef, type JSX } from "react";
import { toast } from "sonner";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuthContext();
  const hasShownToast = useRef(false); 
  useEffect(() => {
    if (hasShownToast.current) return;

    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập để truy cập trang này");
      hasShownToast.current = true;
    } else if (user?.role !== "admin") {
      toast.error("Bạn không có quyền truy cập trang quản trị");
      hasShownToast.current = true;
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
