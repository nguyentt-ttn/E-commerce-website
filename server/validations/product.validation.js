const Joi = require("joi");
const mongoose = require("mongoose");

const variantSchema = Joi.object({
  sku: Joi.string().required(),
  color: Joi.string().optional().allow(null, ''),
  size: Joi.string().optional().allow(null, ''),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  image: Joi.string().uri().optional().allow(null, ''),
  quantity: Joi.number().integer().min(0).required()
});

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  brand: Joi.string().optional().allow(''),
  category: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  basePrice: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  isActive: Joi.boolean().optional()
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  brand: Joi.string().optional().allow(''),
  category: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  basePrice: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  variants: Joi.array().items(variantSchema).optional(),
  isActive: Joi.boolean().optional()
});

module.exports = {
  createProductSchema,
  updateProductSchema
};
