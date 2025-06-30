const express = require("express");
const {
  addInventory,
  updateInventory,
  exportInventory,
  returnInventory,
  getInventories,
  getLowStock,
  getInventoryLogs,
  deleteInventory,
  getInventorySummary,
  getInventoryLogStats,
} = require("../controllers/inventory");
const inventoryRoutes = express.Router();

// Thêm mới tồn kho
inventoryRoutes.post("/inventories", addInventory);

// Cập nhật số lượng tồn kho (điều chỉnh thủ công)
inventoryRoutes.put("/inventories/:sku", updateInventory);

// Xuất kho (giảm hàng)
inventoryRoutes.post("/inventories/export", exportInventory);

// Nhập hàng trả lại (return)
inventoryRoutes.post("/inventories/return", returnInventory);

// Lấy danh sách tất cả tồn kho (có thể lọc theo SKU, productId)
inventoryRoutes.get("/inventories", getInventories);

// Lấy danh sách tồn kho có số lượng thấp hơn ngưỡng cảnh báo (threshold)
inventoryRoutes.get("/inventories/low-stock", getLowStock);

// Lấy danh sách nhật ký tồn kho (InventoryLog)
inventoryRoutes.get("/inventories/logs", getInventoryLogs);

// Xoá tồn kho theo SKU
inventoryRoutes.delete("/inventories/:sku", deleteInventory);

// Thống kê tổng số lượng tồn kho theo sản phẩm (dùng cho biểu đồ cột)
inventoryRoutes.get("/inventories/summary", getInventorySummary);

// Thống kê số lượng giao dịch tồn kho theo ngày và loại (import, export, order, return, adjustment)
inventoryRoutes.get("/inventories/log-stats", getInventoryLogStats);

module.exports = inventoryRoutes;
