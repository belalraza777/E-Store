import Joi from "joi";

// ============================
// VALIDATION SCHEMAS
// ============================

// Register validation schema
const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters",
            "string.max": "Name must be at most 50 characters",
            "any.required": "Name is required",
        }),

    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),

    phone: Joi.string()
        .trim()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .required()
        .messages({
            "string.empty": "Phone number is required",
            "string.pattern.base": "Please provide a valid phone number (E.164 format)",
            "any.required": "Phone number is required",
        }),

    password: Joi.string()
        .min(6)
        .max(100)
        .required()
        .messages({
            "string.empty": "Password is required",
            "string.min": "Password must be at least 6 characters",
            "string.max": "Password must be at most 100 characters",
            "any.required": "Password is required",
        }),

    role: Joi.string()
        .valid("user", "admin")
        .optional()
        .messages({
            "any.only": "Role must be either 'user' or 'admin'",
        }),
});

// Login validation schema
const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.empty": "Email is required",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required",
            "any.required": "Password is required",
        }),
});

// Reset password validation schema
const resetPasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .messages({
            "string.empty": "Old password is required",
            "any.required": "Old password is required",
        }),

    newPassword: Joi.string()
        .min(6)
        .max(100)
        .required()
        .invalid(Joi.ref("oldPassword"))
        .messages({
            "string.empty": "New password is required",
            "string.min": "New password must be at least 6 characters",
            "string.max": "New password must be at most 100 characters",
            "any.required": "New password is required",
            "any.invalid": "New password must be different from old password",
        }),

    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "string.empty": "Confirm password is required",
            "any.required": "Confirm password is required",
            "any.only": "Passwords do not match",
        }),
});

// Create product validation schema
const createProductSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .required()
        .messages({
            "string.empty": "Product title is required",
            "string.min": "Product title must be at least 3 characters",
            "string.max": "Product title must be at most 200 characters",
            "any.required": "Product title is required",
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(5000)
        .required()
        .messages({
            "string.empty": "Product description is required",
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description must be at most 5000 characters",
            "any.required": "Description is required",
        }),

    price: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price must be greater than or equal to 0",
            "any.required": "Price is required",
        }),

    discountPrice: Joi.number()
        .min(0)
        .optional()
        .messages({
            "number.base": "Discount price must be a number",
            "number.min": "Discount price must be greater than or equal to 0",
        }),

    stock: Joi.number()
        .min(0)
        .integer()
        .optional()
        .messages({
            "number.base": "Stock must be a number",
            "number.min": "Stock must be greater than or equal to 0",
            "number.integer": "Stock must be an integer",
        }),

    category: Joi.string()
        .required()
        .messages({
            "string.empty": "Category ID is required",
            "any.required": "Category ID is required",
        }),
});

// Update product validation schema (all fields optional)
const updateProductSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(200)
        .optional()
        .messages({
            "string.min": "Product title must be at least 3 characters",
            "string.max": "Product title must be at most 200 characters",
        }),

    description: Joi.string()
        .trim()
        .min(10)
        .max(5000)
        .optional()
        .messages({
            "string.min": "Description must be at least 10 characters",
            "string.max": "Description must be at most 5000 characters",
        }),

    price: Joi.number()
        .min(0)
        .optional()
        .messages({
            "number.base": "Price must be a number",
            "number.min": "Price must be greater than or equal to 0",
        }),

    discountPrice: Joi.number()
        .min(0)
        .optional()
        .messages({
            "number.base": "Discount price must be a number",
            "number.min": "Discount price must be greater than or equal to 0",
        }),

    stock: Joi.number()
        .min(0)
        .integer()
        .optional()
        .messages({
            "number.base": "Stock must be a number",
            "number.min": "Stock must be greater than or equal to 0",
            "number.integer": "Stock must be an integer",
        }),

    category: Joi.string()
        .optional()
        .messages({
            "string.empty": "Category ID is required",
        }),

    isActive: Joi.boolean()
        .optional()
        .messages({
            "boolean.base": "isActive must be a boolean",
        }),
});



// ============================
// VALIDATION MIDDLEWARE
// ============================

/**
 * Generic validation middleware factory
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @param {string} property - Property of req to validate (default: 'body')
 */
const validate = (schema, property = "body") => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown keys from the validated data
        });

        if (error) {
            // Format error messages
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errorMessages,
            });
        }

        // Replace request body/property with validated and sanitized data
        req[property] = value;
        next();
    };
};

// ============================
// EXPORTED MIDDLEWARE FUNCTIONS
// ============================

export const registerValidation = validate(registerSchema);
export const loginValidation = validate(loginSchema);
export const resetPasswordValidation = validate(resetPasswordSchema);
export const createProductValidation = validate(createProductSchema);
export const updateProductValidation = validate(updateProductSchema);


// Export the validate function for custom validations
export default validate;
