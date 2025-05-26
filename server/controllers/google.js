const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.googleLoginCallback = (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Trả token và user về frontend (bạn có thể redirect kèm token nếu dùng frontend riêng)
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        slug: user.slug
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi xử lý đăng nhập Google' });
  }
};
