const { default: mongoose } = require("mongoose");

const InventoryLogSchema = new mongoose.Schema({
  sku: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  type: { type: String, enum: ["import", "export", "adjustment", "order", "return"] },
  quantity: Number,
  reason: String,
  relatedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("InventoryLog", InventoryLogSchema);