const mongoose = require("mongoose");
const { Schema } = mongoose;

const VariantSchema = new Schema({
  sku: { type: String, required: true, unique:true }, // Mã hàng hoá duy nhất dùng để quản lý tồn kho
  color: String,
  size: String,
  price: Number,
  discountPrice: Number,
  image: String,
  quantity: { type: Number, default: 0 },
});

const ProductSchema = new Schema(
  {
    name: String,
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    brand: String, // Thương hiệu
    category: { type: Schema.Types.ObjectId, ref: "Category" }, // Tham chiếu đến danh mục sản phẩm
    images: [String],
    //Nếu sản phẩm không có biến thể, thì dùng 2 trường này
    basePrice: Number, // Giá gốc chung
    discountPrice: Number, // Giá khuyến mãi chung
    variants: [VariantSchema],
    isActive: { type: Boolean, default: true }, // Trạng thái sản phẩm: có đang bán hay không
    isDeleted: { type: Boolean, default: false }, // Trạng thái sản phẩm: đã bị xóa hay chưa
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", ProductSchema);
