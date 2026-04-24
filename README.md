# 🏡 StayNest - Property Rental Platform

A modern, full-stack web application for listing and renting properties with AI-powered chat assistance.

## 🚀 Features

- **Property Listings** - Browse and search for rental properties with filters
- **User Authentication** - Secure signup and login with passport-local-mongoose
- **Listings Management** - Create, edit, delete property listings
- **Reviews & Ratings** - Leave reviews and rate properties (1-5 stars)
- **Image Uploads** - Upload property images to Cloudinary
- **AI Chat Widget** - Powered by Google Gemini 2.5 Flash Lite API
- **Responsive Design** - Modern UI with white/black/pink color scheme
- **Filter System** - Filter by categories: Trending, Rooms, Beachfront, Cabins, Castles, Camping, Arctic, Pools, Countryside, Luxury, City, Farms
- **Session Management** - 7-day session expiry with secure cookies

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Express.js 5.1.0 (Node.js) |
| **Database** | MongoDB Atlas (Cloud) with Mongoose 8.19.1 |
| **Authentication** | Passport.js 0.7.0 + passport-local-mongoose |
| **File Storage** | Cloudinary API |
| **AI Integration** | Google Gemini 2.5 Flash Lite API |
| **Template Engine** | EJS with ejs-mate 4.0.0 |
| **Styling** | Bootstrap 4.6.2 + Custom CSS |
| **Frontend** | Vanilla JavaScript + Font Awesome 7.0.1 |
| **HTTP Client** | node-fetch |
| **Session Store** | express-session with connect-flash |

---

## 📋 Prerequisites

- **Node.js** v24+ and npm
- **MongoDB Atlas Account** (free tier available)
- **Cloudinary Account** (free tier available)
- **Google Gemini API Key** (free tier available)
- **Vercel Account** (for deployment)

---

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Futurater/staynest.git
cd staynest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with:

```env
# Cloudinary (Image uploads)
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret

# MongoDB Atlas
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/staynest

# Session & Security
SECRET=your_secure_random_key

# Application
NODE_ENV=development
PORT=8080

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Seed Database (Optional)

Add sample listings:
```bash
node init/index.js
```

Or visit `/api/seed` endpoint after starting the app.

---

## 🚀 Running Locally

```bash
npm start
```

Server will run on **http://localhost:8080**

Visit: **http://localhost:8080/listings**

---

## 📤 Deployment to Vercel

### 1. Connect GitHub to Vercel
1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Select GitHub repository: `Futurater/staynest`
4. Click **Import**

### 2. Set Environment Variables
In Vercel Project Settings → **Environment Variables**, add:

```
ATLASDB_URL = mongodb+srv://username:password@cluster.mongodb.net/staynest
GEMINI_API_KEY = your_gemini_api_key
CLOUD_NAME = your_cloudinary_name
CLOUD_API_KEY = your_cloudinary_key
CLOUD_API_SECRET = your_cloudinary_secret
SECRET = your_secure_random_key
NODE_ENV = production
```

### 3. Whitelist IP in MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Select your cluster → **Network Access**
3. Click **Add IP Address** → **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

### 4. Deploy
Vercel will auto-deploy on git push to main branch.

### 5. Seed Production Database
Visit: `https://your-vercel-url.vercel.app/api/seed`

---

## 📁 Project Structure

```
staynest/
├── app.js                 # Main Express application
├── cloudconfig.js         # Cloudinary configuration
├── controllers/           # Business logic
│   ├── listings.js
│   ├── review.js
│   └── user.js
├── models/                # Database schemas
│   ├── listings.js
│   ├── review.js
│   └── user.js
├── routes/                # API endpoints
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/                 # EJS templates
│   ├── listings/
│   ├── users/
│   └── includes/
├── public/                # Static files
│   ├── css/style.css
│   ├── js/chat-widget.js
│   └── js/javas.js
├── utils/                 # Helper functions
│   ├── ExpressError.js
│   ├── isLoggedIn.js
│   ├── isOwner.js
│   ├── isReviewOwner.js
│   └── wrapAsync.js
├── init/                  # Database initialization
│   ├── index.js
│   └── data.js
├── .env                   # Environment variables (not in git)
├── package.json
└── vercel.json           # Vercel configuration
```

---

## 🔐 Security Features

- ✅ Password hashing with passport-local-mongoose
- ✅ Session-based authentication
- ✅ Authorization middleware (isLoggedIn, isOwner, isReviewOwner)
- ✅ Email validation and uniqueness
- ✅ Review ownership verification
- ✅ HTTP-only secure cookies
- ✅ CSRF protection with flash messages
- ✅ Environment variables for sensitive data

---

## 🎨 Design System

- **Colors**: White (#ffffff), Black (#000000), Hot Pink (#ff1493)
- **Typography**: Bootstrap defaults
- **Spacing**: Bootstrap grid system
- **Animations**: Float, slideIn, slideUp, hover transforms
- **Icons**: Font Awesome 7.0.1

---

## 🤖 AI Chat Widget

The AI chat widget uses Google Gemini 2.5 Flash Lite API with:
- 6 suggestion buttons
- Real-time typing indicator
- Local fallback responses
- Context-aware recommendations
- Floating button design

---

## 🔄 API Endpoints

### Listings
```
GET    /listings              - List all properties
POST   /listings              - Create new listing
GET    /listings/:id          - Show property details
PUT    /listings/:id          - Update listing
DELETE /listings/:id          - Delete listing
```

### Reviews
```
POST   /listings/:id/reviews           - Add review
DELETE /listings/:id/reviews/:reviewId - Delete review
```

### Users
```
POST   /signup                - Register new user
POST   /login                 - User login
GET    /logout                - User logout
```

### AI
```
POST   /api/ai-chat           - Chat with Gemini AI
GET    /api/seed              - Seed database with sample listings
```

---

## 🌍 Environment Variables Guide

See [ENV_VARIABLES.md](ENV_VARIABLES.md) for detailed documentation on:
- All variables with values
- Where to rotate credentials
- Contact information
- Rotation schedules

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check MongoDB Atlas IP whitelist
- Verify `ATLASDB_URL` in `.env`
- Ensure cluster is active

### "No listings available"
- Run `/api/seed` endpoint to populate database
- Check MongoDB Atlas has data

### "Image uploads not working"
- Verify Cloudinary credentials
- Check image size limits

### "AI chat not responding"
- Verify `GEMINI_API_KEY` is set
- Check Google Generative AI quota
- Local fallback will respond if API fails

---

## 📞 Support & Contact

- **Database Issues**: MongoDB Admin
- **API Keys**: Google Cloud Console, Cloudinary
- **Deployment**: Vercel Dashboard
- **Repository**: https://github.com/Futurater/staynest

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🎯 Recent Updates (April 2026)

- ✅ Root redirect to `/listings`
- ✅ `/api/seed` endpoint for database population
- ✅ MongoDB Atlas integration
- ✅ Complete environment variables documentation
- ✅ Gemini 2.5 Flash Lite AI integration
- ✅ Review ownership authorization
- ✅ Email validation and uniqueness
- ✅ Modern white/black/pink UI design
- ✅ Responsive filter system
- ✅ Floating AI chat widget

---

**Last Updated**: April 24, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
