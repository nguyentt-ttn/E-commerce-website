const Joi = require("joi");
const mongoose = require("mongoose");

const variantSchema = Joi.object({
  sku: Joi.string().required().messages({
    "string.empty": "SKU không được để trống",
    "any.required": "SKU là bắt buộc",
  }),
  color: Joi.string().optional().allow(null, ""),
  size: Joi.string().optional().allow(null, ""),
  price: Joi.number().min(0).optional().messages({
    "number.base": "Giá phải là một số",
    "number.min": "Giá không được nhỏ hơn 0",
  }),
  discountPrice: Joi.number().min(0).optional().messages({
    "number.base": "Giá giảm phải là một số",
    "number.min": "Giá giảm không được nhỏ hơn 0",
  }),
  image: Joi.string().uri().optional().allow(null, ""),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Số lượng phải là một số nguyên",
    "number.min": "Số lượng không được nhỏ hơn 0",
    "any.required": "Số lượng là bắt buộc",
  }),
});

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  brand: Joi.string().optional().allow(""),
  category: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  basePrice: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  isActive: Joi.boolean().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  brand: Joi.string().optional().allow(""),
  category: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  basePrice: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
