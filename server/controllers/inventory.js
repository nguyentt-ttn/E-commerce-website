const Inventory = require("../models/inventory");
const InventoryLog = require("../models/InventoryLog");
exports.addInventory = async (req, res) => {
  try {
    const { sku, productId, quantity, threshold, location } = req.body;
    const existing = await Inventory.findOne({ sku });
    if (existing) return res.status(400).json({ message: "SKU đã tồn tại" });

    const inventory = await Inventory.create({
      sku,
      productId,
      quantity,
      threshold,
      location,
    });
    await InventoryLog.create({
      sku,
      productId,
      type: "import",
      quantity,
      reason: "Tạo mới tồn kho",
      createdBy: req.user?._id,
    });

    res.status(201).json({message: "Tồn kho đã được tạo", inventory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { sku } = req.params;
    const {location, quantity, reason } = req.body;
    const inventory = await Inventory.findOne({ sku });
    if (!inventory)
      return res.status(404).json({ message: "Không tìm thấy SKU" });

    const diff = quantity - inventory.quantity;
    inventory.quantity = quantity;
     if (location) {
      inventory.location = location;
    }
    await inventory.save();

    await InventoryLog.create({
      sku,
      productId: inventory.productId,
      type: "adjustment",
      quantity: diff,
      reason,
      createdBy: req.user?._id,
    });
    res.json({ message: "Cập nhật tồn kho thành công", inventory });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reduceInventoryOnOrder = async (items, orderId, userId) => {
  for (const item of items) {
    const inventory = await Inventory.findOne({ sku: item.sku });
    if (!inventory || inventory.quantity < item.quantity)
      throw new Error(`Không đủ hàng cho SKU ${item.sku}`);
    inventory.quantity -= item.quantity;
    await inventory.save();

    await InventoryLog.create({
      sku: item.sku,
      productId: item.productId,
      type: "order",
      quantity: -item.quantity,
      reason: "Đặt hàng",
      relatedOrderId: orderId,
      createdBy: userId,
    });
  }
};

exports.returnInventory = async (req, res) => {
  try {
    const { sku, productId, quantity, orderId, reason } = req.body;
    const inventory = await Inventory.findOne({ sku });
    if (!inventory)
      return res.status(404).json({ message: "Không tìm thấy SKU" });
    inventory.quantity += quantity;
    await inventory.save();

    await InventoryLog.create({
      sku,
      productId,
      type: "return",
      quantity,
      reason,
      relatedOrderId: orderId,
      createdBy: req.user?._id,
    });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportInventory = async (req, res) => {
  try {
    const { sku, productId, quantity, reason } = req.body;
    const inventory = await Inventory.findOne({ sku });
    if (!inventory)
      return res.status(404).json({ message: "Không tìm thấy SKU" });
    if (inventory.quantity < quantity)
      return res.status(400).json({ message: "Không đủ hàng để xuất kho" });

    inventory.quantity -= quantity;
    await inventory.save();

    await InventoryLog.create({
      sku,
      productId,
      type: "export",
      quantity: -quantity,
      reason,
      createdBy: req.user?._id,
    });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventories = async (req, res) => {
  try {
    const { sku, productId } = req.query;
    const filter = {};
    if (sku) filter.sku = sku;
    if (productId) filter.productId = productId;
    const inventories = await Inventory.find(filter).populate("productId");
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const lowStock = await Inventory.find({
      $expr: { $lt: ["$quantity", "$threshold"] },
    }).populate("productId");
    res.json(lowStock);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventoryLogs = async (req, res) => {
  try {
    const { sku } = req.query;
    const filter = sku ? { sku } : {};
    const logs = await InventoryLog.find(filter)
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate("createdBy")
      .populate("relatedOrderId");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const { sku } = req.params;
    await Inventory.findOneAndDelete({ sku });
    res.json({ message: "Đã xoá tồn kho" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventorySummary = async (req, res) => {
  try {
    const summary = await Inventory.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          sku: 1,
          quantity: 1,
          productName: "$product.name",
        },
      },
    ]);

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInventoryLogStats = async (req, res) => {
  try {
    const logs = await InventoryLog.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type",
          },
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
