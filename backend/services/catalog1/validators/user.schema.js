const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required()
    .messages({
      'string.empty': 'User name is required',
      'string.min': 'User name must be at least 2 characters long',
      'string.max': 'User name must be less than 100 characters',
      'any.required': 'User name is required'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),
  password_hash: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

module.exports = {
  userSchema,
  validateUser
};