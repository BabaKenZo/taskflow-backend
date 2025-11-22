
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5050;

// ---------------------------
// MIDDLEWARE
// ---------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------------------------
// ROUTES
// ---------------------------
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Test route
app.get("/api/test", (req, res) => res.send("✅ Backend route works!"));

// Root route for backend health check
app.get("/", (req, res) => res.send("TaskFlow Backend is running!"));

// ---------------------------
// SWAGGER SETUP
// ---------------------------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description: "API documentation for TaskFlow",
    },
    servers: [
      {
        url: "https://taskflow-backend-qpr4.onrender.com", // Update to your Render backend URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files with Swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---------------------------
// DATABASE CONNECTIONS
// ---------------------------

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// PostgreSQL via Prisma
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL via Prisma");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err);
  }
})();

// ---------------------------
// START SERVER
// ---------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Swagger docs: https://taskflow-backend-qpr4.onrender.com/api-docs`);
});
