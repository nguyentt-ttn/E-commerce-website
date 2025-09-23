import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/page/(auth)/Login/page";
import RegisterPage from "@/page/(auth)/Register/page";
import NotFound from "@/page/(website)/NotFound";
import GoogleCallback from "@/sections/auth/GoogleCallback";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                // element: <Home />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
            {
                path: "google/callback",
                element: < GoogleCallback />
            },
            {
                path: "auth",
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                        handle: { title: "Đăng nhập - Website của tôi" }

                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                        handle: { title: "Đăng ký - Website của tôi" }

                    }
                    ,

                ],
            },
        ],
    },
    // {
    //     path: "auth",
    //     children: [
    //         {
    //             path: "login",
    //             element: <LoginPage />
    //         },
    //         {
    //             path: "register",
    //             element: <RegisterPage />
    //         }
    //     ],
    // },

]);
