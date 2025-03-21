const Joi = require("joi");
const Responses = require("../helpers/response");
// const { errorLog } = require("../middlewares/errorLog");

// Regular expression for allowed input formats
const regularExpression = /^[0-9a-zA-Z .,:;()/\-_]+$/;

/** Authentication Validator Middleware */
const authValidator = async (req, res, next) => {
  try {
    /** Header Schema Validation */
    // const headerSchema = Joi.object({
    //   authorization: Joi.string().required().messages({
    //     "any.required": "Authorization header is required",
    //   }),
    //   ip: Joi.string().optional(),
    // }).unknown(true); // Allow additional headers

    /** Body Schema Validation */
    const bodySchema = Joi.object({
      name: Joi.string()
        .trim()
        .pattern(regularExpression)
        
        .messages({
          "any.required": "Name is required",
          "string.pattern.base": "Name contains invalid characters",
        }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.email": "Invalid email format",
          "any.required": "Email is required",
        }),
      password: Joi.string()
        .min(6)
        .required()
        .messages({
          "any.required": "Password is required",
          "string.min": "Password must be at least 6 characters",
        }),
      role: Joi.string()
        .valid("admin", "user")
        .required()
        .messages({
          "any.only": "Invalid role, must be 'admin' or 'user'",
        }),
    });

    // Validate Headers
    // await headerSchema.validateAsync(req.headers, { abortEarly: false });

    // Validate Body
    await bodySchema.validateAsync(req.body, { abortEarly: false });

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    console.log("Validation Error:", error);
    // errorLog(error);

    return Responses.errorResponse(req, res, error, 400);
  }
};

module.exports = authValidator;

