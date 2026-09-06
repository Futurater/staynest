const request = require("supertest");

// Mock mongoose for fast isolated test runs
jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1, close: jest.fn() }
  };
});

const app = require("../app.js");

describe("Multi-Leg Expeditions Engine Route Tests", () => {
  test("GET /expeditions should render catalog with 200 OK", async () => {
    const res = await request(app).get("/expeditions");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Multi-Stop");
    expect(res.text).toContain("The Nordic Monolith Tour");
  });

  test("GET /expeditions/:slug should display route timeline with transit legs", async () => {
    const res = await request(app).get("/expeditions/nordic-monolith-tour");
    expect(res.status).toBe(200);
    expect(res.text).toContain("The Nordic Monolith Tour");
    expect(res.text).toContain("Nordic Cliff Sanctuary");
    expect(res.text).toContain("Fjord Express Ferry");
  });

  test("GET /expeditions/:slug should redirect with error if slug does not exist", async () => {
    const res = await request(app).get("/expeditions/non-existent-tour");
    expect(res.status).toBe(302);
    expect(res.header.location).toBe("/expeditions");
  });

  test("POST /expeditions/:slug/book should commit multi-leg booking to SQL ledger", async () => {
    const res = await request(app)
      .post("/expeditions/nordic-monolith-tour/book")
      .send({
        travelerName: "Marcus Aurelius",
        startDate: "2026-11-15"
      });

    expect(res.status).toBe(302);
    expect(res.header.location).toBe("/expeditions/nordic-monolith-tour");
  });
});
