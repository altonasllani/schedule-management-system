// backend/services/auth/validators/user.schema.js
const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('admin', 'professor', 'student').required(),
});

module.exports = {
  registerSchema,
  updateRoleSchema,
};
