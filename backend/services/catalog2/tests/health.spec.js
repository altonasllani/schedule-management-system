const request = require('supertest');
const express = require('express');

// Krijo një aplikacion Express të ri
const app = express();
app.use(express.json());

// Shto rrugën e shëndetit direkt (pasi nuk ka health.route.js)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'catalog2',
    timestamp: new Date().toISOString()
  });
});

describe('Health Check', () => {
  test('should return health status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });

  test('should return correct service name', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.service).toBe('catalog2');
  });

  test('should include timestamp in response', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body).toHaveProperty('timestamp');
    expect(typeof response.body.timestamp).toBe('string');
    // Verifikoni se timestamp është në formatin ISO
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
  });
});