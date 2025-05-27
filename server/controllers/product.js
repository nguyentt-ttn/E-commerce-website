const Product = require("../models/Product");
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
      price: parseFloat(variant.price || 0),
      discountPrice: parseFloat(variant.discountPrice || 0),
      quantity: parseInt(variant.quantity || 0),
      image: req.files[`variants[${index}][image]`]?.[0]?.path || "",
    }));

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

    const newProduct = await Product.create({ ...data, slug });
    res.status(201).json({
      message: "Sản phẩm đã được tạo thành công",
      product: newProduct,
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
      .populate("category")
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

// Lấy 1 sản phẩm theo slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isDeleted: false,
    }).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Chi tiết sản phẩm", product });
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
      price: parseFloat(variant.price || 0),
      discountPrice: parseFloat(variant.discountPrice || 0),
      quantity: parseInt(variant.quantity || 0),
      image: req.files[`variants[${index}][image]`]?.[0]?.path || "",
    }));

    const updateData = {
      ...req.body,
      images,
      variants,
    };

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
    });

    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.json({ message: "Cập nhật sản phẩm thành công", product });
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
