const Joi = require('joi');

const createSessionSchema = Joi.object({
  group_id: Joi.number().integer().required(),
  room_id: Joi.number().integer().required(),
  subject: Joi.string().min(1).max(255).required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().required(),
});

const updateSessionSchema = Joi.object({
  group_id: Joi.number().integer(),
  room_id: Joi.number().integer(),
  subject: Joi.string().min(1).max(255),
  start_time: Joi.date(),
  end_time: Joi.date(),
});

module.exports = {
  createSessionSchema,
  updateSessionSchema,
};
