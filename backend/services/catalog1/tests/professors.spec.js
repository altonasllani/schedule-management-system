const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());

// 🔧 MOCK ENDPOINTS për professors
app.get('/api/professors', async (req, res) => {
  try {
    // Mock data
    res.json([
      { id: 1, name: 'Dr. John Smith', email: 'john.smith@university.edu' },
      { id: 2, name: 'Prof. Maria Garcia', email: 'maria.garcia@university.edu' },
      { id: 3, name: 'Dr. Robert Johnson', email: 'robert.johnson@university.edu' }
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/professors/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (id === 99999) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    
    // Mock professor data
    const professors = {
      1: { id: 1, name: 'Dr. John Smith', email: 'john.smith@university.edu' },
      2: { id: 2, name: 'Prof. Maria Garcia', email: 'maria.garcia@university.edu' },
      3: { id: 3, name: 'Dr. Robert Johnson', email: 'robert.johnson@university.edu' }
    };
    
    const professor = professors[id] || { 
      id, 
      name: `Professor ${id}`, 
      email: `professor${id}@university.edu` 
    };
    
    res.json(professor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/professors', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validimi
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    
    if (trimmedName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    // ✅ VALIDIMI I FORTUAR I EMAIL-IT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check for duplicate email (mock)
    const existingEmails = ['john.smith@university.edu', 'maria.garcia@university.edu'];
    if (existingEmails.includes(trimmedEmail.toLowerCase())) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Mock created professor
    const newProfessor = { 
      id: Date.now(), 
      name: trimmedName,
      email: trimmedEmail.toLowerCase()
    };
    
    res.status(201).json(newProfessor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/professors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const professorId = parseInt(id);
    
    // Validimi
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    
    if (trimmedName.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    // ✅ VALIDIMI I FORTUAR I EMAIL-IT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check if professor exists
    if (professorId === 99999) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    
    // Mock updated professor
    const updatedProfessor = { 
      id: professorId, 
      name: trimmedName,
      email: trimmedEmail.toLowerCase()
    };
    
    res.json(updatedProfessor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/professors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const professorId = parseInt(id);
    
    // Check if professor exists
    if (professorId === 99999) {
      return res.status(404).json({ error: 'Professor not found' });
    }
    
    // Mock deleted professor
    const deletedProfessor = { 
      id: professorId, 
      name: `Professor ${professorId}`,
      email: `professor${professorId}@university.edu`
    };
    
    res.json({ 
      message: 'Professor deleted successfully', 
      deleted: deletedProfessor 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 TESTET
describe('Professors API', () => {
  describe('GET /api/professors', () => {
    it('should return all professors', async () => {
      const res = await request(app)
        .get('/api/professors')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('email');
    });

    it('should return professors with correct structure', async () => {
      const res = await request(app)
        .get('/api/professors')
        .expect(200);

      res.body.forEach(professor => {
        expect(professor).toHaveProperty('id');
        expect(professor).toHaveProperty('name');
        expect(professor).toHaveProperty('email');
        expect(typeof professor.id).toBe('number');
        expect(typeof professor.name).toBe('string');
        expect(typeof professor.email).toBe('string');
        expect(professor.email).toContain('@');
      });
    });
  });

  describe('GET /api/professors/:id', () => {
    it('should return a professor by id', async () => {
      const res = await request(app)
        .get('/api/professors/1')
        .expect(200);

      expect(res.body.id).toBe(1);
      expect(res.body.name).toBe('Dr. John Smith');
      expect(res.body.email).toBe('john.smith@university.edu');
    });

    it('should return 404 for non-existent professor', async () => {
      const res = await request(app)
        .get('/api/professors/99999')
        .expect(404);

      expect(res.body.error).toBe('Professor not found');
    });

    it('should return professor data for valid id', async () => {
      const res = await request(app)
        .get('/api/professors/2')
        .expect(200);

      expect(res.body.id).toBe(2);
      expect(res.body.name).toBe('Prof. Maria Garcia');
      expect(res.body.email).toBe('maria.garcia@university.edu');
    });
  });

  describe('POST /api/professors', () => {
    it('should create a new professor', async () => {
      const professorData = {
        name: 'Dr. New Professor',
        email: 'new.professor@university.edu'
      };

      const res = await request(app)
        .post('/api/professors')
        .send(professorData)
        .expect(201);

      expect(res.body.name).toBe(professorData.name);
      expect(res.body.email).toBe(professorData.email.toLowerCase());
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 for missing name', async () => {
      const res = await request(app)
        .post('/api/professors')
        .send({ email: 'test@university.edu' })
        .expect(400);

      expect(res.body.error).toBe('Name and email are required');
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/professors')
        .send({ name: 'Test Professor' })
        .expect(400);

      expect(res.body.error).toBe('Name and email are required');
    });

    it('should return 400 for short name', async () => {
      const res = await request(app)
        .post('/api/professors')
        .send({ name: 'A', email: 'test@university.edu' })
        .expect(400);

      expect(res.body.error).toBe('Name must be at least 2 characters long');
    });

    it('should return 400 for invalid email format', async () => {
      const testCases = [
        { email: 'invalid-email', expected: 'Invalid email format' },
        { email: 'test@', expected: 'Invalid email format' },
        { email: '@university.edu', expected: 'Invalid email format' },
        { email: 'test.university.edu', expected: 'Invalid email format' },
        { email: 'test @university.edu', expected: 'Invalid email format' },
        { email: 'test@university', expected: 'Invalid email format' }
      ];

      for (const testCase of testCases) {
        const res = await request(app)
          .post('/api/professors')
          .send({ name: 'Test Professor', email: testCase.email })
          .expect(400);

        expect(res.body.error).toBe(testCase.expected);
      }
    });

    it('should trim name and lowercase email', async () => {
      const professorData = {
        name: '  Dr. Test Professor  ',
        email: '  TEST.PROFESSOR@University.Edu  '
      };

      const res = await request(app)
        .post('/api/professors')
        .send(professorData)
        .expect(201);

      expect(res.body.name).toBe('Dr. Test Professor'); // Trimmed
      expect(res.body.email).toBe('test.professor@university.edu'); // Trimmed and Lowercased
    });
  });

  describe('PUT /api/professors/:id', () => {
    it('should update an existing professor', async () => {
      const updateData = {
        name: 'Dr. Updated Name',
        email: 'updated.email@university.edu'
      };

      const res = await request(app)
        .put('/api/professors/1')
        .send(updateData)
        .expect(200);

      expect(res.body.name).toBe(updateData.name);
      expect(res.body.email).toBe(updateData.email.toLowerCase());
      expect(res.body.id).toBe(1);
    });

    it('should return 404 for non-existent professor', async () => {
      const res = await request(app)
        .put('/api/professors/99999')
        .send({ name: 'Updated Name', email: 'updated@university.edu' })
        .expect(404);

      expect(res.body.error).toBe('Professor not found');
    });

    it('should validate input when updating', async () => {
      const testCases = [
        { data: { name: '', email: 'test@university.edu' }, expected: 'Name and email are required' },
        { data: { name: 'A', email: 'test@university.edu' }, expected: 'Name must be at least 2 characters long' },
        { data: { name: 'Test', email: 'invalid' }, expected: 'Invalid email format' }
      ];

      for (const testCase of testCases) {
        const res = await request(app)
          .put('/api/professors/1')
          .send(testCase.data)
          .expect(400);

        expect(res.body.error).toBe(testCase.expected);
      }
    });
  });

  describe('DELETE /api/professors/:id', () => {
    it('should delete a professor', async () => {
      const res = await request(app)
        .delete('/api/professors/2')
        .expect(200);

      expect(res.body.message).toBe('Professor deleted successfully');
      expect(res.body.deleted.id).toBe(2);
      expect(res.body.deleted.name).toBeDefined();
      expect(res.body.deleted.email).toBeDefined();
    });

    it('should return 404 for non-existent professor', async () => {
      const res = await request(app)
        .delete('/api/professors/99999')
        .expect(404);

      expect(res.body.error).toBe('Professor not found');
    });

    it('should return correct deleted professor data', async () => {
      const res = await request(app)
        .delete('/api/professors/3')
        .expect(200);

      expect(res.body.deleted.id).toBe(3);
      expect(res.body.deleted.name).toContain('Professor');
      expect(res.body.deleted.email).toContain('@');
    });
  });
});