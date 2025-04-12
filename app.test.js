const request = require('supertest');
const app = require('./app');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user if valid id is provided', async () => {
      const response = await request(app).get('/api/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 if invalid id is provided', async () => {
      const response = await request(app).get('/api/users/999');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const response = await request(app).post('/api/users').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it('should return 400 if name or email is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user if valid id is provided', async () => {
      const userData = {
        name: 'Updated User',
      };

      const response = await request(app).put('/api/users/1').send(userData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(userData.name);
    });

    it('should return 404 if invalid id is provided', async () => {
      const response = await request(app)
        .put('/api/users/999')
        .send({ name: 'Updated User' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user if valid id is provided', async () => {
      const response = await request(app).delete('/api/users/2');
      expect(response.status).toBe(200);
    });

    it('should return 404 if invalid id is provided', async () => {
      const response = await request(app).delete('/api/users/999');
      expect(response.status).toBe(404);
    });
  });
});

describe('Complete User Management Flow', () => {
  let createdUserId;

  it('should perform complete CRUD operations in sequence', async () => {
    // 1. Create a new user
    const createResponse = await request(app).post('/api/users').send({
      name: 'Flow Test User',
      email: 'flowtest@example.com',
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.name).toBe('Flow Test User');
    expect(createResponse.body.email).toBe('flowtest@example.com');

    createdUserId = createResponse.body.id;

    // 2. Read the created user
    const readResponse = await request(app).get(`/api/users/${createdUserId}`);

    expect(readResponse.status).toBe(200);
    expect(readResponse.body.id).toBe(createdUserId);
    expect(readResponse.body.name).toBe('Flow Test User');
    expect(readResponse.body.email).toBe('flowtest@example.com');

    // 3. Update the user
    const updateResponse = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({
        name: 'Updated Flow Test User',
        email: 'updatedflow@example.com',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.id).toBe(createdUserId);
    expect(updateResponse.body.name).toBe('Updated Flow Test User');
    expect(updateResponse.body.email).toBe('updatedflow@example.com');

    // 4. Verify the update
    const verifyUpdateResponse = await request(app).get(
      `/api/users/${createdUserId}`
    );

    expect(verifyUpdateResponse.status).toBe(200);
    expect(verifyUpdateResponse.body.name).toBe('Updated Flow Test User');
    expect(verifyUpdateResponse.body.email).toBe('updatedflow@example.com');

    // 5. Delete the user
    const deleteResponse = await request(app).delete(
      `/api/users/${createdUserId}`
    );

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.id).toBe(createdUserId);

    // 6. Verify the user is deleted
    const verifyDeleteResponse = await request(app).get(
      `/api/users/${createdUserId}`
    );

    expect(verifyDeleteResponse.status).toBe(404);
  });
});
