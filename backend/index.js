const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const memberRoutes = require("./routes/memberRoutes");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const loanRoutes = require("./routes/loanRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

// Load env vars
dotenv.config();

// Connect to MongoDB
console.log("Attempting to connect to MongoDB at:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error(
      "Please make sure MongoDB is running at",
      process.env.MONGO_URI
    );
  });

const app = express();

// Rate limiting middleware
app.use('/auth', apiLimiter);

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parser
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// Serve login page as root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Mount routers
app.use("/auth", require("./routes/authRoutes")); // Temporarily disabled rate limiting for development
app.use("/member", memberRoutes);
app.use("/users", authMiddleware, userRoutes); // User management routes

app.use("/api/books", authMiddleware, bookRoutes); // view, quản lý book
app.use("/api/loans", authMiddleware, loanRoutes); // mượn trả sách + lịch sử
app.use("/api/payments", paymentRoutes); // thanh toán
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
