import { Express, Request, Response, RequestHandler } from "express";
import { createServer } from "http";
import { requireAuth, getCurrentUserId } from "./clerkAuth";
import { User, Workout, Nutrition, WaterIntake, DailyGoal } from "./db";
import type { AuthObject } from "@clerk/clerk-sdk-node";

type RequestWithAuth = Request & { auth: AuthObject };

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Public routes
  app.get("/api/health", ((_: Request, res: Response) => {
    res.json({ status: "ok" });
  }) as RequestHandler);

  // Protected routes
  app.use("/api", requireAuth);

  // Stats endpoint
  app.get("/api/stats", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const user = await User.findOne({ clerkId: userId });
      const totalWorkouts = await Workout.find({ userId });
      const totalCalories = totalWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);

      res.json({
        user,
        totalWorkouts: totalWorkouts.length,
        totalCalories,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // Daily goals endpoint
  app.get("/api/daily-goals", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const goals = await DailyGoal.find({
        userId,
        createdAt: { $gte: today, $lt: tomorrow }
      });

      res.json(goals);
    } catch (error) {
      console.error("Error fetching daily goals:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // Water intake endpoint
  app.get("/api/water-intake", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const intake = await WaterIntake.find({
        userId,
        createdAt: { $gte: today, $lt: tomorrow }
      });

      const totalGlasses = intake.reduce((sum, entry) => sum + entry.amount, 0) / 250; // Assuming 250ml per glass

      res.json({ glasses: Math.round(totalGlasses) });
    } catch (error) {
      console.error("Error fetching water intake:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // User profile
  app.get("/api/user", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      let user = await User.findOne({ clerkId: userId });

      if (!user) {
        // Create user if they don't exist
        user = await User.create({
          clerkId: userId,
          username: (req as RequestWithAuth).auth?.user?.username || `user_${userId.slice(0, 8)}`,
          email: (req as RequestWithAuth).auth?.user?.emailAddresses[0]?.emailAddress || "",
        });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // Workouts
  app.get("/api/workouts", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const userWorkouts = await Workout.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);
      res.json(userWorkouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  app.post("/api/workouts", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const { type, duration, caloriesBurned, notes } = req.body;

      const workout = await Workout.create({
        userId,
        type,
        duration,
        caloriesBurned,
        notes,
      });

      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // Nutrition
  app.get("/api/nutrition", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const meals = await Nutrition.find({
        userId,
        createdAt: { $gte: today, $lt: tomorrow }
      }).sort({ createdAt: -1 });

      res.json(meals);
    } catch (error) {
      console.error("Error fetching nutrition:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  app.post("/api/nutrition", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const { mealType, foodItem, calories, protein, carbs, fat } = req.body;

      const meal = await Nutrition.create({
        userId,
        mealType,
        food: foodItem,
        calories,
        protein,
        carbs,
        fat,
      });

      res.json(meal);
    } catch (error) {
      console.error("Error creating nutrition entry:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // Water Intake
  app.post("/api/water-intake", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const { amount } = req.body;

      const waterEntry = await WaterIntake.create({
        userId,
        amount,
      });

      res.json(waterEntry);
    } catch (error) {
      console.error("Error creating water intake entry:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  // Daily Goals
  app.post("/api/daily-goals", (async (req: Request, res: Response) => {
    try {
      const userId = getCurrentUserId(req as RequestWithAuth);
      const { type, target } = req.body;

      const goal = await DailyGoal.create({
        userId,
        type,
        target,
        current: 0,
        completed: false,
      });

      res.json(goal);
    } catch (error) {
      console.error("Error creating daily goal:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler);

  return server;
}
