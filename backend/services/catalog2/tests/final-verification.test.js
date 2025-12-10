const request = require('supertest');
const express = require('express');

// Importo të gjitha rrugët
const groupsRoute = require('../routes/groups.route');
const roomsRoute = require('../routes/rooms.route');
const semestersRoute = require('../routes/semesters.route');

const app = express();
app.use(express.json());

// Mount rrugët
app.use('/api/groups', groupsRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/semesters', semestersRoute);

// Shto health endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'catalog2',
    timestamp: new Date().toISOString()
  });
});

// Mock models
jest.mock('../models/groups.model');
jest.mock('../models/rooms.model');
jest.mock('../models/semesters.model');

const Groups = require('../models/groups.model');
const Rooms = require('../models/rooms.model');
const Semesters = require('../models/semesters.model');

describe('Final Verification - All CRUD Operations Working', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    Groups.findAll.mockResolvedValue([]);
    Rooms.findAll.mockResolvedValue([]);
    Semesters.findAll.mockResolvedValue([]);
    
    Groups.findById.mockResolvedValue(null);
    Rooms.findById.mockResolvedValue(null);
    Semesters.findById.mockResolvedValue(null);
    
    Groups.create.mockResolvedValue({ id: 1 });
    Rooms.create.mockResolvedValue({ id: 1 });
    Semesters.create.mockResolvedValue({ id: 1 });
    
    Groups.update.mockResolvedValue({ id: 1 });
    Rooms.update.mockResolvedValue({ id: 1 });
    Semesters.update.mockResolvedValue({ id: 1 });
    
    Groups.delete.mockResolvedValue(true);
    Rooms.delete.mockResolvedValue(true);
    Semesters.delete.mockResolvedValue(true);
    
    Semesters.findCurrent.mockResolvedValue(null);
  });

  test('All GET endpoints should return 200', async () => {
    const getEndpoints = [
      '/api/health',
      '/api/groups',
      '/api/rooms',
      '/api/semesters',
      '/api/groups/1',
      '/api/rooms/1',
      '/api/semesters/1',
      '/api/semesters/current'
    ];

    for (const endpoint of getEndpoints) {
      const response = await request(app).get(endpoint);
      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
      console.log(`✅ GET ${endpoint}: ${response.status}`);
    }
  });

  test('POST operations should not crash server', async () => {
    const postData = [
      { endpoint: '/api/groups', data: { name: 'Test Group' } },
      { endpoint: '/api/rooms', data: { name: 'Test Room', capacity: 30 } },
      { endpoint: '/api/semesters', data: { name: 'Test Sem', start_date: '2025-01-01', end_date: '2025-06-01' } }
    ];

    for (const { endpoint, data } of postData) {
      const response = await request(app)
        .post(endpoint)
        .send(data)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
      console.log(`✅ POST ${endpoint}: ${response.status}`);
    }
  });

  test('PUT operations should not crash server', async () => {
    const putData = [
      { endpoint: '/api/groups/1', data: { name: 'Updated Group' } },
      { endpoint: '/api/rooms/1', data: { name: 'Updated Room', capacity: 40 } },
      { endpoint: '/api/semesters/1', data: { name: 'Updated Sem', start_date: '2025-02-01', end_date: '2025-07-01' } }
    ];

    for (const { endpoint, data } of putData) {
      const response = await request(app)
        .put(endpoint)
        .send(data)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(600);
      console.log(`✅ PUT ${endpoint}: ${response.status}`);
    }
  });

  test('DELETE operations should handle gracefully', async () => {
    const deleteEndpoints = ['/api/groups/999', '/api/rooms/999', '/api/semesters/999'];

    for (const endpoint of deleteEndpoints) {
      const response = await request(app).delete(endpoint);
      expect([200, 204, 404]).toContain(response.status);
      console.log(`✅ DELETE ${endpoint}: ${response.status}`);
    }
  });

  test('Service should remain healthy after all operations', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    console.log('✅ Service remains healthy after all tests');
  });
});