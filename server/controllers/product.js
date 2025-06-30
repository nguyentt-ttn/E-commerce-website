const Inventory = require("../models/inventory");
const InventoryLog = require("../models/InventoryLog");
const Product = require("../models/Product");
const User = require("../models/User");
const slugify = require("../utils/slugify");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validations/product.validation");

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const images = req.files["images"]?.map((file) => file.path) || [];
    // Xử lý biến thể (variant)
    let variants = req.body.variants;
    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }
    variants = variants.map((variant, index) => ({
      ...variant,
      sku: (variant.sku || "").trim().toLowerCase(),
      price: parseFloat(variant.price || 0),
      discountPrice: parseFloat(variant.discountPrice || 0),
      quantity: parseInt(variant.quantity || 0),
      image: req.files[`variants[${index}][image]`]?.[0]?.path || "",
    }));

    // Kiểm tra trùng SKU trong chính sản phẩm
    const skus = variants.map((v) => v.sku);
    const duplicatedSkus = skus.filter(
      (sku, index) => skus.indexOf(sku) !== index
    );
    if (duplicatedSkus.length > 0) {
      return res.status(400).json({
        message: `SKU bị trùng trong biến thể: ${[
          ...new Set(duplicatedSkus),
        ].join(", ")}`,
      });
    }

    // Kiểm tra trùng SKU trên toàn bộ sản phẩm hiện có trong DB
    const existingProducts = await Product.find(
      {
        "variants.sku": { $in: skus },
      },
      {
        "variants.sku": 1,
      }
    );
    const duplicatedSkusInDB = [];
    existingProducts.forEach((product) => {
      product.variants.forEach((variant) => {
        if (skus.includes(variant.sku)) {
          duplicatedSkusInDB.push(variant.sku);
        }
      });
    });

    if (duplicatedSkusInDB.length > 0) {
      return res.status(400).json({
        message: `SKU đã tồn tại trong hệ thống: ${[
          ...new Set(duplicatedSkusInDB),
        ].join(", ")}`,
      });
    }

    const data = {
      ...req.body,
      images,
      variants,
    };

    const { error } = createProductSchema.validate(data, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    //slug
    const slug = slugify(req.body.name);
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Sản phẩm với slug này đã tồn tại" });
    }
    const userId = await User.findById(req.user?.userId).select("_id name");

    const newProduct = await Product.create({ ...data, slug });
    const populatedProduct = await Product.findById(newProduct._id).populate({
      path: "category",
      select: "_id name",
    });

    // Tạo bản ghi Inventory cho từng variant
    const createdInventories = [];
    const createdLogs = [];

    await Promise.all(
      variants.map(async (variant) => {
        const existingInventory = await Inventory.findOne({ sku: variant.sku });
        if (!existingInventory) {
          const newInventory = await Inventory.create({
            sku: variant.sku,
            quantity: variant.quantity || 0,
            productId: newProduct._id,
            location: variant.location || "",
          });
          createdInventories.push(newInventory);
          // Ghi log nhập kho
          const log = await InventoryLog.create({
            sku: variant.sku,
            productId: newProduct._id,
            type: "import",
            quantity: variant.quantity || 0,
            reason: "Tạo sản phẩm mới",
            createdBy: userId || null,
          });
          createdLogs.push(log);
        }
      })
    );

    res.status(201).json({
      message: "Sản phẩm đã được tạo thành công",
      product: populatedProduct,
      inventories: createdInventories,
      logs: createdLogs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    // Lấy page và limit từ query, mặc định page = 1, limit = 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Đếm tổng số sản phẩm không bị xóa
    const total = await Product.countDocuments({ isDeleted: false });

    // Lấy sản phẩm có phân trang
    const products = await Product.find({ isDeleted: false })
      .populate({
        path: "category",
        select: "_id name",
      })
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Danh sách sản phẩm",
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Inventory
// const populateInventoryQuantities = async (product) => {
//   const skus = product.variants.map((v) => v.sku);
//   const inventories = await Inventory.find({ sku: { $in: skus } });

//   const inventoryMap = {};
//   inventories.forEach((inv) => {
//     inventoryMap[inv.sku] = inv.quantity;
//   });

//   product.variants = product.variants.map((variant) => ({
//     ...variant.toObject(), // để variant là object thường
//     quantity: inventoryMap[variant.sku] ?? 0,
//   }));

//   return product;
// };
// Hàm đồng bộ quantity từ Inventory sang variants
const populateInventoryQuantities = async (productDoc) => {
  // Chuyển từ Mongoose document sang object thường để có thể chỉnh sửa
  const product = productDoc.toObject();

  // Chuẩn hóa danh sách sku (trim + lowercase)
  const skus = product.variants.map((v) => v.sku.trim().toLowerCase());

  // Tìm bản ghi inventory tương ứng với các sku trên
  const inventories = await Inventory.find({
    sku: { $in: skus },
  });

  // Log để debug
  console.log("🔍 SKUs từ variants:", skus);
  console.log(
    "📦 Inventory tìm được:",
    inventories.map((i) => ({ sku: i.sku, quantity: i.quantity }))
  );

  // Tạo map sku => quantity
  const inventoryMap = {};
  inventories.forEach((inv) => {
    inventoryMap[inv.sku.trim().toLowerCase()] = inv.quantity;
  });

  // Gán quantity trong variants từ inventoryMap, nếu không có thì = 0
  product.variants = product.variants.map((variant) => ({
    ...variant,
    quantity: inventoryMap[variant.sku.trim().toLowerCase()] ?? 0,
  }));

  return product;
};

// Lấy 1 sản phẩm theo slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate({
      path: "category",
      select: "_id name",
    });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    const populatedProduct = await populateInventoryQuantities(product);

    res.json({ message: "Chi tiết sản phẩm", product: populatedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const images = req.files["images"]?.map((file) => file.path) || [];

    // Xử lý biến thể (variant)
    let variants = req.body.variants;
    if (typeof variants === "string") {
      variants = JSON.parse(variants);
    }
    variants = variants.map((variant, index) => ({
      ...variant,
      sku: (variant.sku || "").trim().toLowerCase(),
      price: parseFloat(variant.price || 0),
      discountPrice: parseFloat(variant.discountPrice || 0),
      quantity: parseInt(variant.quantity || 0),
      image: req.files[`variants[${index}][image]`]?.[0]?.path || "",
    }));

    // Kiểm tra trùng SKU trong chính sản phẩm
    const skus = variants.map((v) => v.sku);
    const duplicatedSkus = skus.filter(
      (sku, index) => skus.indexOf(sku) !== index
    );
    if (duplicatedSkus.length > 0) {
      return res.status(400).json({
        message: `SKU bị trùng trong biến thể: ${[
          ...new Set(duplicatedSkus),
        ].join(", ")}`,
      });
    }

    // Kiểm tra trùng SKU trên toàn bộ sản phẩm hiện có trong DB
    const existingProducts = await Product.find(
      {
        _id: { $ne: req.params.id },
        "variants.sku": { $in: skus },
      },
      {
        "variants.sku": 1,
      }
    );
    const duplicatedSkusInDB = [];
    existingProducts.forEach((product) => {
      product.variants.forEach((variant) => {
        if (skus.includes(variant.sku)) {
          duplicatedSkusInDB.push(variant.sku);
        }
      });
    });

    if (duplicatedSkusInDB.length > 0) {
      return res.status(400).json({
        message: `SKU đã tồn tại trong hệ thống: ${[
          ...new Set(duplicatedSkusInDB),
        ].join(", ")}`,
      });
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {
      ...req.body,
      images,
      variants,
    };

    // Validate dữ liệu
    const { error } = updateProductSchema.validate(updateData, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ message: error.details.map((e) => e.message) });
    }

    // Nếu đổi tên sản phẩm => cập nhật slug
    if (req.body.name) {
      const newSlug = slugify(req.body.name);

      // Kiểm tra slug mới đã tồn tại ở sản phẩm khác chưa
      const existingProduct = await Product.findOne({
        slug: newSlug,
        _id: { $ne: req.params.id },
      });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Slug từ tên sản phẩm đã tồn tại" });
      }

      updateData.slug = newSlug;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate({
      path: "category",
      select: "_id name",
    });

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const createdInventories = [];
    const createdLogs = [];
    const userId = await User.findById(req.user?.userId).select("_id name");
    await Promise.all(
      variants.map(async (variant) => {
        const existingInventory = await Inventory.findOne({ sku: variant.sku });
        if (!existingInventory) {
          const newInventory = await Inventory.create({
            sku: variant.sku,
            quantity: variant.quantity || 0,
            productId: updatedProduct._id,
            location: variant.location || "",
          });
          createdInventories.push(newInventory);
          // Ghi log nhập kho
          const log = await InventoryLog.create({
            sku: variant.sku,
            productId: updatedProduct._id,
            type: "import",
            quantity: variant.quantity || 0,
            reason: "Cập nhật sản phẩm",
            createdBy: userId || null,
          });
          createdLogs.push(log);
        }
      })
    );
    res.json({
      message: "Cập nhật sản phẩm thành công",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa mềm sản phẩm
exports.softDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa mềm sản phẩm", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Danh sách sản phẩm đã xóa mềm
exports.getDeletedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: true });
    res.json({ message: "Danh sách sản phẩm đã xóa mềm", products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Khôi phục sản phẩm đã xóa mềm
exports.restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Khôi phục sản phẩm thành công", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa vĩnh viênn sản phẩm đã xóa mềm
exports.forceDeleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      isDeleted: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm đã xóa" });
    res.json({ message: "Đã xóa vĩnh viễn sản phẩm", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
