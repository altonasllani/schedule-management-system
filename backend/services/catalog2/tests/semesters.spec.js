const request = require('supertest');
const express = require('express');
const semestersRoute = require('../routes/semesters.route');

const app = express();
app.use(express.json());
app.use('/api/semesters', semestersRoute);

// Mock model
jest.mock('../models/semesters.model');

const Semesters = require('../models/semesters.model');

describe('Semesters API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/semesters', () => {
    test('should return all semesters', async () => {
      const mockSemesters = [
        { id: 1, name: 'Fall 2024', start_date: '2024-09-01', end_date: '2024-12-20', is_current: true },
        { id: 2, name: 'Spring 2025', start_date: '2025-01-15', end_date: '2025-05-20', is_current: false }
      ];

      Semesters.findAll.mockResolvedValue(mockSemesters);

      const response = await request(app).get('/api/semesters');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSemesters);
      expect(Semesters.findAll).toHaveBeenCalledTimes(1);
    });
  });
// ... kodi fillestar mbetet i njëjtë ...

describe('GET /api/semesters/:id', () => {
  test('should return a semester when valid ID is provided', async () => {
    const mockSemester = {
      id: 1,
      name: 'Fall 2024',
      start_date: '2024-09-01',
      end_date: '2024-12-20',
      is_current: true
    };

    Semesters.findById.mockResolvedValue(mockSemester);

    const response = await request(app).get('/api/semesters/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSemester);
    // KORRIGJUAR: ID vjen si string
    expect(Semesters.findById).toHaveBeenCalledWith("1");
  });

  test('should return 404 for non-existent semester', async () => {
    Semesters.findById.mockResolvedValue(null);

    const response = await request(app).get('/api/semesters/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    // KORRIGJUAR: ID vjen si string
    expect(Semesters.findById).toHaveBeenCalledWith("999");
  });
});
});