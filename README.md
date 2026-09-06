# 🏛️ StayNest — Curated Architectural Sanctuaries & Relational Expedition Engine

A high-performance, hybrid-database web platform for discerning travelers and architectural connoisseurs. StayNest combines flexible document storage for rich listing catalogs with an ACID-compliant transactional SQL ledger for reservations, cultural residency grants, and multi-leg expeditions.

---

## 🌟 Breakthrough Features

### 1. 🧠 AI Spatial & Phenomenological Intent Matcher
Beyond generic keyword search, StayNest parses architectural vibes, light quality, acoustic isolation, and design philosophy:
- Natural-language intent search (e.g., *"brutalist concrete bunker with high ceilings and morning light for focused writing"*).
- Spatial reasoning engine matching properties against design philosophy, materials, and acoustic requirements.
- **Endpoint**: `POST /api/spatial-match`

### 2. 📜 Cultural Residency & Fellowship Grant Application Engine
Enables architects, writers, and artists to apply for subsidized creative fellowships at architectural sanctuaries:
- Structured application workflow capturing creative portfolio, project statement, and duration.
- Evaluates eligibility and allocates stipends against a transactional grant pool.
- Recorded into the relational SQL audit ledger with cryptographic reference IDs (`GR-...`).
- **Endpoint**: `POST /api/grants/apply`

### 3. 🗺️ Multi-Leg Curated Expeditions
Curated architectural journeys connecting multiple sanctuaries across regions:
- Strict relational Foreign Key integrity linking master expeditions to sequenced itinerary legs and underlying listings.
- Complete leg breakdowns including transit modes, drive times, and stay durations.
- **Routes**: `GET /expeditions`, `GET /expeditions/:id`

### 4. 🔒 Zero-Double-Booking Transactional Ledger (SQLite)
- Backed by `better-sqlite3` with Write-Ahead Logging (`WAL` mode).
- Immediate ACID transaction isolation prevents concurrent overbooking collisions.
- Cryptographically secure booking references (`crypto.randomBytes`).
- Dynamic client-side booking modal connected directly to `POST /api/book-listing`.

### 6. 💬 Context-Aware AI Concierge
- Integrated floating assistant powered by **Google Gemini 2.5 Flash Lite**.
- Contextually grounded in architectural history, local materials, and itinerary recommendations.
- Resilient with local fallback responses when offline or exceeding API quotas.

---

## 🏛️ Hybrid Polyglot Architecture

StayNest utilizes a dual-database design, applying the right database engine to the right domain:

```
                  ┌─────────────────────────────────────┐
                  │          StayNest Express 5         │
                  └──────────────┬──────────────┬───────┘
                                 │              │
             Listing Catalog & Reviews      ACID Ledger & Expeditions
                                 │              │
                                 ▼              ▼
                    ┌──────────────────┐  ┌──────────────────┐
                    │  MongoDB Atlas   │  │ SQLite (WAL Mode)│
                    │    (Mongoose)    │  │ (better-sqlite3) │
                    └──────────────────┘  └──────────────────┘
                    • Property Documents  • Reservations
                    • GeoJSON Coordinates • Residency Grants
                    • User Profiles       • Expeditions & Legs
                    • Rich Reviews        • Double-Booking Lock
```

- **MongoDB Atlas (Cloud NoSQL)**: Excels at flexible, deeply nested listing documents, unstructured amenities, GeoJSON coordinates, user profiles, and review threads.
- **SQLite with `better-sqlite3` (Relational SQL Ledger)**: Enforces strict relational foreign keys, zero double-booking concurrency guarantees, financial balances, and grant disbursements.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Backend Framework** | Express.js 5.1.0 | RESTful routing, async middleware, error handling |
| **Catalog Database** | MongoDB Atlas / Mongoose 8.19.1 | Listing documents, reviews, user accounts |
| **Transactional Ledger** | SQLite 3 (`better-sqlite3` 13.0) | ACID reservations, expeditions, grants, WAL mode |
| **Validation** | Joi 18.0.1 | Strict schema validation with coordinate bounds |
| **Security** | Helmet 8.3, Rate-Limit, Passport.js | Session auth, CSRF flash, cryptographic tokens |
| **Performance** | Compression 1.8.1 | Gzip/Brotli payload compression |
| **AI Integration** | Google Gemini 2.5 Flash Lite | Architectural concierge & natural-language reasoning |
| **Templates** | EJS + EJS-Mate 4.0.0 | Layouts, partials, server-rendered views |
| **Styling & UI** | Custom Vanilla CSS + Bootstrap | Editorial aesthetic, Cinzel & Plus Jakarta typography |
| **Image Pipeline** | Cloudinary API + Multer | Cloud media storage with automatic optimization |
| **Testing** | Jest 30.5.1 + Supertest 7.2.2 | Automated integration tests for ledger and schemas |
| **Containerization** | Docker & Docker Compose | Multi-container dev & production environments |

