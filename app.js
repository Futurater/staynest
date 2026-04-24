if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRoutes = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/peppyz";
const sessionSecret = process.env.SECRET || "mysupersecretcode";
const isProduction = process.env.NODE_ENV === "production";
let dbConnectPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (mongoose.connection.readyState === 2 && dbConnectPromise) {
    await dbConnectPromise;
    return;
  }
  dbConnectPromise = mongoose.connect(dbUrl);
  await dbConnectPromise;
  console.log("connected to DB");
}

connectDB().catch((err) => {
  console.log("DB connection error:", err.message);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  next();
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(new ExpressError(500, "Database connection failed"));
  }
});

// AI Chat endpoint for Gemini API (MUST be before routes)
app.post("/api/ai-chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey || geminiApiKey === "your_gemini_api_key_here") {
      // Fallback to local AI if API key not set
      const response = await generateLocalResponse(message);
      return res.json({ response });
    }

    // Call Gemini API with 2.5 Flash Lite model
    const fetch = (await import("node-fetch")).default;
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + geminiApiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful AI assistant for StayNest, a property rental platform. Provide helpful, concise responses (2-3 sentences). Context: ${message}. Give specific suggestions related to StayNest listings or features.`
          }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      const fallback = await generateLocalResponse(message);
      return res.json({ response: fallback });
    }

    const data = await geminiResponse.json();
    const response = data.candidates[0]?.content?.parts[0]?.text || "I'm here to help! Ask me about finding stays, categories, or creating listings.";
    res.json({ response });
  } catch (error) {
    console.error("AI Chat error:", error);
    const fallback = await generateLocalResponse(req.body.message);
    res.json({ response: fallback });
  }
});

// Seed API endpoint - Populate database with sample listings
app.get("/api/seed", async (req, res) => {
  try {
    await connectDB();
    
    // Import seed data
    const initData = require("./init/data.js");
    const Listing = require("./models/listings.js");
    
    // Clear existing listings
    await Listing.deleteMany({});
    console.log("Cleared existing listings");
    
    // Insert seed data
    await Listing.insertMany(initData.data);
    console.log("Database seeded successfully");
    
    res.json({
      success: true,
      message: "Database seeded with " + initData.data.length + " listings!",
      count: initData.data.length
    });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Redirect root to listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRoutes);

// Local AI response generator (fallback)
async function generateLocalResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("beach") || lowerMessage.includes("ocean")) {
    return "🏖️ Looking for beachfront paradise? Check out our Beachfront category! You'll find stunning ocean-view properties perfect for a relaxing getaway.";
  } else if (lowerMessage.includes("mountain") || lowerMessage.includes("cabin")) {
    return "⛰️ Mountain lovers unite! Explore our Cabins, Arctic, and Countryside categories for cozy retreats surrounded by nature.";
  } else if (lowerMessage.includes("luxury") || lowerMessage.includes("expensive")) {
    return "✨ Ready for the finer things? Our Luxury category features premium stays with world-class amenities and stunning views.";
  } else if (lowerMessage.includes("budget") || lowerMessage.includes("cheap") || lowerMessage.includes("affordable")) {
    return "💰 Smart shopping! Filter by price to find amazing stays that won't break the bank. Quality experiences at great prices!";
  } else if (lowerMessage.includes("pet") || lowerMessage.includes("dog") || lowerMessage.includes("cat")) {
    return "🐕 Traveling with furry friends? You can add pet policies in listing descriptions. Check individual property details for pet-friendly options!";
  } else if (lowerMessage.includes("how to") || lowerMessage.includes("create") || lowerMessage.includes("list")) {
    return "📝 Ready to list your property? Click 'New Home' in the navigation to create your first listing. Add photos, description, and pricing!";
  } else if (lowerMessage.includes("review") || lowerMessage.includes("rating")) {
    return "⭐ Reviews help travelers make great decisions! Leave detailed reviews to help the community find amazing stays. You can rate 1-5 stars.";
  } else if (lowerMessage.includes("trending") || lowerMessage.includes("popular")) {
    return "🔥 Check out our Trending category to see what's hot right now! Updated regularly with the most popular stays.";
  } else if (lowerMessage.includes("city") || lowerMessage.includes("urban")) {
    return "🏙️ Urban explorer? Our City category has stylish apartments and modern lofts in vibrant downtown locations!";
  } else {
    const responses = [
      "💡 That's an interesting question! Try filtering by category to find exactly what you're looking for.",
      "🤔 I can help with finding stays, explaining categories, or answering questions about StayNest!",
      "✨ Great question! Browse our listings or let me know if you'd like specific recommendations.",
      "🎯 I'm here to help! What would you like to know about StayNest?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// if user types a route which is not defined
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// central error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  if (process.env.NODE_ENV !== "test") {
    console.error("ERROR:", err.message);
  }
  res.status(statusCode).render("error.ejs", { message });
});

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
