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
});
