const request = require("supertest");
const app = require("./app");

describe("API Endpoints", () => {
  describe("GET /", () => {
    it("should return welcome message", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("status");
    });
  });

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const response = await request(app).get("/api/users");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user if valid id is provided", async () => {
      const response = await request(app).get("/api/users/1");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
    });

    it("should return 404 if invalid id is provided", async () => {
      const response = await request(app).get("/api/users/999");
      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
      };

      const response = await request(app).post("/api/users").send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
    });

    it("should return 400 if name or email is missing", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ name: "Test User" });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user if valid id is provided", async () => {
      const userData = {
        name: "Updated User",
      };

      const response = await request(app).put("/api/users/1").send(userData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(userData.name);
    });

    it("should return 404 if invalid id is provided", async () => {
      const response = await request(app)
        .put("/api/users/999")
        .send({ name: "Updated User" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user if valid id is provided", async () => {
      const response = await request(app).delete("/api/users/2");
      expect(response.status).toBe(200);
    });

    it("should return 404 if invalid id is provided", async () => {
      const response = await request(app).delete("/api/users/999");
      expect(response.status).toBe(404);
    });
  });
});
