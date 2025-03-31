const Joi = require("joi");
const Response = require("../helpers/response");

const applyCouponValidator = async (req, res, next) => {
    try {
        const schema = Joi.object({
            couponCode: Joi.string().required().messages({
                "any.required": "Coupon code is required",
                "string.base": "Coupon code must be a string"
            })
        });

        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return Response.errorResponse(req, res, error, 400);
    }
};
const createCouponValidator = async (req, res, next) => {
    try {
      const bodySchema = Joi.object({
        code: Joi.string().trim().required().messages({
          "any.required": "Coupon code is required",
        }),
        discount: Joi.number().positive().required().messages({
          "any.required": "Discount is required",
          "number.positive": "Discount must be a positive number",
        }),
        discountType: Joi.string().valid("PERCENTAGE", "FIXED").required().messages({
          "any.required": "Discount type is required",
          "any.only": "Discount type must be 'PERCENTAGE' or 'FIXED'",
        }),
        minPurchase: Joi.number().positive().optional().messages({
          "number.positive": "Minimum purchase amount must be a positive number",
        }),
        expiresAt: Joi.date().iso().required().messages({
          "any.required": "Expiry date is required",
          "date.format": "Expiry date must be a valid ISO date",
        }),
        usageLimit: Joi.number().integer().min(1).optional().messages({
          "number.min": "Usage limit must be at least 1",
        }),
      });
  
      await bodySchema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      return Response.errorResponse(req, res, error, 400);
    }
  };
  
  /** Get Coupon By Code Validator */
  const getCouponByCodeValidator = async (req, res, next) => {
    try {
      const paramsSchema = Joi.object({
        code: Joi.string().trim().required().messages({
          "any.required": "Coupon code is required",
        }),
      });
  
      await paramsSchema.validateAsync(req.params);
      next();
    } catch (error) {
      console.log(error);
      return Response.errorResponse(req, res, error, 400);
    }
  };
  
  /** Delete Coupon Validator */
  const deleteCouponValidator = async (req, res, next) => {
    try {
      const paramsSchema = Joi.object({
        couponId: Joi.string().trim().required().messages({
          "any.required": "Coupon ID is required",
        }),
      });
  
      await paramsSchema.validateAsync(req.params);
      next();
    } catch (error) {
      console.log(error);
      return Response.errorResponse(req, res, error, 400);
    }
  };



/** Update Coupon Validator */
const updateCouponValidator = async (req, res, next) => {
    try {
        const paramsSchema = Joi.object({
            couponId: Joi.string().trim().required().messages({
                "any.required": "Coupon ID is required",
            }),
        });

        const bodySchema = Joi.object({
            code: Joi.string().trim().optional(),
            discount: Joi.number().positive().optional(),
            discountType: Joi.string().valid("PERCENTAGE", "FIXED").optional(),
            minPurchase: Joi.number().positive().optional(),
            expiresAt: Joi.date().iso().optional(),
            usageLimit: Joi.number().integer().min(1).optional(),
        }).min(1).messages({
            "object.min": "At least one field must be updated",
        });

        await paramsSchema.validateAsync(req.params);
        await bodySchema.validateAsync(req.body);
        next();
    } catch (error) {
        console.log(error);
        return Response.errorResponse(req, res, error, 400);
    }
};

  


module.exports = {
    createCouponValidator,
  getCouponByCodeValidator,
  deleteCouponValidator,
  applyCouponValidator,
  updateCouponValidator
};
