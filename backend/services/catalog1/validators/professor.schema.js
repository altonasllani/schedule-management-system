const Joi = require('joi');

const professorSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required()
    .messages({
      'string.empty': 'Professor name is required',
      'string.min': 'Professor name must be at least 2 characters long',
      'string.max': 'Professor name must be less than 100 characters',
      'any.required': 'Professor name is required'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    })
});

const validateProfessor = (data) => {
  return professorSchema.validate(data, { abortEarly: false });
};

module.exports = {
  professorSchema,
  validateProfessor
};