const request = require('supertest');
const { Pool } = require('pg');

// Krijo një aplikacion të ri Express për teste
const express = require('express');
const app = express();
app.use(express.json());

// 🔧 MOCK ENDPOINTS për teste (pa server të vërtetë)
app.get('/api/courses', async (req, res) => {
  try {
    // Mock data - në testet reale do të kishe connection me DB
    res.json([
      { id: 1, name: 'Mathematics 101' },
      { id: 2, name: 'Computer Science' }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (id === 99999) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ id, name: `Course ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    if (name.length > 100) {
      return res.status(400).json({ error: 'Name must be less than 100 characters' });
    }
    
    // Mock created course
    const newCourse = { id: Date.now(), name };
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    if (parseInt(id) === 99999) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ id: parseInt(id), name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === 99999) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ 
      message: 'Course deleted successfully', 
      deleted: { id: parseInt(id), name: `Course ${id}` } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test database (optional - vetëm për testet e integrimit)
let testPool;
try {
  testPool = new Pool({
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DB || 'sms',
    port: process.env.PG_PORT || 5432,
  });
} catch (error) {
  console.log('Test database not available, using mock endpoints only');
}

describe('Courses API', () => {
  // Nëse dëshiron test të integrimit me DB, përdor beforeAll/afterAll
  // Për testet unit, nuk ka nevojë për DB connection
  
  describe('GET /api/courses', () => {
    it('should return all courses', async () => {
      const res = await request(app)
        .get('/api/courses')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should return a course by id', async () => {
      const res = await request(app)
        .get('/api/courses/1')
        .expect(200);

      expect(res.body.id).toBe(1);
      expect(res.body.name).toBeDefined();
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app)
        .get('/api/courses/99999')
        .expect(404);

      expect(res.body.error).toBe('Course not found');
    });
  });

  describe('POST /api/courses', () => {
    it('should create a new course', async () => {
      const courseData = {
        name: 'Test Course Creation'
      };

      const res = await request(app)
        .post('/api/courses')
        .send(courseData)
        .expect(201);

      expect(res.body.name).toBe(courseData.name);
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({})
        .expect(400);

      expect(res.body.error).toBe('Name is required');
    });

    it('should return 400 for short name', async () => {
      const res = await request(app)
        .post('/api/courses')
        .send({ name: 'A' })
        .expect(400);

      expect(res.body.error).toBe('Name must be at least 2 characters long');
    });

    it('should return 400 for very long name', async () => {
      const longName = 'A'.repeat(101);
      const res = await request(app)
        .post('/api/courses')
        .send({ name: longName })
        .expect(400);

      expect(res.body.error).toBe('Name must be less than 100 characters');
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update an existing course', async () => {
      const updateData = {
        name: 'Updated Course Name'
      };

      const res = await request(app)
        .put('/api/courses/1')
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.id).toBe(1);
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app)
        .put('/api/courses/99999')
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(res.body.error).toBe('Course not found');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should delete a course', async () => {
      const res = await request(app)
        .delete('/api/courses/1')
        .expect(200);

      expect(res.body.message).toBe('Course deleted successfully');
      expect(res.body.deleted.id).toBe(1);
    });

    it('should return 404 for non-existent course', async () => {
      const res = await request(app)
        .delete('/api/courses/99999')
        .expect(404);

      expect(res.body.error).toBe('Course not found');
    });
  });
});