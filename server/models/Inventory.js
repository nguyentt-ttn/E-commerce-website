const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventorySchema = new Schema(
  {
    sku: { type: String, required: true, unique: true }, // SKU của biến thể sản phẩm
    productId: { type: Schema.Types.ObjectId, ref: "Product" }, // Tham chiếu tới sản phẩm cha
    quantity: Number, // Số lượng tồn kho hiện tại của biến thể này
    threshold: { type: Number, default: 5 }, // Ngưỡng cảnh báo khi tồn kho thấp (5 chiếc)
    location: String, // Vị trí lưu kho (kệ, tầng, phòng)
  },
  { timestamps: true, versionKey: false }
);
module.exports = mongoose.model("Inventory", InventorySchema);
