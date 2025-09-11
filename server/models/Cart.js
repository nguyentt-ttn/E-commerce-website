const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" }, // ID sản phẩm
  sku: String, // SKU biến thể được chọn
  size: String, // Kích thước người dùng chọn
  color: String, // Màu sắc người dùng chọn
  quantity: Number, // Số lượng sản phẩm trong giỏ
});

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true }, // Người sở hữu giỏ hàng
    items: [CartItemSchema], // Các sản phẩm trong giỏ
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Cart", CartSchema);
