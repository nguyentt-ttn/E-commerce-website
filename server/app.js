const dotenv = require("dotenv");
dotenv.config(); // Cấu hình biến môi trường từ file .env
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routers/auth");
const passport = require("passport");
const googleRoutes = require("./routers/google");
const categoryRoutes = require("./routers/category");
const productRouter = require("./routers/product");
require("./passport/google"); // cấu hình passport Google

// Kết nối đến cơ sở dữ liệu MongoDB
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(passport.initialize());

// Ghi log request ra console, hỗ trợ debug (chế độ dev)
app.use(morgan("dev"));

// Thêm các HTTP header bảo mật (chống XSS, clickjacking, v.v.)
app.use(helmet());

// Giới hạn số lượng request từ một IP trong 15 phút
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 phút
//   max: 100, // Tối đa 100 request/IP
// });
// app.use(limiter);

// Định nghĩa các tuyến API

// Product api
app.use("/api", productRouter);
//Category api
app.use('/api', categoryRoutes);
// Authentication api
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleRoutes);

//Middleware xử lý lỗi chung (error handling middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

//// Middleware xử lý route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({ message: "API not found" });
});

module.exports = app;
