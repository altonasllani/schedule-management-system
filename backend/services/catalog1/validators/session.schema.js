const Joi = require('joi');

const sessionSchema = Joi.object({
  course_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Course ID must be a number',
      'number.positive': 'Course ID must be a positive number',
      'any.required': 'Course ID is required'
    }),
  group_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Group ID must be a number',
      'number.positive': 'Group ID must be a positive number',
      'any.required': 'Group ID is required'
    }),
  room_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Room ID must be a number',
      'number.positive': 'Room ID must be a positive number',
      'any.required': 'Room ID is required'
    }),
  professor_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Professor ID must be a number',
      'number.positive': 'Professor ID must be a positive number',
      'any.required': 'Professor ID is required'
    }),
  semester_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Semester ID must be a number',
      'number.positive': 'Semester ID must be a positive number',
      'any.required': 'Semester ID is required'
    }),
  day_of_week: Joi.number().integer().min(1).max(7).required()
    .messages({
      'number.base': 'Day of week must be a number',
      'number.min': 'Day of week must be between 1 and 7',
      'number.max': 'Day of week must be between 1 and 7',
      'any.required': 'Day of week is required'
    }),
  start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM format',
      'any.required': 'Start time is required'
    }),
  end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'End time must be in HH:MM format',
      'any.required': 'End time is required'
    }),
  week_type: Joi.string().valid('all', 'even', 'odd').default('all')
    .messages({
      'any.only': 'Week type must be one of: all, even, odd'
    })
}).custom((obj, helpers) => {
  if (obj.start_time && obj.end_time && obj.start_time >= obj.end_time) {
    return helpers.error('any.custom', { message: 'Start time must be before end time' });
  }
  return obj;
});

const validateSession = (data) => {
  return sessionSchema.validate(data, { abortEarly: false });
};

module.exports = {
  sessionSchema,
  validateSession
};