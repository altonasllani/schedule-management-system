const request = require('supertest');
const app = require('../index');

describe("Sessions API", () => {

  test("GET /sessions → duhet të kthejë listën", async () => {
    const res = await request(app).get('/sessions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /sessions → krijon sesion të ri", async () => {
    const body = {
      group_id: 1,
      room_id: 2,
      subject: "Test Subject",
      start_time: "2024-09-15T08:00:00Z",
      end_time: "2024-09-15T09:00:00Z"
    };

    const res = await request(app).post('/sessions').send(body);
    expect(res.statusCode).toBe(201);
    expect(res.body.subject).toBe("Test Subject");
  });

  test("POST /sessions → nuk lejon konflikt orari", async () => {
    const body = {
      group_id: 1,
      room_id: 2,
      subject: "Conflict Test",
      start_time: "2024-09-15T08:30:00Z",
      end_time: "2024-09-15T09:30:00Z"
    };

    const res = await request(app).post('/sessions').send(body);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Konflikt/);
  });

});
