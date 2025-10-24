const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const slugify = require("../utils/slugify");
const nodemailer = require("nodemailer");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const JWT_SECRET = process.env.JWT_SECRET;

const { TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE } = process.env;
let twilioClient = null;
if (TWILIO_SID && TWILIO_TOKEN) {
  const twilio = require("twilio");
  twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
}

// Setup transporter nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: tạo mã xác thực 6 chữ số
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: chuẩn hóa số điện thoại
function formatPhoneNumber(phone) {
  if (!phone) return null;
  const clean = phone.replace(/\s+/g, "").trim();
  return clean.startsWith("+84") ? clean : clean.replace(/^0/, "+84");
}
/**
 * sendVerificationEmail
 */
async function sendVerificationEmail({ to, name, code }) {
  const html = `
    <div>
      <p>Xin chào ${name},</p>
      <p>Mã xác nhận tài khoản của bạn là:</p>
      <h2>${code}</h2>
      <p>Mã sẽ hết hạn sau 10 phút.</p>
    </div>
  `;
  return transporter.sendMail({
    from: `"Xác minh" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Mã xác nhận tài khoản",
    html,
  });
}

/**
 * sendVerificationSMS (tùy chọn)
 */
async function sendVerificationSMS({ to, code }) {
  if (!twilioClient) {
    throw new Error("Twilio chưa được cấu hình");
  }
  return twilioClient.messages.create({
    body: `Ma xac nhan cua ban la: ${code}`,
    from: process.env.TWILIO_PHONE,
    to,
  });
}

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((message) => message.message);
      return res.json(errorMessage);
    }

    const {
      name,
      email,
      password,
      phone = "Chưa cập nhật",
      address = "Chưa cập nhật",
      avatarUrl = "https://i.pravatar.cc/150?u=" + email,
      via = "",
    } = req.body;

    const formattedPhone = formatPhoneNumber(phone);

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    if (formattedPhone) {
      const existingPhoneUser = await User.findOne({ phone: formattedPhone });
      if (existingPhoneUser) {
        return res
          .status(400)
          .json({ message: "Số điện thoại đã được đăng ký" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    let slug = slugify(name);
    let slugExists = await User.findOne({ slug });
    if (slugExists) slug += "-" + Date.now();

    const verificationCode = generateVerificationCode();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 phút

    const user = new User({
      name,
      email,
      avatarUrl,
      password: hashedPassword,
      slug,
      phone:
        formattedPhone && formattedPhone !== ""
          ? formattedPhone
          : "Chưa cập nhật",
      address,
      provider: "local",
      status: "pending",
      verifyCode: verificationCode,
      verifyCodeExpires: expiry,
    });

    await user.save();

    // Gửi mã xác minh
    try {
      if (via === "sms" && formattedPhone && twilioClient) {
        console.log("📨 Gửi mã SMS đến:", formattedPhone);
        await sendVerificationSMS({
          to: formattedPhone,
          code: verificationCode,
        });
      } else if (via === "email") {
        console.log("📧 Gửi mã Email đến:", email);
        await sendVerificationEmail({
          to: email,
          name,
          code: verificationCode,
        });
      } else {
        // ⚠️ Nếu chưa chọn cách gửi thì chỉ lưu user, không gửi mã
        console.log(
          "⚠️ Chưa chọn phương thức gửi mã, user ở trạng thái pending"
        );
      }
    } catch (sendErr) {
      console.error("Gửi mã xác nhận thất bại:", sendErr);
      console.warn("⚠️ Twilio gửi lỗi (dev mode):", sendErr.message);
      console.log("👉 Mã xác nhận là:", verificationCode);

      // return res.status(500).json({ message: "Gửi mã xác nhận thất bại." });
    }

    res.json({
      message: "Vui lòng kiểm tra email hoặc SMS để nhận mã xác nhận.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        phone: user.phone,
        address: user.address,
        avatarUrl: user.avatarUrl,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi server:", err);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

/**
 * Verify controller
 */
exports.verifyAccount = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: "Thiếu tham số" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Không tìm thấy tài khoản" });

    if (user.status === "active") {
      return res.json({ message: "Tài khoản đã được kích hoạt" });
    }

    if (!user.verifyCode || !user.verifyCodeExpires) {
      return res
        .status(400)
        .json({ message: "Không có mã xác nhận. Vui lòng gửi lại mã." });
    }

    if (user.verifyCode !== code) {
      return res.status(400).json({ message: "Mã xác nhận không đúng" });
    }

    if (user.verifyCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Mã đã hết hạn" });
    }

    user.status = "active";
    user.verifyCode = undefined;
    user.verifyCodeExpires = undefined;
    await user.save();

    return res.json({ message: "Kích hoạt tài khoản thành công" });
  } catch (err) {
    console.error("verifyAccount error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

/**
 * Resend verification code
 */
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email, via = "email" } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Không tìm thấy tài khoản" });
    if (user.status === "active")
      return res.json({ message: "Tài khoản đã kích hoạt" });

    const verificationCode = generateVerificationCode();
    const expiry = Date.now() + 10 * 60 * 1000;

    user.verifyCode = verificationCode;
    user.verifyCodeExpires = expiry;
    await user.save();

    try {
      if (via === "sms" && user.phone && twilioClient) {
        console.log("Gửi lại SMS đến:", user.phone);
        await sendVerificationSMS({ to: user.phone, code: verificationCode });
      } else {
        console.log(" Gửi lại Email đến:", user.email);
        await sendVerificationEmail({
          to: user.email,
          name: user.name,
          code: verificationCode,
        });
      }
    } catch (sendErr) {
      console.error("Gửi lại mã thất bại:", sendErr);
      console.log(" Mã xác nhận (dev mode):", verificationCode);

      // return res.status(500).json({ message: "Gửi mã thất bại" });
    }

    return res.json({ message: "Đã gửi lại mã xác nhận" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((message) => message.message);
      return res.json(errorMessage);
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email, provider: "local" });
    if (!user)
      return res.status(400).json({ message: "Email này chưa được đăng ký" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        // id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      message: "Lấy danh sách người dùng thành công",
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getUserBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const user = await User.findOne({ slug }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
