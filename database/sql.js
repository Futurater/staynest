/**
 * STAYNEST — RELATIONAL TRANSACTIONAL LEDGER & EXPEDITIONS ENGINE
 * Technology: better-sqlite3 (stable production-ready SQLite)
 * 
 * Why SQL here:
 * 1. Strict Foreign Key Integrity (Expeditions -> Legs -> Listings)
 * 2. ACID Transactional Ledger for bookings & financial audits
 * 3. Double-Booking Prevention via date-overlap SQL queries
 */

const Database = require('better-sqlite3');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Ensure the database directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'staynest_ledger.sqlite');
const db = new Database(dbPath);

// Enable Foreign Key constraints and WAL mode for better performance
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// --------------------------------------------------------------------------
// 01. CREATE SQL RELATIONAL TABLES
// --------------------------------------------------------------------------

// Table 1: Curated Multi-Leg Expeditions
db.exec(`
  CREATE TABLE IF NOT EXISTS expeditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    region TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    total_distance_km INTEGER NOT NULL,
    bundle_price INTEGER NOT NULL,
    discount_pct INTEGER DEFAULT 15,
    cover_image TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Table 2: Expedition Transit Legs (Linked via FOREIGN KEY)
db.exec(`
  CREATE TABLE IF NOT EXISTS expedition_legs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expedition_id INTEGER NOT NULL,
    sanctuary_name TEXT NOT NULL,
    location TEXT NOT NULL,
    nights INTEGER NOT NULL,
    leg_order INTEGER NOT NULL,
    transit_mode TEXT NOT NULL,
    transit_hours REAL NOT NULL,
    architectural_highlight TEXT NOT NULL,
    FOREIGN KEY (expedition_id) REFERENCES expeditions(id) ON DELETE CASCADE
  );
`);

// Table 3: Transactional Bookings Ledger
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings_ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_ref TEXT UNIQUE NOT NULL,
    user_name TEXT NOT NULL,
    listing_title TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INTEGER NOT NULL,
    base_amount INTEGER NOT NULL,
    tax_amount INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'CONFIRMED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Table 4: Cultural Residency Grants
db.exec(`
  CREATE TABLE IF NOT EXISTS residency_grants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    grant_ref TEXT UNIQUE NOT NULL,
    applicant_name TEXT NOT NULL,
    listing_title TEXT NOT NULL,
    discipline TEXT NOT NULL,
    project_proposal TEXT NOT NULL,
    grant_discount_pct INTEGER DEFAULT 25,
    approved_nightly_rate INTEGER NOT NULL,
    status TEXT DEFAULT 'APPROVED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// --------------------------------------------------------------------------
// 02. SEED DEFAULT EXPEDITIONS (If empty)
// --------------------------------------------------------------------------
const countStmt = db.prepare('SELECT COUNT(*) as count FROM expeditions');
const row = countStmt.get();

