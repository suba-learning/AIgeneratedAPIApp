const request = require('supertest');
const app = require('../src/app');

describe('Mini Task Management API - integration', () => {
  let userId, projectId, taskId;

  test('POST /api/users - create user', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Test User', email: 'test@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  test('GET /api/users - list users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/projects - create project', async () => {
    const res = await request(app).post('/api/projects').send({ name: 'Proj 1', userId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    projectId = res.body.id;
  });

  test('POST /api/tasks - create task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Task 1', projectId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    taskId = res.body.id;
  });

  test('Prevent deleting user with projects (409)', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  test('Deleting project deletes its tasks', async () => {
    const resDel = await request(app).delete(`/api/projects/${projectId}`);
    expect(resDel.statusCode).toBe(204);

    // task should be gone
    const resGet = await request(app).get(`/api/tasks/${taskId}`);
    expect(resGet.statusCode).toBe(404);
  });

  test('Now deleting user succeeds', async () => {
    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
  });

  test('Simulate error returns 500', async () => {
    const res = await request(app).get('/simulate-error');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
