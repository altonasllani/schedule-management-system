const Joi = require('joi');

const roleSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required()
    .messages({
      'string.empty': 'Role name is required',
      'string.min': 'Role name must be at least 2 characters long',
      'string.max': 'Role name must be less than 50 characters',
      'any.required': 'Role name is required'
    })
});

const validateRole = (data) => {
  return roleSchema.validate(data, { abortEarly: false });
};

module.exports = {
  roleSchema,
  validateRole
};