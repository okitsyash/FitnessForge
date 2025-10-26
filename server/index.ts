import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from "dotenv";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import cors from "cors";
import { connectDB } from "./db";
import { createServer } from "http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add Clerk authentication middleware
app.use(ClerkExpressWithAuth());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Create HTTP server
    const server = createServer(app);

    // Setup Vite in development mode
    if (process.env.NODE_ENV === 'development') {
      await setupVite(app, server);
    } else {
      // Serve static files in production
      serveStatic(app);
    }

    // Then register routes
    await registerRoutes(app);
    const port = process.env.PORT || 3001;

    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
      if (process.env.NODE_ENV === 'development') {
        console.log('Vite development server is running');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
