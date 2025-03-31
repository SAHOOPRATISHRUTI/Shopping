const Joi = require("joi");

const regularExpression = /^[0-9a-zA-Z .,:;()/\-_]+$/;

/** Register Validator */
const userRegisterValidator = async (req, res, next) => {

  try {
    const headerSchema = Joi.object({
      headers: Joi.object({
        // authorization: Joi.required(),
        ip: Joi.string(),
      }).unknown(true),
    });
    const bodySchema = Joi.object({
      name: Joi.string()
        .trim()
        .pattern(regularExpression)
        .required()
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
    await headerSchema.validateAsync({ headers: req.headers });
    await bodySchema.validateAsync(req.body);
    next();
  } catch (error) {
    console.log(error);
    // errorLog(error);
    return Responses.errorResponse(req, res, error, 200);
  }
}



const loginValidatorSchema = async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
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
    });

    await bodySchema.validateAsync(req.body);
    next(); 
  } catch (error) {
    console.error("Validation Error:", error);
    return Response.errorResponse(req, res, error, 400); 
  }
};

module.exports = {
  userRegisterValidator,
  loginValidatorSchema,
};
