const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" }, // Sản phẩm đặt mua
  sku: String, // SKU biến thể mua
  name: String, // Tên sản phẩm lúc đặt (giữ lại snapshot)
  color: String, // Màu sắc biến thể
  size: String, // Kích thước biến thể
  quantity: Number, // Số lượng mua
  price: Number, // Giá tại thời điểm mua
});

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" }, // Người đặt hàng
    slug: { type: String, unique: true, index: true }, // Mã đơn hàng thân thiện URL (vd: ORDER-20250525-001)
    items: [OrderItemSchema], // Danh sách sản phẩm trong đơn
    shippingAddress: {
      fullName: String, // Người nhận hàng
      phone: String, // Số điện thoại liên lạc
      address: String, // Địa chỉ giao hàng
    },
    totalAmount: Number, // Tổng tiền thanh toán
    paymentMethod: { type: String, enum: ["vnpay", "cod"] }, // Thanh toán online (VNPay) hoặc tiền mặt khi nhận hàng (COD)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
    }, // Trạng thái đơn hàng
    vnpayTransaction: {
      txnRef: String, // Mã giao dịch tham chiếu VNPay
      vnpTxnCode: String, // Mã giao dịch VNPay
      bankCode: String, // Mã ngân hàng thanh toán
      payDate: String, // Ngày thanh toán
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Order", OrderSchema);
