// backend/shared/validate.js

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  // merr të gjitha gabimet, jo vetëm të parën
      stripUnknown: true, // largon fushat që nuk janë në schema
    });

    if (error) {
      const details = error.details.map((d) => d.message);

      return res.status(400).json({
        error: 'Validation error',
        details,
      });
    }

    // ruajmë versionin e pastruar të body-t
    req.body = value;
    next();
  };
}

module.exports = {
  validate,
};