if (row.count === 0) {
  const insertExpedition = db.prepare(`
    INSERT INTO expeditions (title, slug, tagline, description, region, duration_days, total_distance_km, bundle_price, discount_pct, cover_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertLeg = db.prepare(`
    INSERT INTO expedition_legs (expedition_id, sanctuary_name, location, nights, leg_order, transit_mode, transit_hours, architectural_highlight)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Use a transaction for atomic seed operation
  const seedData = db.transaction(() => {
    // Expedition 1: The Nordic Monolith Tour
    const result1 = insertExpedition.run(
      'The Nordic Monolith Tour',
      'nordic-monolith-tour',
      'Fjords, brutalist concrete, and timber sanctuaries across the Arctic Circle.',
      'A curated 8-day expedition taking design travelers through three legendary minimalist residences in northern Norway. Synchronized routes, scenic ferry crossings, and curated architectural access.',
      'Norway & Arctic Circle',
      8,
      420,
      9800,
      15,
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470'
    );

    insertLeg.run(result1.lastInsertRowid, 'Nordic Cliff Sanctuary', 'Tromsø, Norway', 3, 1, 'Scenic Coastal Drive', 2.5, 'Cantilevered glass overlooking Arctic waters');
    insertLeg.run(result1.lastInsertRowid, 'Lofoten Timber Atelier', 'Lofoten, Norway', 2, 2, 'Fjord Express Ferry', 3.0, 'Cross-laminated timber with natural acoustic isolation');
    insertLeg.run(result1.lastInsertRowid, 'Senja Aurora Monolith', 'Senja, Norway', 3, 3, 'Electric Snow Route', 1.5, '360° stargazing roof with automated thermal glass');

    // Expedition 2: The Pacific Brutalist & Redwood Corridor
    const result2 = insertExpedition.run(
      'The Pacific Redwood Corridor',
      'pacific-redwood-corridor',
      'Ocean cliff cantilevers and secluded forest sanctuaries.',
      'Traverse the dramatic Pacific Northwest coastline across three world-renowned architectural retreats. Integrated travel notes, private atelier access, and local culinary provisions.',
      'Pacific Northwest, USA',
      7,
      380,
      8400,
      15,
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
    );

    insertLeg.run(result2.lastInsertRowid, 'Big Sur Ocean Pavilion', 'Big Sur, California', 3, 1, 'Pacific Coast Highway Drive', 3.0, 'Board-formed concrete suspended over crashing surf');
    insertLeg.run(result2.lastInsertRowid, 'Secluded Redwood Treehouse', 'Portland, Oregon', 2, 2, 'Electric Mountain Rail', 4.5, 'Living amongst old-growth canopy with suspended skybridges');
    insertLeg.run(result2.lastInsertRowid, 'Cascade Mountain Sanctuary', 'Aspen, Colorado', 2, 3, 'Alpine Panoramic Shuttle', 2.0, 'Rammed earth walls with passive geothermal heating');
  });

  seedData();
}

// --------------------------------------------------------------------------
// 03. GENERATE UNIQUE REFS (FIX #8, #9: crypto-safe IDs)
// --------------------------------------------------------------------------
function generateRef(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// --------------------------------------------------------------------------
// 04. SQL HELPER METHODS EXPORTED FOR APP
// --------------------------------------------------------------------------
module.exports = {
  db,

  // Get all expeditions
  getAllExpeditions() {
    const stmt = db.prepare('SELECT * FROM expeditions ORDER BY id ASC');
    return stmt.all();
  },

  // Get expedition by slug with all linked transit legs (Relational JOIN)
  getExpeditionBySlug(slug) {
    const expStmt = db.prepare('SELECT * FROM expeditions WHERE slug = ?');
    const expedition = expStmt.get(slug);
    if (!expedition) return null;

    const legsStmt = db.prepare('SELECT * FROM expedition_legs WHERE expedition_id = ? ORDER BY leg_order ASC');
    expedition.legs = legsStmt.all(expedition.id);
    return expedition;
  },

  // Record a confirmed booking in the SQL ledger
  recordBooking({ userName, listingTitle, checkIn, checkOut, nights, baseAmount, taxAmount, totalAmount }) {
    const bookingRef = generateRef('BK');
    const stmt = db.prepare(`
      INSERT INTO bookings_ledger (booking_ref, user_name, listing_title, check_in, check_out, nights, base_amount, tax_amount, total_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(bookingRef, userName, listingTitle, checkIn, checkOut, nights, baseAmount, taxAmount, totalAmount);
    return bookingRef;
  },

  // Check for date overlap (Preventing double-booking)
  hasBookingConflict(listingTitle, checkIn, checkOut) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as conflicts FROM bookings_ledger 
      WHERE listing_title = ? 
        AND status = 'CONFIRMED'
        AND NOT (check_out <= ? OR check_in >= ?)
    `);
    const result = stmt.get(listingTitle, checkIn, checkOut);
    return result.conflicts > 0;
  },

  // Record an approved creative residency grant (-25%)
  recordResidencyGrant({ applicantName, listingTitle, discipline, projectProposal, approvedNightlyRate }) {
    const grantRef = generateRef('GR');
    const stmt = db.prepare(`
      INSERT INTO residency_grants (grant_ref, applicant_name, listing_title, discipline, project_proposal, grant_discount_pct, approved_nightly_rate)
      VALUES (?, ?, ?, ?, ?, 25, ?)
    `);
    stmt.run(grantRef, applicantName, listingTitle, discipline, projectProposal, approvedNightlyRate);
    return grantRef;
  },

  // Close database connection (for clean test teardown)
  close() {
    db.close();
  }
};
