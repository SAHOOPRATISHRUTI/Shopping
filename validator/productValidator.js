const Joi = require("joi");

/** Create Product Validator */
const createProductValidator = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      name: Joi.string().trim().required().messages({
        "any.required": "Product name is required",
      }),
      price: Joi.number().positive().required().messages({
        "any.required": "Price is required",
        "number.positive": "Price must be a positive number",
      }),
      description: Joi.string().trim().optional(),
      category: Joi.string().trim().required().messages({
        "any.required": "Category is required",
      }),
      stock: Joi.number().integer().min(0).default(0).messages({
        "number.min": "Stock cannot be negative",
      }),
      image: Joi.string().optional(),
    });

    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Response.errorResponse(req, res, error, 400);
  }
};

/** Get Product by ID Validator */
const getProductByIdValidator = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.string().trim().required().messages({
        "any.required": "Product ID is required",
      }),
    });

    await paramsSchema.validateAsync(req.params);
    next();
  } catch (error) {
    console.log(error);
    return Response.errorResponse(req, res, error, 400);
  }
};

/** Update Product Validator */
const updateProductValidator = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.string().trim().required().messages({
        "any.required": "Product ID is required",
      }),
    });

    const bodySchema = Joi.object({
      name: Joi.string().trim().optional(),
      price: Joi.number().positive().optional(),
      description: Joi.string().trim().optional(),
      category: Joi.string().trim().optional(),
      stock: Joi.number().integer().min(0).optional(),
      image: Joi.string().optional(),
    });

    await paramsSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    return Response.errorResponse(req, res, error, 400);
  }
};

/** Delete Product Validator */
const deleteProductValidator = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.string().trim().required().messages({
        "any.required": "Product ID is required",
      }),
    });

    await paramsSchema.validateAsync(req.params);
    next();
  } catch (error) {
    console.log(error);
    return Response.errorResponse(req, res, error, 400);
  }
};

module.exports = {
  createProductValidator,
  getProductByIdValidator,
  updateProductValidator,
  deleteProductValidator,
};
