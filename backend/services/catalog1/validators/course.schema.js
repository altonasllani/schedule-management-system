const Joi = require('joi');

const courseSchema = Joi.object({
  name: Joi.string().min(2).max(100).trim().required()
    .messages({
      'string.empty': 'Course name is required',
      'string.min': 'Course name must be at least 2 characters long',
      'string.max': 'Course name must be less than 100 characters',
      'any.required': 'Course name is required'
    })
});

const validateCourse = (data) => {
  return courseSchema.validate(data, { abortEarly: false });
};

module.exports = {
  courseSchema,
  validateCourse
};