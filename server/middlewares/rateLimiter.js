const rateLimit = require("express-rate-limit");

const createLimiter = (opts) => rateLimit({
  windowMs: opts.windowMs || 15 * 60 * 1000, // 15 phút
  max: opts.max || 5, // tối đa 5 request/ window
  message: { message: "Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau." },
});

module.exports = {
  verifyLimiter: createLimiter({ windowMs: 10 * 60 * 1000, max: 10 }),
  resendLimiter: createLimiter({ windowMs: 10 * 60 * 1000, max: 3 }),
};
