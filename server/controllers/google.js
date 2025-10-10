const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.googleLoginCallback = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect("http://localhost:5173/google/callback?status=error");
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: false, // không thể truy cập bằng JS (chống XSS)
      secure: false, // true nếu chạy HTTPS
      sameSite: "lax", // chống CSRF cơ bản
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.cookie(
      "user",
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
      }),
      {
        httpOnly: false, // FE đọc được
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    );
    // res.redirect(`http://localhost:5173/google/callback?token=${token}`);
    res.redirect("http://localhost:5173/google/callback?status=success");
  } catch (err) {
    console.error(err);
    res.redirect("http://localhost:5173/google/callback?status=error");
  }
};
