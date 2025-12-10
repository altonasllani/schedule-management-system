const request = require('supertest');
const express = require('express');

// Importo rrugët
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

describe('Operators API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    Groups.findAll.mockResolvedValue([]);
    Rooms.findAll.mockResolvedValue([]);
    Semesters.findAll.mockResolvedValue([]);
    Semesters.findCurrent.mockResolvedValue(null);
  });

  describe('GET /api/health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('catalog2');
    });
  });

  describe('GET /api/groups', () => {
    test('should return groups list', async () => {
      const mockGroups = [
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' }
      ];
      Groups.findAll.mockResolvedValue(mockGroups);

      const response = await request(app).get('/api/groups');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGroups);
    });
  });

  describe('GET /api/rooms', () => {
    test('should return rooms list', async () => {
      const mockRooms = [
        { id: 1, name: 'Room 101', capacity: 30 },
        { id: 2, name: 'Room 102', capacity: 40 }
      ];
      Rooms.findAll.mockResolvedValue(mockRooms);

      const response = await request(app).get('/api/rooms');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRooms);
    });
  });

  describe('GET /api/semesters', () => {
    test('should return semesters list', async () => {
      const mockSemesters = [
        { id: 1, name: 'Fall 2024' },
        { id: 2, name: 'Spring 2025' }
      ];
      Semesters.findAll.mockResolvedValue(mockSemesters);

      const response = await request(app).get('/api/semesters');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSemesters);
    });
  });

  describe('POST /api/groups', () => {
    test('should create a new group', async () => {
      const newGroup = { name: 'New Group', description: 'New Description' };
      const createdGroup = { id: 3, ...newGroup };
      Groups.create.mockResolvedValue(createdGroup);

      const response = await request(app)
        .post('/api/groups')
        .send(newGroup)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(response.body).toHaveProperty('id');
      expect(Groups.create).toHaveBeenCalledWith(newGroup);
    });
  });
// ... kodi fillestar mbetet i njëjtë ...

describe('PUT /api/groups/:id', () => {
  test('should update an existing group', async () => {
    const updatedGroup = { name: 'Updated Group', description: 'Updated Description' };
    Groups.update.mockResolvedValue({ id: 1, ...updatedGroup });

    const response = await request(app)
      .put('/api/groups/1')
      .send(updatedGroup)
      .set('Content-Type', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
    // KORRIGJUAR: ID vjen si string
    expect(Groups.update).toHaveBeenCalledWith("1", updatedGroup);
  });
});

describe('DELETE /api/groups/:id', () => {
  test('should delete a group', async () => {
    Groups.delete.mockResolvedValue(true);

    const response = await request(app).delete('/api/groups/1');

    expect([200, 204]).toContain(response.status);
    // KORRIGJUAR: ID vjen si string
    expect(Groups.delete).toHaveBeenCalledWith("1");
  });

  test('should return 404 for non-existent group', async () => {
    Groups.delete.mockResolvedValue(false);

    const response = await request(app).delete('/api/groups/999');

    expect(response.status).toBe(404);
    // KORRIGJUAR: ID vjen si string
    expect(Groups.delete).toHaveBeenCalledWith("999");
  });
});
});