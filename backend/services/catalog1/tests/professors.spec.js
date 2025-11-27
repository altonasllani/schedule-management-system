const request = require('supertest');
const app = require('../index');

describe('Professors API', () => {
  let testProfessorId;

  beforeAll(async () => {
    // Clean up test data
    const pool = new Pool({
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DB || 'sms_test',
      port: process.env.PG_PORT || 5432,
    });
    
    await pool.query('DELETE FROM professors WHERE email LIKE $1', ['%test%']);
    await pool.end();
  });

  describe('GET /api/professors', () => {
    it('should return all professors', async () => {
      const res = await request(app)
        .get('/api/professors')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/professors', () => {
    it('should create a new professor', async () => {
      const professorData = {
        name: 'Test Professor',
        email: 'test.professor@university.edu'
      };

      const res = await request(app)
        .post('/api/professors')
        .send(professorData)
        .expect(201);

      expect(res.body.name).toBe(professorData.name);
      expect(res.body.email).toBe(professorData.email);
      expect(res.body.id).toBeDefined();

      testProfessorId = res.body.id;
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/professors')
        .send({
          name: 'Test Professor',
          email: 'invalid-email'
        })
        .expect(400);

      expect(res.body.error).toBe('Invalid email format');
    });

    it('should return 400 for short name', async () => {
      const res = await request(app)
        .post('/api/professors')
        .send({
          name: 'A',
          email: 'test@university.edu'
        })
        .expect(400);

      expect(res.body.error).toBe('Name must be at least 2 characters long');
    });
  });

  describe('GET /api/professors/:id', () => {
    it('should return professor by id', async () => {
      const res = await request(app)
        .get(`/api/professors/${testProfessorId}`)
        .expect(200);

      expect(res.body.id).toBe(testProfessorId);
    });

    it('should return 404 for non-existent professor', async () => {
      const res = await request(app)
        .get('/api/professors/99999')
        .expect(404);

      expect(res.body.error).toBe('Professor not found');
    });
  });

  describe('PUT /api/professors/:id', () => {
    it('should update professor', async () => {
      const updateData = {
        name: 'Updated Test Professor',
        email: 'updated.test@university.edu'
      };

      const res = await request(app)
        .put(`/api/professors/${testProfessorId}`)
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.email).toBe(updateData.email);
    });
  });

  describe('DELETE /api/professors/:id', () => {
    it('should delete professor', async () => {
      const res = await request(app)
        .delete(`/api/professors/${testProfessorId}`)
        .expect(200);

      expect(res.body.message).toBe('Professor deleted successfully');
    });
  });
});