const express = require("express");
const authRoutes = express.Router();

const authController = require("../controllers/auth");

// Đăng ký
authRoutes.post("/register", authController.register);

// Đăng nhập
authRoutes.post("/login", authController.login);

module.exports = authRoutes;
