const request = require("supertest");

// Mock mongoose for fast isolated unit/integration tests
jest.mock("mongoose", () => {
  const actual = jest.requireActual("mongoose");
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(true),
    connection: { readyState: 1, close: jest.fn() }
  };
});

const app = require("../app.js");

describe("AI Spatial Intent Matchmaker & Residency Grants Tests", () => {
  test("POST /api/spatial-match should reject empty brief with 400", async () => {
    const res = await request(app)
      .post("/api/spatial-match")
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Spatial intent brief is required");
  });

  test("POST /api/spatial-match should compute high acoustic and daylight scores for creative brief", async () => {
    const res = await request(app)
      .post("/api/spatial-match")
      .send({
        intentBrief: "Novelist needing absolute acoustic silence, morning light, and timber desk"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("overallFit");
    expect(res.body.scorecard.acousticSeclusion).toBe("98%");
    expect(res.body.scorecard.daylightOrientation).toBe("99%");
    expect(res.body.scorecard.materialityHarmony).toBe("97%");
    expect(res.body.matchedAttributes).toContain("Acoustic Isolation (STC 54)");
  });

  test("POST /api/residency-grant should record -25% subsidized residency in SQL ledger", async () => {
    const res = await request(app)
      .post("/api/residency-grant")
      .send({
        listingTitle: "Nordic Minimalist Sanctuary",
        discipline: "Architecture & Spatial Design",
        projectProposal: "Researching natural lighting in Arctic conditions.",
        standardPrice: 2000
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.discountPct).toBe(25);
    expect(res.body.approvedNightlyRate).toBe(1500); // 2000 * 0.75
    expect(res.body.grantRef).toMatch(/^GR-[A-Z0-9]+$/);
  });
});
