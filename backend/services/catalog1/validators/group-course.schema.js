const Joi = require('joi');

const groupCourseSchema = Joi.object({
  group_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Group ID must be a number',
      'number.positive': 'Group ID must be a positive number',
      'any.required': 'Group ID is required'
    }),
  course_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Course ID must be a number',
      'number.positive': 'Course ID must be a positive number',
      'any.required': 'Course ID is required'
    })
});

const validateGroupCourse = (data) => {
  return groupCourseSchema.validate(data, { abortEarly: false });
};

module.exports = {
  groupCourseSchema,
  validateGroupCourse
};