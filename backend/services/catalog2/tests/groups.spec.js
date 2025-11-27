const request = require('supertest');
const express = require('express');
const groupsRoute = require('../routes/groups.route');
const Groups = require('../models/groups.model');

const app = express();
app.use(express.json());
app.use('/api/groups', groupsRoute);

jest.mock('../models/groups.model');

describe('Groups API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/groups', () => {
    it('should return all groups', async () => {
      const mockGroups = [
        { id: 1, name: 'Group A', description: 'First group', semester_id: 1 },
        { id: 2, name: 'Group B', description: 'Second group', semester_id: 1 }
      ];

      Groups.findAll.mockResolvedValue(mockGroups);

      const response = await request(app).get('/api/groups');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGroups);
    });

    it('should handle errors when fetching groups', async () => {
      Groups.findAll.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/groups');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/groups/:id', () => {
    it('should return a group by id', async () => {
      const mockGroup = { id: 1, name: 'Group A', semester_id: 1 };
      Groups.findById.mockResolvedValue(mockGroup);

      const response = await request(app).get('/api/groups/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGroup);
    });

    it('should return 404 if group not found', async () => {
      Groups.findById.mockResolvedValue(null);

      const response = await request(app).get('/api/groups/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Group not found');
    });
  });

  describe('POST /api/groups', () => {
    it('should create a new group', async () => {
      const newGroup = { name: 'Group C', description: 'New group', semester_id: 1 };
      const createdGroup = { id: 3, ...newGroup };

      Groups.create.mockResolvedValue(createdGroup);

      const response = await request(app)
        .post('/api/groups')
        .send(newGroup);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdGroup);
    });

    it('should return 400 for invalid group data', async () => {
      const invalidGroup = { name: '', semester_id: 'invalid' };

      const response = await request(app)
        .post('/api/groups')
        .send(invalidGroup);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});