const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    slug: { type: String, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6 },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: String,
    avatarUrl: String,
    phone: { type: String },
    address: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "banned", "pending", "deleted"],
      default: "pending",
    },
    // xác thực tài khoản
    verifyCode: String,
    verifyCodeExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", UserSchema);
