import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
// import { clearUserInfoAndToken, getCommonStateFromLocalStorage } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isAuthApi?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
   withCredentials: true
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // log error ra để kiểm tra rồi sử lý

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    // const token = getCommonStateFromLocalStorage()?.token;
    // if (token && config.headers) {
    //   config.headers.set(
    //     "Authorization",
    //     (config as CustomAxiosRequestConfig).isAuthApi
    //       ? `Bearer ${token}`
    //       : token
    //   );
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
