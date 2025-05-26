const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Tên không được để trống",
    "string.min": "Tên phải có ít nhất 3 ký tự",
    "string.max": "Tên không được quá 100 ký tự",
    "any.required": "Tên là bắt buộc",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Xác nhận mật khẩu không khớp",
    "string.empty": "Vui lòng nhập lại mật khẩu",
    "any.required": "Xác nhận mật khẩu là bắt buộc",
  }),
  phone: Joi.string().allow("", null),
  address: Joi.string().allow("", null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống",
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Mật khẩu không được để trống",
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự",
    "any.required": "Mật khẩu là bắt buộc",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
