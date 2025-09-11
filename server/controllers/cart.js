const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Lấy giỏ hàng của người dùng
exports.getCartByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select:
        "name slug brand category basePrice discountPrice images variants",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    if (!cart)
      return res.json({ message: "Giỏ hàng trống", userId, items: [] });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, sku, quantity, color, size } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!productId || !size || !color) {
      return res.status(400).json({
        message:
          "Thiếu thông tin cần thiết: productId, size, hoặc color.",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.sku === sku && item.color === color && item.size === size
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ productId, sku, quantity, color, size });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select:
        "name slug brand category basePrice discountPrice images variants",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.json({ message: "Đã thêm sản phẩm vào giỏ hàng", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng sản phẩm
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sku, color, size, quantity } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const index = cart.items.findIndex(
      (item) => item.sku === sku && item.color === color && item.size === size
    );

    if (index === -1)
      return res.status(404).json({ message: "Sản phẩm không có trong giỏ" });

    cart.items[index].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select:
        "name slug brand category basePrice discountPrice images variants",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.json({ message: "Đã cập nhật số lượng", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá một sản phẩm khỏi giỏ
exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sku, color, size } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.sku === sku && item.color === color && item.size === size)
    );
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select:
        "name slug brand category basePrice discountPrice images variants",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.json({ message: "Đã xoá sản phẩm khỏi giỏ", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xoá toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Đã xoá toàn bộ giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tăng số lượng sản phẩm
exports.increaseProductQuantity = async (req, res) => {
  try {
    const userId = req.user.id;

    const { sku, size, color } = req.body;

    // if (!userId || !productId || !size || !color) {
    //   return res.status(400).json({
    //     message:
    //       "Thiếu thông tin cần thiết: userId, productId, size, hoặc color.",
    //   });
    // }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.sku === sku && item.size === size && item.color === color
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity += 1;
      await cart.save();
      return res.json({ message: "Đã tăng số lượng", cart });
    } else {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tăng số lượng sản phẩm.",
      error: error.message,
    });
  }
};

// Giảm số lượng sản phẩm
exports.decreaseProductQuantity = async (req, res) => {
  try {
    const userId = req.user.id;

    const { sku, size, color } = req.body;

    // if (!userId || !productId || !size || !color) {
    //   return res.status(400).json({
    //     message:
    //       "Thiếu thông tin cần thiết: userId, productId, size, hoặc color.",
    //   });
    // }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại." });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.sku === sku && item.size === size && item.color === color
    );

    if (productIndex > -1) {
      if (cart.items[productIndex].quantity > 1) {
        cart.items[productIndex].quantity -= 1;
        await cart.save();
        return res.json({ message: "Đã giảm số lượng", cart });
      } else {
        return res
          .status(400)
          .json({ message: "Số lượng sản phẩm không thể giảm xuống dưới 1." });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ hàng." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi giảm số lượng sản phẩm.",
      error: error.message,
    });
  }
};

// controllers/cart.js
exports.mergeCart = async (req, res) => {
  try {
    const { userId, localCart } = req.body; // localCart: [{productId, sku, size, color, quantity}]

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    for (const item of localCart) {
      const index = cart.items.findIndex(
        (i) =>
          i.productId.toString() === item.productId &&
          i.sku === item.sku &&
          i.size === item.size &&
          i.color === item.color
      );

      if (index > -1) {
        cart.items[index].quantity += item.quantity;
      } else {
        cart.items.push(item);
      }
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select:
        "name slug brand category basePrice discountPrice images variants",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    res.json({ message: "Đã merge giỏ hàng", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
