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

// Mock models - ky është pjesa më e rëndësishme që mungonte
jest.mock('../models/groups.model');
jest.mock('../models/rooms.model');
jest.mock('../models/semesters.model');

// Importo modelet PAS mock
const Groups = require('../models/groups.model');
const Rooms = require('../models/rooms.model');
const Semesters = require('../models/semesters.model');

describe('Catalog2 CRUD API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    Groups.findAll.mockResolvedValue([]);
    Rooms.findAll.mockResolvedValue([]);
    Semesters.findAll.mockResolvedValue([]);
    
    Groups.findById.mockResolvedValue(null);
    Rooms.findById.mockResolvedValue(null);
    Semesters.findById.mockResolvedValue(null);
    
    Semesters.findCurrent.mockResolvedValue(null);
  });

  describe('GET /api/health', () => {
    test('should return service health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        service: 'catalog2',
        timestamp: expect.any(String)
      });
    });
  });

  describe('GET /api/groups', () => {
    test('should return groups', async () => {
      const mockGroups = [
        { id: 1, name: 'Group A', description: 'Description A' },
        { id: 2, name: 'Group B', description: 'Description B' }
      ];
      Groups.findAll.mockResolvedValue(mockGroups);

      const response = await request(app).get('/api/groups');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGroups);
    });
  });

  describe('GET /api/rooms', () => {
    test('should return rooms', async () => {
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
    test('should return semesters', async () => {
      const mockSemesters = [
        { id: 1, name: 'Fall 2024', start_date: '2024-09-01', end_date: '2024-12-20' },
        { id: 2, name: 'Spring 2025', start_date: '2025-01-15', end_date: '2025-05-20' }
      ];
      Semesters.findAll.mockResolvedValue(mockSemesters);

      const response = await request(app).get('/api/semesters');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSemesters);
    });
  });

  describe('Groups CRUD Operations', () => {
    test('POST /api/groups - should attempt to create new group', async () => {
      const newGroup = { name: 'Test Group', description: 'Test Description' };
      const createdGroup = { id: 1, ...newGroup };
      Groups.create.mockResolvedValue(createdGroup);

      const response = await request(app)
        .post('/api/groups')
        .send(newGroup)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(Groups.create).toHaveBeenCalledWith(newGroup);
    });

    test('PUT /api/groups/:id - should attempt to update group', async () => {
      const updatedData = { name: 'Updated Group', description: 'Updated Description' };
      Groups.update.mockResolvedValue({ id: 1, ...updatedData });

      const response = await request(app)
        .put('/api/groups/1')
        .send(updatedData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      // KORRIGJUAR: ID vjen si string nga req.params.id
      expect(Groups.update).toHaveBeenCalledWith("1", updatedData);
    });

    test('DELETE /api/groups/:id - should handle delete operation', async () => {
      Groups.delete.mockResolvedValue(true);

      const response = await request(app).delete('/api/groups/1');

      expect([200, 204, 404]).toContain(response.status);
      // KORRIGJUAR: ID vjen si string
      expect(Groups.delete).toHaveBeenCalledWith("1");
    });
  });

  describe('Rooms CRUD Operations', () => {
    test('POST /api/rooms - should attempt to create new room', async () => {
      const newRoom = { name: 'Test Room', capacity: 30 };
      const createdRoom = { id: 1, ...newRoom };
      Rooms.create.mockResolvedValue(createdRoom);

      const response = await request(app)
        .post('/api/rooms')
        .send(newRoom)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(Rooms.create).toHaveBeenCalledWith(newRoom);
    });

    test('PUT /api/rooms/:id - should attempt to update room', async () => {
      const updatedData = { name: 'Updated Room', capacity: 40 };
      Rooms.update.mockResolvedValue({ id: 1, ...updatedData });

      const response = await request(app)
        .put('/api/rooms/1')
        .send(updatedData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      // KORRIGJUAR: ID vjen si string
      expect(Rooms.update).toHaveBeenCalledWith("1", updatedData);
    });

    test('DELETE /api/rooms/:id - should handle delete operation', async () => {
      Rooms.delete.mockResolvedValue(true);

      const response = await request(app).delete('/api/rooms/1');

      expect([200, 204, 404]).toContain(response.status);
      // KORRIGJUAR: ID vjen si string
      expect(Rooms.delete).toHaveBeenCalledWith("1");
    });
  });

  describe('Semesters CRUD Operations', () => {
    test('POST /api/semesters - should attempt to create new semester', async () => {
      const newSemester = {
        name: 'Summer 2025',
        start_date: '2025-06-01',
        end_date: '2025-08-15',
        is_current: false
      };
      const createdSemester = { id: 1, ...newSemester };
      Semesters.create.mockResolvedValue(createdSemester);

      const response = await request(app)
        .post('/api/semesters')
        .send(newSemester)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      expect(Semesters.create).toHaveBeenCalledWith(newSemester);
    });

    test('PUT /api/semesters/:id - should attempt to update semester', async () => {
      const updatedData = {
        name: 'Updated Semester',
        start_date: '2025-06-15',
        end_date: '2025-08-30'
      };
      Semesters.update.mockResolvedValue({ id: 1, ...updatedData });

      const response = await request(app)
        .put('/api/semesters/1')
        .send(updatedData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(300);
      // KORRIGJUAR: ID vjen si string
      expect(Semesters.update).toHaveBeenCalledWith("1", updatedData);
    });

    test('DELETE /api/semesters/:id - should handle delete operation', async () => {
      Semesters.delete.mockResolvedValue(true);

      const response = await request(app).delete('/api/semesters/1');

      expect([200, 204, 404]).toContain(response.status);
      // KORRIGJUAR: ID vjen si string
      expect(Semesters.delete).toHaveBeenCalledWith("1");
    });
  });
});