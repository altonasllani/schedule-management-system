const Joi = require('joi');

const userRoleSchema = Joi.object({
  user_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'User ID must be a number',
      'number.positive': 'User ID must be a positive number',
      'any.required': 'User ID is required'
    }),
  role_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Role ID must be a number',
      'number.positive': 'Role ID must be a positive number',
      'any.required': 'Role ID is required'
    })
});

const validateUserRole = (data) => {
  return userRoleSchema.validate(data, { abortEarly: false });
};

module.exports = {
  userRoleSchema,
  validateUserRole
};