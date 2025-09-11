const express = require('express');
const CartRouter = express.Router();
const cartController = require('../controllers/cart');
const authMiddleware = require('../middlewares/auth');

CartRouter.use(authMiddleware)
// Lấy giỏ hàng người dùng
CartRouter.get('/cart', cartController.getCartByUserId);

// Thêm vào giỏ hàng
CartRouter.post('/cart/add', cartController.addToCart);

// Cập nhật số lượng
CartRouter.put('/cart/update', cartController.updateCartItem);

// Xoá sản phẩm khỏi giỏ
CartRouter.put('/cart/remove', cartController.removeCartItem);

// Xoá toàn bộ giỏ hàng
CartRouter.delete('/cart/clear', cartController.clearCart);

// Tăng số lượng
CartRouter.put('/cart/increase', cartController.increaseProductQuantity);

// Giảm số lượng
CartRouter.put('/cart/decrease', cartController.decreaseProductQuantity);

CartRouter.post('/cart/merge', cartController.mergeCart);

module.exports = CartRouter;
