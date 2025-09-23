import Loader from "@/utils/loading/loading"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const GoogleCallback = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // const params = new URLSearchParams(window.location.search)
        // const token = params.get("token")

        // if (token) {
        //   localStorage.setItem("token", token)
        //   navigate("/") // về home
        // }
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");

        if (status) {
            if (status === "success") toast.success("Đăng nhập Google thành công! 🎉");
            if (status === "error") toast.error("Đăng nhập Google thất bại!");

            // Xóa query string khỏi URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (status === "success") navigate("/", { replace: true });
        if (status === "error") navigate("/auth/login", { replace: true });
        // navigate("/") // về home

    }, [navigate])

    return <Loader />
}

export default GoogleCallback
