const Joi = require("joi");
const Response = require("../helpers/response"); // Ensure you have this for error handling

/** Create Cart Validator */
const createCartValidator = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            userId: Joi.string().required().messages({
                "any.required": "User ID is required",
                "string.base": "User ID must be a string",
            }),
            products: Joi.array()
                .items(
                    Joi.object({
                        productId: Joi.string().required().messages({
                            "any.required": "Product ID is required",
                            "string.base": "Product ID must be a string",
                        }),
                        quantity: Joi.number().integer().min(1).required().messages({
                            "any.required": "Quantity is required",
                            "number.base": "Quantity must be a number",
                            "number.min": "Quantity must be at least 1",
                        }),
                    })
                )
                .min(1)
                .required()
                .messages({
                    "any.required": "Products array is required",
                    "array.min": "At least one product is required",
                }),
        });

        await bodySchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, error, 400);
    }
};

/** Update Cart Validator */
const updateCartValidator = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            products: Joi.array()
                .items(
                    Joi.object({
                        productId: Joi.string().required().messages({
                            "any.required": "Product ID is required",
                            "string.base": "Product ID must be a string",
                        }),
                        quantity: Joi.number().integer().min(1).required().messages({
                            "any.required": "Quantity is required",
                            "number.base": "Quantity must be a number",
                            "number.min": "Quantity must be at least 1",
                        }),
                    })
                )
                .min(1)
                .required()
                .messages({
                    "any.required": "Products array is required",
                    "array.min": "At least one product is required",
                }),
        });

        await bodySchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, error, 400);
    }
};

const addProductValidator = async (req, res, next) => {
    try {
        const bodySchema = Joi.object({
            productId: Joi.string().required().messages({
                "any.required": "Product ID is required",
                "string.base": "Product ID must be a string",
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                "any.required": "Quantity is required",
                "number.base": "Quantity must be a number",
                "number.min": "Quantity must be at least 1",
            }),
        });

        await bodySchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.error(error);
        return Response.errorResponse(req, res, error, 400);
    }
};

module.exports = {
    createCartValidator,
    updateCartValidator,
    addProductValidator
};
