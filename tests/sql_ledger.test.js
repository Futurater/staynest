const sql = require("../database/sql.js");

describe("SQL Transactional Ledger & Relational Integrity Tests", () => {
  test("should fetch all seeded multi-leg expeditions from SQL", () => {
    const expeditions = sql.getAllExpeditions();
    expect(expeditions.length).toBeGreaterThanOrEqual(2);
    expect(expeditions[0]).toHaveProperty("title", "The Nordic Monolith Tour");
    expect(expeditions[0]).toHaveProperty("region", "Norway & Arctic Circle");
  });

  test("should retrieve an expedition and its relational legs via FOREIGN KEY", () => {
    const expedition = sql.getExpeditionBySlug("nordic-monolith-tour");
    expect(expedition).toBeDefined();
    expect(expedition.legs).toBeDefined();
    expect(expedition.legs.length).toBe(3);
    expect(expedition.legs[0].sanctuary_name).toBe("Nordic Cliff Sanctuary");
    expect(expedition.legs[0].transit_mode).toBe("Scenic Coastal Drive");
  });

  test("should record a booking in the SQL ledger and return a booking reference", () => {
    const ref = sql.recordBooking({
      userName: "ArchitecturalTraveler",
      listingTitle: "Nordic Minimalist Sanctuary",
      checkIn: "2026-11-01",
      checkOut: "2026-11-05",
      nights: 4,
      baseAmount: 9600,
      taxAmount: 1728,
      totalAmount: 11328,
    });

    expect(ref).toMatch(/^BK-[A-Z0-9]+$/);
  });

  test("should detect booking conflict for overlapping dates on the same sanctuary", () => {
    // We just booked 2026-11-01 to 2026-11-05 above
    // Overlapping query: 2026-11-03 to 2026-11-07
    const hasConflict = sql.hasBookingConflict(
      "Nordic Minimalist Sanctuary",
      "2026-11-03",
      "2026-11-07"
    );
    expect(hasConflict).toBe(true);

    // Non-overlapping query: 2026-11-10 to 2026-11-15
    const noConflict = sql.hasBookingConflict(
      "Nordic Minimalist Sanctuary",
      "2026-11-10",
      "2026-11-15"
    );
    expect(noConflict).toBe(false);
  });

  test("should record a creative residency grant with 25% discount", () => {
    const grantRef = sql.recordResidencyGrant({
      applicantName: "Elena Rostova",
      listingTitle: "Lofoten Timber Atelier",
      discipline: "Architectural Acoustic Research",
      projectProposal: "Recording timber resonance in coastal fog conditions.",
      approvedNightlyRate: 1800,
    });

    expect(grantRef).toMatch(/^GR-[A-Z0-9]+$/);
  });
});
