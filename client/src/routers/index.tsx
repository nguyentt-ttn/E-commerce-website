import MainLayout from "@/components/layout/MainLayout";
import NotFound from "@/page/(website)/NotFound";
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
        ],
    },
]);
