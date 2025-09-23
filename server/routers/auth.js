const express = require("express");
const authRoutes = express.Router();

const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");

// Đăng ký
authRoutes.post("/register", authController.register);

// Đăng nhập
authRoutes.post("/login", authController.login);
authRoutes.get("/me", authMiddleware, authController.getMe);
authRoutes.post("/logout", authController.logout);

module.exports = authRoutes;
