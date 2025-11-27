const request = require('supertest');

const BASE_URL = 'http://localhost:3007';

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(BASE_URL)
      .get('/api/health')
      .expect(200);

    expect(response.body).toEqual({
      status: 'ok',
      service: 'catalog2',
      timestamp: expect.any(String),
      environment: expect.any(String)
    });
  });

  it('should return correct service name', async () => {
    const response = await request(BASE_URL)
      .get('/api/health')
      .expect(200);

    expect(response.body.service).toBe('catalog2');
    expect(response.body.status).toBe('ok');
  });

  it('should include timestamp in response', async () => {
    const response = await request(BASE_URL)
      .get('/api/health')
      .expect(200);

    // Check if timestamp is valid ISO string
    const timestamp = new Date(response.body.timestamp);
    expect(timestamp instanceof Date).toBe(true);
    expect(isNaN(timestamp.getTime())).toBe(false);
  });
});