---

## 📋 Prerequisites

- **Node.js** v20+ and npm (v24 recommended)
- **MongoDB Atlas Account** (or local MongoDB via Docker)
- **Cloudinary Account** (for listing image uploads)
- **Google Gemini API Key** (for AI concierge assistance)

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Futurater/staynest.git
cd staynest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# MongoDB Atlas
ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/staynest?retryWrites=true&w=majority

# Session Security
SECRET=your_super_secret_session_key

# Cloudinary (Image Uploads)
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Application Settings
PORT=8080
NODE_ENV=development
```

### 4. Seed Database (Optional)
Populate sample architectural listings:
```bash
npm run seed
```

### 5. Start the Application
```bash
npm start
```
The application will be live at **http://localhost:8080/listings**.

---

## 🐳 Running with Docker

### Option 1: Docker Compose (Full Stack with Containerized MongoDB)
```bash
# Start StayNest app and local MongoDB
docker compose up -d

# Seed database with sample listings
docker compose exec web npm run seed

# View logs
docker compose logs -f web

# Stop containers
docker compose down
```

### Option 2: Docker Single Container (with MongoDB Atlas)
```bash
# Build Docker image
docker build -t staynest .

# Run container with environment variables
docker run -d -p 8080:8080 --env-file .env --name staynest-app staynest
```

---

## 🧪 Automated Testing

StayNest includes an automated Jest test suite testing relational SQL transactions, concurrency locks, and Joi validation schemas:

```bash
# Run all tests sequentially
npm test
```

### What is tested:
- **`tests/sql_ledger.test.js`**: Relational foreign keys, ACID reservation creation, conflict/double-booking detection, and residency grant ledger.
- **`tests/spatialMatch.test.js`**: AI spatial intent matching, brief validation, acoustic/daylight scoring, and residency grant subsidies.
- **`tests/expedition.test.js`**: Multi-leg route rendering, transit timeline calculations, slug routing, and SQL multi-leg booking.
- **`tests/schema.test.js`**: Joi validation schemas, category whitelist, price constraints, and 1–5 review rating boundaries.
- **`tests/api.test.js`**: Central routing, root redirects, AI concierge chat fallback and intent suggestions, 404 handler.
- **`tests/utils.test.js`**: Custom `ExpressError` and `wrapAsync` promise rejection handling.

---

## 🔄 API Reference

### Architectural Listings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/listings` | Catalog index with category filters & search | No |
| `GET` | `/listings/new` | Create listing form | Yes |
| `POST` | `/listings` | Create listing (with Cloudinary image) | Yes |
| `GET` | `/listings/:id` | Showcase view with architectural details & booking | No |
| `GET` | `/listings/:id/edit` | Edit listing form | Yes (Owner) |
| `PUT` | `/listings/:id` | Update listing | Yes (Owner) |
| `DELETE` | `/listings/:id` | Delete listing & associated reviews | Yes (Owner) |

### Transactional SQL Reservations & Grants
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/book-listing` | Atomically reserve a listing in the SQL ledger |
| `POST` | `/api/grants/apply` | Apply for cultural residency grant & stipend |
| `GET` | `/expeditions` | Browse curated multi-leg architectural expeditions |
| `GET` | `/expeditions/:id` | View detailed expedition itinerary and transit legs |

### Reviews & Ratings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/listings/:id/reviews` | Post review with 1–5 star rating | Yes |
| `DELETE` | `/listings/:id/reviews/:reviewId` | Delete review | Yes (Author) |

