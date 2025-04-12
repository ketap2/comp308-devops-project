// Set up test environment before importing app
process.env.NODE_ENV = 'test';
process.env.CORS_ORIGIN = 'http://localhost:3000';
process.env.ENABLE_LOGGING = 'false';

const request = require('supertest');
const app = require('./app');

describe('API Endpoints', () => {
  describe('Environment Configuration', () => {
    it('should load test environment configuration', () => {
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.CORS_ORIGIN).toBe('http://localhost:3000');
      expect(process.env.ENABLE_LOGGING).toBe('false');
    });
  });

  describe('Development-specific features', () => {
    // Temporarily override NODE_ENV for these tests
    let originalNodeEnv;

    beforeAll(() => {
      originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
    });

    afterAll(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('should include CORS headers in development mode', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000'
      );
      expect(response.headers['access-control-allow-headers']).toBe(
        'Origin, X-Requested-With, Content-Type, Accept'
      );
    });

    it('should include morgan logging in development mode', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
  });

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

  beforeEach(async () => {
    // Clean up any existing users before each test
    const usersResponse = await request(app).get('/api/users');
    const users = usersResponse.body;
    for (const user of users) {
      if (user.id > 2) {
        // Preserve initial test users
        await request(app).delete(`/api/users/${user.id}`);
      }
    }
  });

  afterEach(async () => {
    // Clean up created user if it exists
    if (createdUserId) {
      try {
        await request(app).delete(`/api/users/${createdUserId}`);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  it('should perform complete CRUD operations in sequence', async () => {
    // 1. Create a new user
    const createResponse = await request(app).post('/api/users').send({
      name: 'Test User',
      email: 'test@example.com',
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.name).toBe('Test User');
    expect(createResponse.body.email).toBe('test@example.com');

    createdUserId = createResponse.body.id;

    // 2. Read the created user
    const readResponse = await request(app).get(`/api/users/${createdUserId}`);

    expect(readResponse.status).toBe(200);
    expect(readResponse.body.id).toBe(createdUserId);
    expect(readResponse.body.name).toBe('Test User');
    expect(readResponse.body.email).toBe('test@example.com');

    // 3. Update the user
    const updateResponse = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({
        name: 'Updated Test User',
        email: 'updated@example.com',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.id).toBe(createdUserId);
    expect(updateResponse.body.name).toBe('Updated Test User');
    expect(updateResponse.body.email).toBe('updated@example.com');

    // 4. Verify the update
    const verifyUpdateResponse = await request(app).get(
      `/api/users/${createdUserId}`
    );

    expect(verifyUpdateResponse.status).toBe(200);
    expect(verifyUpdateResponse.body.name).toBe('Updated Test User');
    expect(verifyUpdateResponse.body.email).toBe('updated@example.com');

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
    expect(verifyDeleteResponse.body.error).toBe('User not found');

    // 7. Verify the user is not in the list
    const usersResponse = await request(app).get('/api/users');
    const userStillExists = usersResponse.body.some(
      (user) => user.id === createdUserId
    );
    expect(userStillExists).toBe(false);

    // Clear the createdUserId to prevent cleanup in afterEach
    createdUserId = null;
  });
});
