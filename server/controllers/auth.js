const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const slugify = require("../utils/slugify");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const JWT_SECRET = process.env.JWT_SECRET;

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
    } = req.body;

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser)
      return res.status(400).json({ message: "Email đã được đăng ký" });

    const hashedPassword = await bcrypt.hash(password, 12);

    let slug = slugify(name);
    let slugExists = await User.findOne({ slug });
    if (slugExists) slug += "-" + Date.now();

    const user = new User({
      name,
      email,
      avatarUrl,
      password: hashedPassword,
      slug,
      phone,
      address,
      provider: "local",
    });

    await user.save();

    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    res.json({
      message: "Đăng ký thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
        phone: user.phone,
        address: user.address,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Lỗi server" });
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
        id: user._id,
        name: user.name,
        email: user.email,
        slug: user.slug,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
