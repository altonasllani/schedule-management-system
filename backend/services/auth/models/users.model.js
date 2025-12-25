const { pool } = require('../../../shared/db');

/**
 * Krijon një user të ri në PostgreSQL sipas strukturës suaj
 * { name, email, passwordHash }
 */
async function createUser({ name, email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name, email, passwordHash]
  );
  return result.rows[0];
}

/**
 * Gjen user sipas email-it nga PostgreSQL
 */
async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT id, name, email, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Gjen user sipas id-së nga PostgreSQL
 */
async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, name, email, created_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

/**
 * Gjen rolin e user-it nga PostgreSQL (nga tabela userroles)
 */
async function findUserRoleByUserId(userId) {
  const result = await pool.query(
    `SELECT r.name AS role
     FROM userroles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1
     LIMIT 1`,
    [userId]
  );
  return result.rows[0]?.role || null;
}

/**
 * Kthen listën e të gjithë user-ave me rolin e tyre
 */
async function findAllUsersWithRole() {
  const result = await pool.query(
    `SELECT 
       u.id,
       u.name,
       u.email,
       u.created_at,
       COALESCE(r.name, 'student') AS role
     FROM users u
     LEFT JOIN userroles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     ORDER BY u.created_at DESC`
  );
  return result.rows;
}

/**
 * Ndryshon rolin e user-it në PostgreSQL
 */
async function updateUserRole(userId, newRoleName) {
  const roleResult = await pool.query(
    `SELECT id FROM roles WHERE name = $1`,
    [newRoleName]
  );
  const role = roleResult.rows[0];
  
  if (!role) {
    const error = new Error('Roli nuk ekziston');
    error.status = 400;
    throw error;
  }

  // Fshi rolet ekzistuese për këtë user
  await pool.query(
    `DELETE FROM userroles WHERE user_id = $1`,
    [userId]
  );

  // Shto rolin e ri
  await pool.query(
    `INSERT INTO userroles (user_id, role_id)
     VALUES ($1, $2)`,
    [userId, role.id]
  );
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserRoleByUserId,
  findAllUsersWithRole,
  updateUserRole,
};
