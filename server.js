require("dotenv").config();
const express = require("express");
const app = express();
const socket = require("socket.io");
const mainRouter = require("./router/index");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./dbLayer/connection");

connectDB();

const allowedOrigins = ["http://localhost:3000", "http://localhost:8080"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies
  })
);

// ✅ FIX: Move these above routes
app.use(express.json());  // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ FIX: Now define routes after middleware
app.use("/api", mainRouter);

console.log("Frontend URL:", process.env.FRONTEND_URL);

// ✅ FIX: Socket should use an HTTP server, not `app`
const server = app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
});

// ✅ FIX: Attach socket.io properly
const io = socket(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    },
});
