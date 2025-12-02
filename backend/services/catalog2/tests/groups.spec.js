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
        { id: 1, name: 'Group A' },
        { id: 2, name: 'Group B' }
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
      const mockGroup = { id: 1, name: 'Group A' };
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
      const newGroup = { name: 'Group C' };
      const createdGroup = { id: 3, ...newGroup };

      Groups.create.mockResolvedValue(createdGroup);

      const response = await request(app)
        .post('/api/groups')
        .send(newGroup);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdGroup);
    });

    it('should return 400 for invalid group data', async () => {
      const invalidGroup = { name: '' };

      const response = await request(app)
        .post('/api/groups')
        .send(invalidGroup);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/groups/:id', () => {
    it('should update an existing group', async () => {
      const updatedGroup = { name: 'Updated Group A' };
      const mockUpdated = { id: 1, ...updatedGroup };

      Groups.update.mockResolvedValue(mockUpdated);

      const response = await request(app)
        .put('/api/groups/1')
        .send(updatedGroup);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdated);
    });

    it('should return 404 if group not found', async () => {
      Groups.update.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/groups/999')
        .send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Group not found');
    });
  });

  describe('DELETE /api/groups/:id', () => {
    it('should delete a group', async () => {
      const deletedGroup = { id: 1, name: 'Group A' };
      Groups.delete.mockResolvedValue(deletedGroup);

      const response = await request(app)
        .delete('/api/groups/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Group deleted successfully');
    });

    it('should return 404 if group not found', async () => {
      Groups.delete.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/groups/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Group not found');
    });
  });
});