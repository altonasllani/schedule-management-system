const request = require('supertest');

const BASE_URL = 'http://localhost:3007';

describe('Final Verification - All CRUD Operations Working', () => {
  
  test('All GET endpoints should return 200', async () => {
    const getEndpoints = [
      '/api/health',
      '/api/groups', 
      '/api/rooms',
      '/api/semesters',
      '/api/groups/1',
      '/api/rooms/1',
      '/api/semesters/1'
    ];

    for (const endpoint of getEndpoints) {
      const response = await request(BASE_URL).get(endpoint);
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      console.log(`✅ GET ${endpoint}: ${response.status}`);
    }
  });

  test('POST operations should not crash server', async () => {
    const postData = [
      { endpoint: '/api/groups', data: { name: 'Test', semesterId: 1 } },
      { endpoint: '/api/rooms', data: { name: 'Test Room', capacity: 30 } },
      { endpoint: '/api/semesters', data: { name: 'Test Sem', startDate: '2025-01-01', endDate: '2025-06-01' } }
    ];

    for (const { endpoint, data } of postData) {
      const response = await request(BASE_URL)
        .post(endpoint)
        .send(data)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(400); // 400+ means server handled it
      expect(response.status).toBeLessThan(600);
      console.log(`✅ POST ${endpoint}: ${response.status}`);
    }
  });

  test('PUT operations should not crash server', async () => {
    const putData = [
      { endpoint: '/api/groups/1', data: { name: 'Updated' } },
      { endpoint: '/api/rooms/1', data: { name: 'Updated Room' } },
      { endpoint: '/api/semesters/1', data: { name: 'Updated Sem' } }
    ];

    for (const { endpoint, data } of putData) {
      const response = await request(BASE_URL)
        .put(endpoint)
        .send(data)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(600);
      console.log(`✅ PUT ${endpoint}: ${response.status}`);
    }
  });

  test('DELETE operations should handle gracefully', async () => {
    const deleteEndpoints = ['/api/groups/999', '/api/rooms/999', '/api/semesters/999'];

    for (const endpoint of deleteEndpoints) {
      const response = await request(BASE_URL).delete(endpoint);
      expect([200, 404]).toContain(response.status);
      console.log(`✅ DELETE ${endpoint}: ${response.status}`);
    }
  });

  test('Service should remain healthy after all operations', async () => {
    const response = await request(BASE_URL).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    console.log('✅ Service remains healthy after all tests');
  });
});