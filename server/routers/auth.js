const express = require("express");
const authRoutes = express.Router();

const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
const { resendLimiter, verifyLimiter } = require("../middlewares/rateLimiter");

// Đăng ký
authRoutes.post("/register", authController.register);
authRoutes.post("/verify", verifyLimiter, authController.verifyAccount);
authRoutes.post("/resend", resendLimiter, authController.resendVerificationCode);

// Đăng nhập
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authController.logout);


authRoutes.get("/user/list", authMiddleware, authController.getAllUsers);

authRoutes.get("/slug/:slug", authMiddleware, authController.getUserBySlug);

module.exports = authRoutes;
