const request = require("supertest");

// Mock mongoose so tests run reliably without needing a live MongoDB daemon
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue(true),
    },
  };
});

const app = require("../app.js");

describe("API Endpoints & Routing Integration Tests", () => {
  test("GET / should redirect to /listings with 302", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(302);
    expect(res.header.location).toBe("/listings");
  });

  test("POST /api/ai-chat should return 400 when message is empty or missing", async () => {
    const res = await request(app)
      .post("/api/ai-chat")
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Message is required");
  });

  test("POST /api/ai-chat should return helpful suggestions for mountain cabins", async () => {
    const res = await request(app)
      .post("/api/ai-chat")
      .send({ message: "Recommend some cozy mountain cabins" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("response");
    expect(typeof res.body.response).toBe("string");
    expect(res.body.response.length).toBeGreaterThan(10);
  });

  test("POST /api/ai-chat should return helpful suggestions for beachfront properties", async () => {
    const res = await request(app)
      .post("/api/ai-chat")
      .send({ message: "Looking for ocean and beach spots" });
    expect(res.status).toBe(200);
    expect(res.body.response).toMatch(/beach/i);
  });

  test("GET non-existent route should trigger central 404 handler", async () => {
    const res = await request(app).get("/this-route-does-not-exist-at-all");
    expect(res.status).toBe(404);
  });
});
