const request = require('supertest');
const express = require('express');
const roomsRoute = require('../routes/rooms.route');
const Rooms = require('../models/rooms.model');

const app = express();
app.use(express.json());
app.use('/api/rooms', roomsRoute);

jest.mock('../models/rooms.model');

describe('Rooms API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/rooms', () => {
    it('should return all rooms', async () => {
      const mockRooms = [
        { id: 1, name: 'Room A', capacity: 30 },
        { id: 2, name: 'Room B', capacity: 50 }
      ];

      Rooms.findAll.mockResolvedValue(mockRooms);

      const response = await request(app).get('/api/rooms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRooms);
      expect(Rooms.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when fetching rooms', async () => {
      Rooms.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/rooms');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/rooms/:id', () => {
    it('should return a room by id', async () => {
      const mockRoom = { id: 1, name: 'Room A', capacity: 30 };
      Rooms.findById.mockResolvedValue(mockRoom);

      const response = await request(app).get('/api/rooms/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoom);
      expect(Rooms.findById).toHaveBeenCalledWith('1');
    });

    it('should return 404 if room not found', async () => {
      Rooms.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/rooms/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Room not found');
    });

    it('should handle errors when fetching room by id', async () => {
      Rooms.findById.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/rooms/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/rooms', () => {
    it('should create a new room', async () => {
      const newRoom = { name: 'Room C', capacity: 40 };
      const createdRoom = { id: 3, ...newRoom };

      Rooms.create.mockResolvedValue(createdRoom);

      const response = await request(app)
        .post('/api/rooms')
        .send(newRoom);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdRoom);
      expect(Rooms.create).toHaveBeenCalledWith(newRoom);
    });

    it('should return 400 for invalid room data', async () => {
      const invalidRoom = { name: '', capacity: 0 };

      const response = await request(app)
        .post('/api/rooms')
        .send(invalidRoom);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle errors when creating room', async () => {
      Rooms.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/rooms')
        .send({ name: 'Room D', capacity: 25 });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/rooms/:id', () => {
    it('should update an existing room', async () => {
      const updatedRoom = { id: 1, name: 'Updated Room A', capacity: 35 };
      Rooms.update.mockResolvedValue(updatedRoom);

      const response = await request(app)
        .put('/api/rooms/1')
        .send({ name: 'Updated Room A', capacity: 35 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedRoom);
      expect(Rooms.update).toHaveBeenCalledWith('1', {
        name: 'Updated Room A',
        capacity: 35
      });
    });

    it('should return 404 if room to update not found', async () => {
      Rooms.update.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/rooms/999')
        .send({ name: 'Non-existent Room', capacity: 10 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Room not found');
    });
  });

  describe('DELETE /api/rooms/:id', () => {
    it('should delete a room', async () => {
      const deletedRoom = { id: 1, name: 'Room A' };
      Rooms.delete.mockResolvedValue(deletedRoom);

      const response = await request(app).delete('/api/rooms/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Room deleted successfully' });
      expect(Rooms.delete).toHaveBeenCalledWith('1');
    });

    it('should return 404 if room to delete not found', async () => {
      Rooms.delete.mockResolvedValue(null);

      const response = await request(app).delete('/api/rooms/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Room not found');
    });
  });
});