### AI Concierge & Spatial Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/spatial-match` | AI phenomenological & spatial intent matching |
| `POST` | `/api/ai-chat` | Interactive Gemini AI Concierge assistant |

---

## 📁 Project Directory Structure

```
staynest/
├── app.js                     # Express entry point, middleware & route mounting
├── cloudconfig.js             # Cloudinary & Multer configuration
├── database/
│   └── sql.js                 # SQLite relational ledger engine (better-sqlite3)
├── controllers/
│   ├── listings.js            # Listing business logic
│   ├── review.js              # Review business logic
│   └── user.js                # Authentication business logic
├── models/
│   ├── listings.js            # MongoDB Listing Mongoose schema
│   ├── review.js              # MongoDB Review Mongoose schema
│   └── user.js                # MongoDB User schema (passport-local-mongoose)
├── routes/
│   ├── listing.js             # Listing routes
│   ├── review.js              # Review routes
│   ├── user.js                # Auth routes
│   └── expedition.js          # Multi-leg expeditions routes
├── utils/
│   ├── categories.js          # Architectural category constants & icons
│   ├── ExpressError.js        # Custom error class
│   ├── isLoggedIn.js          # Authentication guard middleware
│   ├── isOwner.js             # Listing authorization middleware
│   ├── isReviewOwner.js       # Review authorization middleware
│   └── wrapAsync.js           # Async route wrapper
├── views/
│   ├── layouts/boilerplate.ejs# Master HTML boilerplate layout
│   ├── includes/
│   │   ├── navbar.ejs         # Responsive architectural navigation
│   │   ├── footer.ejs         # Editorial footer & colophon
│   │   └── flash.ejs          # Toast flash message system
│   ├── listings/
│   │   ├── index.ejs          # Catalog grid with intent search & filters
│   │   ├── show.ejs           # Showcase with architectural details & booking
│   │   ├── new.ejs            # Listing creation form
│   │   └── edit.ejs           # Listing edit form
│   ├── expeditions/
│   │   ├── index.ejs          # Expeditions catalog
│   │   └── show.ejs           # Expedition detail with itinerary legs
│   └── users/
│       ├── login.ejs          # Login page
│       └── signup.ejs         # Signup page
├── public/
│   ├── css/style.css          # Architectural design tokens & responsive CSS
│   ├── js/javas.js            # Client-side CAD simulator, booking modal, tax toggle
│   └── js/chat-widget.js      # Gemini AI Concierge interactive widget
├── tests/
│   ├── sql_ledger.test.js     # Transactional ledger & concurrency tests
│   ├── spatialMatch.test.js   # Spatial intent & residency grant tests
│   ├── expedition.test.js     # Multi-leg route engine tests
│   ├── schema.test.js         # Joi schema validation unit tests
│   ├── api.test.js            # API routing & AI concierge fallback tests
│   └── utils.test.js          # Helper & error handling unit tests
├── init/
│   ├── index.js               # Database seeder script
│   └── data.js                # Sample architectural listings dataset
├── Dockerfile                 # Production container definition
├── docker-compose.yml         # Multi-container orchestration
├── jest.config.js             # Jest configuration
├── schema.js                  # Joi validation schemas
└── package.json               # Dependencies and test scripts
```

---

## 🔒 Security & Hardening Features

- **Double-Booking Prevention**: Serialized atomic SQLite transactions ensure no two guests can claim overlapping check-in/check-out dates.
- **Strict Coordinate Validation**: Prevents invalid latitude (`-90` to `90`) and longitude (`-180` to `180`) injection into maps.
- **Input Whitelisting**: Strict Joi schema sanitization for all user-submitted form data.
- **Cryptographic Reference IDs**: Booking and grant reference codes generated with `crypto.randomBytes`.
- **Security Headers & Rate Limiting**: Powered by Helmet, express-rate-limit, and secure session cookies with `httpOnly`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
