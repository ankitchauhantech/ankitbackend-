const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const apiRoutes = require("./routes/api");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization
db.init();

// API Routes
app.use("/api", apiRoutes);

// Root health route
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio CMS Backend API is running",
    endpoints: {
      health: "/api/health",
      projects: "/api/projects",
      services: "/api/services",
      posts: "/api/posts",
      testimonials: "/api/testimonials",
      contacts: "/api/contacts",
      auth: "/api/auth/login",
      admin: "/api/admin/dashboard",
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend API Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/`);
});

module.exports = app;