
import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Tên phải có ít nhất 3 ký tự")
      .max(100, "Tên không được quá 100 ký tự")
      .nonempty("Tên không được để trống"),
    email: z
      .string()
      .nonempty("Email không được để trống")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .nonempty("Mật khẩu không được để trống"),
    confirmPassword: z
      .string()
      .nonempty("Vui lòng nhập lại mật khẩu"),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Xác nhận mật khẩu không khớp",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .nonempty("Mật khẩu không được để trống"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
