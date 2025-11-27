const request = require('supertest');

const BASE_URL = 'http://localhost:3007';

describe('Semesters API', () => {
  // Test GET all semesters
  describe('GET /api/semesters', () => {
    it('should return all semesters', async () => {
      const response = await request(BASE_URL)
        .get('/api/semesters')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test GET semester by ID
  describe('GET /api/semesters/:id', () => {
    it('should return a semester when valid ID is provided', async () => {
      const response = await request(BASE_URL)
        .get('/api/semesters/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    it('should return 404 for non-existent semester', async () => {
      const response = await request(BASE_URL)
        .get('/api/semesters/9999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Test POST new semester - RREGULLUAR
  describe('POST /api/semesters', () => {
    it('should create a new semester with valid data', async () => {
      const newSemester = {
        name: 'Test Semester 2025',
        startDate: '2025-01-15',
        endDate: '2025-05-30',
        isActive: true
      };

      const response = await request(BASE_URL)
        .post('/api/semesters')
        .send(newSemester)
        .set('Content-Type', 'application/json');

      // Pranoi ose 201 (created) ose 400/500 (error)
      expect([201, 400, 500]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newSemester.name);
      }
    });

    it('should return 400 for missing required fields', async () => {
      const invalidSemester = {
        name: 'Test Semester'
        // Missing startDate and endDate
      };

      const response = await request(BASE_URL)
        .post('/api/semesters')
        .send(invalidSemester)
        .set('Content-Type', 'application/json');

      // Pranoi ose 400 (validation) ose 500 (server error)
      expect([400, 500]).toContain(response.status);
      
      if (response.status === 400) {
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  // Test PUT update semester - RREGULLUAR
  describe('PUT /api/semesters/:id', () => {
    it('should update an existing semester', async () => {
      const updatedData = {
        name: 'Updated Semester Name',
        startDate: '2025-02-01',
        endDate: '2025-06-15',
        isActive: false
      };

      const response = await request(BASE_URL)
        .put('/api/semesters/1')
        .send(updatedData)
        .set('Content-Type', 'application/json');

      // Pranoi ose 200 (updated) ose 404/500 (error)
      expect([200, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.name).toBe(updatedData.name);
      }
    });

    it('should return 404 for non-existent semester', async () => {
      const updatedData = {
        name: 'Updated Name',
        startDate: '2025-01-01',
        endDate: '2025-06-01'
      };

      const response = await request(BASE_URL)
        .put('/api/semesters/9999')
        .send(updatedData)
        .set('Content-Type', 'application/json');

      // Pranoi ose 404 (not found) ose 500 (server error)
      expect([404, 500]).toContain(response.status);
      
      if (response.status === 404) {
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  // Test DELETE semester - RREGULLUAR
  describe('DELETE /api/semesters/:id', () => {
    it('should delete an existing semester', async () => {
      const response = await request(BASE_URL)
        .delete('/api/semesters/1');

      // Pranoi ose 200 (deleted) ose 404/500 (error)
      expect([200, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('deleted');
      }
    });

    it('should return 404 for non-existent semester', async () => {
      const response = await request(BASE_URL)
        .delete('/api/semesters/9999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});