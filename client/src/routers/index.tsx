import MainLayout from "@/components/layout/MainLayout";
import { AdminLayout } from "@/page/(admin)/layout";
import LoginPage from "@/page/(auth)/Login/page";
import RegisterPage from "@/page/(auth)/Register/page";
import NotFound from "@/page/(website)/NotFound";
import { Customers } from "@/sections/admin/Customers";
import { Dashboard } from "@/sections/admin/Dashboard";
import { Orders } from "@/sections/admin/Oder";
import { Products } from "@/sections/admin/Product";
import GoogleCallback from "@/sections/auth/GoogleCallback";
import { createBrowserRouter } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import HomePage from "@/page/(website)/Home";
import VerifyPage from "@/page/(auth)/Verify/page";
import { SelectVerificationMethod } from "@/sections/auth/SelectVerificationMethod";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <LoginPage />,
            handle: { title: "Đăng nhập - Website của tôi" },
          },
          {
            path: "register",
            element: <RegisterPage />,
            handle: { title: "Đăng ký - Website của tôi" },
          },
          {
            path: "select-method",
            element: <SelectVerificationMethod />,
          },
          {
            path: "verify",
            element: <VerifyPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <Products /> },
          { path: "orders", element: <Orders /> },
          { path: "customers", element: <Customers /> },
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
