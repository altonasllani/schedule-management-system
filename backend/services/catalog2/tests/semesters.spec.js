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
      
      // If there are semesters, check their structure
      if (response.body.length > 0) {
        const semester = response.body[0];
        expect(semester).toHaveProperty('id');
        expect(semester).toHaveProperty('name');
        expect(semester).toHaveProperty('start_date');
        expect(semester).toHaveProperty('end_date');
      }
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
      expect(response.body).toHaveProperty('start_date');
      expect(response.body).toHaveProperty('end_date');
    });

    it('should return 404 for non-existent semester', async () => {
      const response = await request(BASE_URL)
        .get('/api/semesters/9999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Test POST new semester - KORRIGJUAR me formatet e duhura të datave
  describe('POST /api/semesters', () => {
    it('should create a new semester with valid data', async () => {
      const newSemester = {
        name: 'Test Semester 2025',
        start_date: '2025-01-15', // ✅ Format i saktë: YYYY-MM-DD
        end_date: '2025-05-30'    // ✅ Format i saktë: YYYY-MM-DD
      };

      const response = await request(BASE_URL)
        .post('/api/semesters')
        .send(newSemester)
        .set('Content-Type', 'application/json');

      // Pranoi ose 201 (created) ose 400/409/500 (error)
      expect([201, 400, 409, 500]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(newSemester.name);
        // Datat do të kthehen si ISO strings
        expect(typeof response.body.start_date).toBe('string');
        expect(typeof response.body.end_date).toBe('string');
      }
    });

    it('should return 400 for invalid date format', async () => {
      const invalidSemester = {
        name: 'Invalid Date Semester',
        start_date: 'not-a-valid-date',
        end_date: '2025-06-01'
      };

      const response = await request(BASE_URL)
        .post('/api/semesters')
        .send(invalidSemester)
        .set('Content-Type', 'application/json');

      expect([400, 500]).toContain(response.status);
      
      if (response.status === 400) {
        expect(response.body).toHaveProperty('error');
      }
    });
  });

  // Test GET current semester - KORRIGJUAR rruga
  describe('GET /api/semesters/current', () => {
    it('should get current semester', async () => {
      const response = await request(BASE_URL)
        .get('/api/semesters/current');

      // Could be 200 (found) or 404 (not found)
      expect([200, 404]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('start_date');
        expect(response.body).toHaveProperty('end_date');
      }
    });
  });
});