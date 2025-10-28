import type { LoginInterface, RegsiterInterface } from "@/types/Auth";
import { axiosInstance } from "@/utils/axios.util";

export const authApi = {
  Register: async (formData: RegsiterInterface) => {
    return await axiosInstance.post("auth/register", formData);
  },
  VerifyAccount: async (formData: { email: string; code: string }) => {
    return await axiosInstance.post("auth/verify", formData);
  },
  ResendVerificationCode: async (data: { email: string; via: string }) => {
    return await axiosInstance.post("auth/resend", data);
  },
  VerifyAccountByLink: async (token: string) => {
    return await axiosInstance.get(`auth/verify-link?token=${token}`);
  },
  Login: async (formData: LoginInterface) => {
    return await axiosInstance.post("auth/login", formData);
  },
  GetAllUsers: async () => {
    return await axiosInstance.get("auth/user/list");
  },
  GetUserBySlug: async (slug: string) => {
    return await axiosInstance.get(`auth/slug/${slug}`);
  },
};
