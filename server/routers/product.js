const express = require("express");
const productRouter = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  softDeleteProduct,
  getDeletedProducts,
  restoreProduct,
  forceDeleteProduct,
} = require("../controllers/product");
const upload = require("../middlewares/upload");
const { generateVariantFields } = require("../utils/multerFields.js");
const authMiddleware = require("../middlewares/auth.js");

// Tạo sản phẩm mới
productRouter.post(
  "/products",authMiddleware,
  upload.fields(generateVariantFields(10)),
  createProduct
);

// Cập nhật sản phẩm theo id
productRouter.put(
  "/products/:id",
  upload.fields(generateVariantFields(10)),
  updateProduct
);

// Lấy danh sách sản phẩm chưa xóa
productRouter.get("/products", getAllProducts);

// Lấy 1 sản phẩm theo slug
productRouter.get("/products/:slug", getProductBySlug);

// Xóa mềm sản phẩm theo id
productRouter.delete("/products/:id/soft-delete", softDeleteProduct);

// Lấy danh sách sản phẩm đã xóa mềm
productRouter.get("/products/deleted/list", getDeletedProducts);

// Khôi phục sản phẩm đã xóa mềm
productRouter.patch("/products/restore/:id", restoreProduct);

// Xóa vĩnh viễn sản phẩm đã xóa mềm
productRouter.delete("/products/force-delete/:id", forceDeleteProduct);

module.exports = productRouter;
