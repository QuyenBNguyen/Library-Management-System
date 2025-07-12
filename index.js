const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const memberRoutes = require("./routes/memberRoutes");
const bookRoutes = require("./routes/bookRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const { authMiddleware } = require("./middleware/auth");

// Load env vars
dotenv.config();

// Connect to MongoDB
console.log("Attempting to connect to MongoDB at:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error(
      "Please make sure MongoDB is running at",
      process.env.MONGO_URI
    );
  });

const app = express();

// Body parser
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Serve login page as root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Mount routers
app.use("/auth", require("./routes/authRoutes"));
app.use("/manager", require("./routes/managerRoutes"));
app.use("/member", memberRoutes);
app.use(
  "/books",
  //  authMiddleware,
  bookRoutes
);
app.use(
  "/api/payment",
  // , authMiddleware
  paymentRoutes
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
