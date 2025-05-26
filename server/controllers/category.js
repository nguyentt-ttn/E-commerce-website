const Category = require("../models/Category");
const Product = require("../models/Product");
const slugify = require("../utils/slugify");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validations/category.validation");

//Tạo danh mục
exports.createCategory = async (req, res) => {
  try {
    const { error } = createCategorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessage = error.details.map((message) => message.message);
      return res.json(errorMessage);
    }

    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Tên danh mục đã tồn tại" });
    }

    const slug = slugify(name);
    const category = await Category.create({ name, slug });
    res.status(201).json({ message: "Tạo danh mục thành công", category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Tên hoặc slug đã tồn tại" });
    }
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả danh mục có phân trang
exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Tổng số danh mục để tính tổng trang
    const total = await Category.countDocuments();

    // Truy vấn có phân trang
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Lấy danh mục thành công",
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết danh mục theo slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category)
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    res.json({ message: "Lấy danh mục theo slug thành công", category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { error } = updateCategorySchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessage = error.details.map((message) => message.message);
      return res.json(errorMessage);
    }

    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Tên danh mục đã tồn tại" });
    }

    const slug = slugify(name);
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    res.json({ message: "Cập nhật danh mục thành công", category: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
    const relatedProducts = await Product.findOne({ category: categoryId });

    if (relatedProducts) {
      return res.status(400).json({
        error:
          "Không thể xóa danh mục vì đang có sản phẩm liên kết với danh mục này.",
      });
    }

    const deleted = await Category.findByIdAndDelete(categoryId);

    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy danh mục" });
    }

    res.json({
      message: "Xóa danh mục thành công",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
