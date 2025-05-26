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

// Tạo sản phẩm mới
productRouter.post("/products", createProduct);

// Lấy danh sách sản phẩm chưa xóa
productRouter.get("/products", getAllProducts);

// Lấy 1 sản phẩm theo slug
productRouter.get("/products/:slug", getProductBySlug);

// Cập nhật sản phẩm theo id
productRouter.put("/products/:id", updateProduct);

// Xóa mềm sản phẩm theo id
productRouter.delete("/products/:id/soft-delete", softDeleteProduct);

// Lấy danh sách sản phẩm đã xóa mềm
productRouter.get("/products/deleted/list", getDeletedProducts);

// Khôi phục sản phẩm đã xóa mềm
productRouter.patch("/products/restore/:id", restoreProduct);

// Xóa vĩnh viễn sản phẩm đã xóa mềm
productRouter.delete("/products/force-delete/:id", forceDeleteProduct);

module.exports = productRouter;
