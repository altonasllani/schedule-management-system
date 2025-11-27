// validators/index.js
const { courseSchema, validateCourse } = require('./course.schema');
const { professorSchema, validateProfessor } = require('./professor.schema');
const { sessionSchema, validateSession } = require('./session.schema');
const { userSchema, validateUser } = require('./user.schema');
const { roleSchema, validateRole } = require('./role.schema');
const { groupCourseSchema, validateGroupCourse } = require('./group-course.schema');
const { userRoleSchema, validateUserRole } = require('./user-role.schema');

module.exports = {
  // Courses
  courseSchema,
  validateCourse,
  
  // Professors
  professorSchema,
  validateProfessor,
  
  // Sessions
  sessionSchema,
  validateSession,
  
  // Users
  userSchema,
  validateUser,
  
  // Roles
  roleSchema,
  validateRole,
  
  // Group Courses
  groupCourseSchema,
  validateGroupCourse,
  
  // User Roles
  userRoleSchema,
  validateUserRole
};