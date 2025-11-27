const request = require('supertest');
const app = require('../index'); // Import app nga index.js kryesor
const { Pool } = require('pg');

// Test database connection
const testPool = new Pool({
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DB || 'sms_test',
  port: process.env.PG_PORT || 5432,
});

describe('Courses API', () => {
  beforeAll(async () => {
    // Clean up test data before tests
    await testPool.query('DELETE FROM courses WHERE name LIKE $1', ['Test Course%']);
  });

  afterAll(async () => {
    // Clean up after all tests
    await testPool.query('DELETE FROM courses WHERE name LIKE $1', ['Test Course%']);
    await testPool.end();
  });

  describe('GET /api/courses', () => {
    it('should return all courses', async () => {
      const res = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return courses in correct order', async () => {
      const res = await request(app)
        .get('/api/courses')
        .expect(200);

      // Check if courses are ordered by id
      const courses = res.body;
      for (let i = 1; i < courses.length; i++) {
        expect(courses[i].id).toBeGreaterThan(courses[i - 1].id);
      }
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should return a course by id', async () => {
      // First create a test course
      const createRes = await request(app)
        .post('/api/courses')
        .send({ name: 'Test Course for GET' })
        .expect(201);

      const courseId = createRes.body.id;

      const res = await request(app)
        .get(`/api/courses/${courseId}`)
        .expect(200);

      expect(res.body.id).toBe(courseId);
      expect(res.body.name).toBe('Test Course for GET');
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app)
        .get('/api/courses/99999')
        .expect(404);

      expect(res.body.error).toBe('Course not found');
    });
  });

  describe('POST /api/courses', () => {
    it('should create a new course', async () => {
      const courseData = {
        name: 'Test Course Creation'
      };

      const res = await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(201);

      expect(res.body.name).toBe(courseData.name);
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({})
        .expect(400);

      expect(res.body.error).toBe('Name is required');
    });

    it('should return 400 for short name', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({ name: 'A' })
        .expect(400);

      expect(res.body.error).toBe('Name must be at least 2 characters long');
    });

    it('should return 400 for very long name', async () => {
      const longName = 'A'.repeat(101);
      const res = await request(app)
        .post('/api/courses')
        .send({ name: longName })
        .expect(400);

      expect(res.body.error).toBe('Name must be less than 100 characters');
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update an existing course', async () => {
      // First create a course
      const createRes = await request(app)
        .post('/api/courses')
        .send({ name: 'Test Course Before Update' })
        .expect(201);

      const courseId = createRes.body.id;

      const updateData = {
        name: 'Test Course After Update'
      };

      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.id).toBe(courseId);
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app)
        .put('/api/courses/99999')
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(res.body.error).toBe('Course not found');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete a course', async () => {
      // First create a course
      const createRes = await request(app)
        .post('/api/courses')
        .send({ name: 'Test Course for Deletion' })
        .expect(201);

      const courseId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/courses/${courseId}`)
        .expect(200);

      expect(res.body.message).toBe('Course deleted successfully');
      expect(res.body.deleted.id).toBe(courseId);

      // Verify it's actually deleted
      const getRes = await request(app)
        .get(`/api/courses/${courseId}`)
        .expect(404);
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app)
        .delete('/api/courses/99999')
        .expect(404);

      expect(res.body.error).toBe('Course not found');
    });
  });
});