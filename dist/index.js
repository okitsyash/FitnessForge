var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  achievementsRelations: () => achievementsRelations,
  challenges: () => challenges,
  challengesRelations: () => challengesRelations,
  chatHistory: () => chatHistory,
  chatHistoryRelations: () => chatHistoryRelations,
  dailyGoals: () => dailyGoals,
  dailyGoalsRelations: () => dailyGoalsRelations,
  friendships: () => friendships,
  friendshipsRelations: () => friendshipsRelations,
  insertChallengeSchema: () => insertChallengeSchema,
  insertChatHistorySchema: () => insertChatHistorySchema,
  insertDailyGoalSchema: () => insertDailyGoalSchema,
  insertFriendshipSchema: () => insertFriendshipSchema,
  insertNutritionSchema: () => insertNutritionSchema,
  insertUserSchema: () => insertUserSchema,
  insertWaterIntakeSchema: () => insertWaterIntakeSchema,
  insertWorkoutPlanSchema: () => insertWorkoutPlanSchema,
  insertWorkoutSchema: () => insertWorkoutSchema,
  nutrition: () => nutrition,
  nutritionRelations: () => nutritionRelations,
  sessions: () => sessions,
  users: () => users,
  usersRelations: () => usersRelations,
  waterIntake: () => waterIntake,
  waterIntakeRelations: () => waterIntakeRelations,
  workoutPlans: () => workoutPlans,
  workoutPlansRelations: () => workoutPlansRelations,
  workouts: () => workouts,
  workoutsRelations: () => workoutsRelations
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Fitness profile fields
  age: integer("age"),
  height: decimal("height", { precision: 5, scale: 2 }),
  // in cm
  currentWeight: decimal("current_weight", { precision: 5, scale: 2 }),
  // in kg
  goalWeight: decimal("goal_weight", { precision: 5, scale: 2 }),
  // in kg
  activityLevel: varchar("activity_level"),
  fitnessGoal: varchar("fitness_goal"),
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0)
});
var workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseType: varchar("exercise_type").notNull(),
  duration: integer("duration").notNull(),
  // in minutes
  intensity: varchar("intensity").notNull(),
  // low, moderate, high, very_high
  caloriesBurned: integer("calories_burned"),
  notes: text("notes"),
  pointsEarned: integer("points_earned").default(0),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var nutrition = pgTable("nutrition", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  mealType: varchar("meal_type").notNull(),
  // breakfast, lunch, dinner, snack
  foodItem: varchar("food_item").notNull(),
  quantity: varchar("quantity"),
  calories: integer("calories"),
  protein: decimal("protein", { precision: 5, scale: 2 }),
  carbs: decimal("carbs", { precision: 5, scale: 2 }),
  fat: decimal("fat", { precision: 5, scale: 2 }),
  date: date("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow()
});
var waterIntake = pgTable("water_intake", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  glasses: integer("glasses").default(0),
  date: date("date").defaultNow()
});
var dailyGoals = pgTable("daily_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  goalType: varchar("goal_type").notNull(),
  // steps, water, workout, calories
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  completed: boolean("completed").default(false),
  pointsValue: integer("points_value").default(0),
  date: date("date").defaultNow()
});
var friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  friendId: varchar("friend_id").notNull().references(() => users.id),
  status: varchar("status").default("pending"),
  // pending, accepted, blocked
  createdAt: timestamp("created_at").defaultNow()
});
var challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: varchar("creator_id").notNull().references(() => users.id),
  participantId: varchar("participant_id").notNull().references(() => users.id),
  challengeType: varchar("challenge_type").notNull(),
  // steps, workouts, calories
  title: varchar("title").notNull(),
  description: text("description"),
  targetValue: integer("target_value"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: varchar("status").default("active"),
  // active, completed, cancelled
  winnerId: varchar("winner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: varchar("achievement_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  pointsAwarded: integer("points_awarded").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow()
});
var workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  plan: jsonb("plan").notNull(),
  // AI-generated workout plan
  difficulty: varchar("difficulty"),
  // beginner, intermediate, advanced
  daysPerWeek: integer("days_per_week"),
  createdByAi: boolean("created_by_ai").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  messageType: varchar("message_type").default("fitness"),
  // fitness, nutrition, motivation
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  workouts: many(workouts),
  nutrition: many(nutrition),
  waterIntake: many(waterIntake),
  dailyGoals: many(dailyGoals),
  friendships: many(friendships, { relationName: "user_friendships" }),
  friends: many(friendships, { relationName: "friend_friendships" }),
  createdChallenges: many(challenges, { relationName: "creator_challenges" }),
  participantChallenges: many(challenges, { relationName: "participant_challenges" }),
  achievements: many(achievements),
  workoutPlans: many(workoutPlans),
  chatHistory: many(chatHistory)
}));
var workoutsRelations = relations(workouts, ({ one }) => ({
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id]
  })
}));
var nutritionRelations = relations(nutrition, ({ one }) => ({
  user: one(users, {
    fields: [nutrition.userId],
    references: [users.id]
  })
}));
var waterIntakeRelations = relations(waterIntake, ({ one }) => ({
  user: one(users, {
    fields: [waterIntake.userId],
    references: [users.id]
  })
}));
var dailyGoalsRelations = relations(dailyGoals, ({ one }) => ({
  user: one(users, {
    fields: [dailyGoals.userId],
    references: [users.id]
  })
}));
var friendshipsRelations = relations(friendships, ({ one }) => ({
  user: one(users, {
    fields: [friendships.userId],
    references: [users.id],
    relationName: "user_friendships"
  }),
  friend: one(users, {
    fields: [friendships.friendId],
    references: [users.id],
    relationName: "friend_friendships"
  })
}));
var challengesRelations = relations(challenges, ({ one }) => ({
  creator: one(users, {
    fields: [challenges.creatorId],
    references: [users.id],
    relationName: "creator_challenges"
  }),
  participant: one(users, {
    fields: [challenges.participantId],
    references: [users.id],
    relationName: "participant_challenges"
  }),
  winner: one(users, {
    fields: [challenges.winnerId],
    references: [users.id]
  })
}));
var achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id]
  })
}));
var workoutPlansRelations = relations(workoutPlans, ({ one }) => ({
  user: one(users, {
    fields: [workoutPlans.userId],
    references: [users.id]
  })
}));
var chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  user: one(users, {
    fields: [chatHistory.userId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  date: true,
  pointsEarned: true
});
var insertNutritionSchema = createInsertSchema(nutrition).omit({
  id: true,
  createdAt: true,
  date: true
});
var insertWaterIntakeSchema = createInsertSchema(waterIntake).omit({
  id: true,
  date: true
});
var insertDailyGoalSchema = createInsertSchema(dailyGoals).omit({
  id: true,
  date: true
});
var insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
  status: true
});
var insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  status: true,
  winnerId: true
});
var insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
  createdByAi: true
});
var insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserProfile(id, data) {
    const [user] = await db.update(users).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user;
  }
  // Workout operations
  async createWorkout(workout) {
    let points = Math.round(workout.duration * 0.5);
    switch (workout.intensity) {
      case "low":
        points *= 1;
        break;
      case "moderate":
        points *= 1.2;
        break;
      case "high":
        points *= 1.5;
        break;
      case "very_high":
        points *= 1.8;
        break;
    }
    const [newWorkout] = await db.insert(workouts).values({ ...workout, pointsEarned: Math.round(points) }).returning();
    await db.update(users).set({
      totalPoints: sql`${users.totalPoints} + ${points}`,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, workout.userId));
    return newWorkout;
  }
  async getUserWorkouts(userId, limit = 10) {
    return await db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(desc(workouts.date)).limit(limit);
  }
  async getWorkoutsByDateRange(userId, startDate, endDate) {
    return await db.select().from(workouts).where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.date, startDate),
        lte(workouts.date, endDate)
      )
    ).orderBy(desc(workouts.date));
  }
  // Nutrition operations
  async createNutrition(nutritionData) {
    const [newNutrition] = await db.insert(nutrition).values(nutritionData).returning();
    return newNutrition;
  }
  async getUserNutrition(userId, date2) {
    const whereCondition = date2 ? and(eq(nutrition.userId, userId), eq(nutrition.date, date2)) : eq(nutrition.userId, userId);
    return await db.select().from(nutrition).where(whereCondition).orderBy(desc(nutrition.createdAt));
  }
  async getNutritionByDateRange(userId, startDate, endDate) {
    return await db.select().from(nutrition).where(
      and(
        eq(nutrition.userId, userId),
        gte(nutrition.date, startDate),
        lte(nutrition.date, endDate)
      )
    ).orderBy(desc(nutrition.date));
  }
  // Water intake operations
  async updateWaterIntake(waterIntakeData) {
    const [water] = await db.insert(waterIntake).values(waterIntakeData).onConflictDoUpdate({
      target: [waterIntake.userId, waterIntake.date],
      set: { glasses: waterIntakeData.glasses }
    }).returning();
    return water;
  }
  async getWaterIntake(userId, date2) {
    const [water] = await db.select().from(waterIntake).where(and(eq(waterIntake.userId, userId), eq(waterIntake.date, date2)));
    return water;
  }
  // Daily goals operations
  async createDailyGoal(goal) {
    const [newGoal] = await db.insert(dailyGoals).values(goal).returning();
    return newGoal;
  }
  async updateDailyGoal(goalId, currentValue, completed) {
    const [goal] = await db.update(dailyGoals).set({ currentValue, completed }).where(eq(dailyGoals.id, goalId)).returning();
    return goal;
  }
  async getUserDailyGoals(userId, date2) {
    return await db.select().from(dailyGoals).where(and(eq(dailyGoals.userId, userId), eq(dailyGoals.date, date2)));
  }
  // Friends operations
  async sendFriendRequest(friendship) {
    const [newFriendship] = await db.insert(friendships).values(friendship).returning();
    return newFriendship;
  }
  async acceptFriendRequest(friendshipId) {
    const [friendship] = await db.update(friendships).set({ status: "accepted" }).where(eq(friendships.id, friendshipId)).returning();
    return friendship;
  }
  async getUserFriends(userId) {
    const friendIds = await db.select({ friendId: friendships.friendId }).from(friendships).where(and(eq(friendships.userId, userId), eq(friendships.status, "accepted")));
    if (friendIds.length === 0) return [];
    return await db.select().from(users).where(sql`${users.id} IN ${friendIds.map((f) => f.friendId)}`);
  }
  async getFriendRequests(userId) {
    return await db.select().from(friendships).where(and(eq(friendships.friendId, userId), eq(friendships.status, "pending")));
  }
  // Challenge operations
  async createChallenge(challenge) {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }
  async getUserChallenges(userId) {
    return await db.select().from(challenges).where(
      or(
        eq(challenges.creatorId, userId),
        eq(challenges.participantId, userId)
      )
    ).orderBy(desc(challenges.createdAt));
  }
  async updateChallenge(challengeId, data) {
    const [challenge] = await db.update(challenges).set(data).where(eq(challenges.id, challengeId)).returning();
    return challenge;
  }
  // Achievement operations
  async getUserAchievements(userId) {
    return await db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.unlockedAt));
  }
  // Workout plan operations
  async createWorkoutPlan(plan) {
    const [newPlan] = await db.insert(workoutPlans).values(plan).returning();
    return newPlan;
  }
  async getUserWorkoutPlans(userId) {
    return await db.select().from(workoutPlans).where(eq(workoutPlans.userId, userId)).orderBy(desc(workoutPlans.createdAt));
  }
  // Chat history operations
  async createChatHistory(chat) {
    const [newChat] = await db.insert(chatHistory).values(chat).returning();
    return newChat;
  }
  async getUserChatHistory(userId, limit = 50) {
    return await db.select().from(chatHistory).where(eq(chatHistory.userId, userId)).orderBy(desc(chatHistory.createdAt)).limit(limit);
  }
  // Leaderboard operations
  async getLeaderboard(period) {
    return await db.select().from(users).orderBy(desc(users.totalPoints)).limit(10);
  }
  async getUserStats(userId) {
    const user = await this.getUser(userId);
    const workoutCount = await db.select({ count: sql`count(*)` }).from(workouts).where(eq(workouts.userId, userId));
    const totalCalories = await db.select({ total: sql`sum(${workouts.caloriesBurned})` }).from(workouts).where(eq(workouts.userId, userId));
    return {
      user,
      totalWorkouts: workoutCount[0]?.count || 0,
      totalCalories: totalCalories[0]?.total || 0
    };
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.redirect("/api/login");
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    return res.redirect("/api/login");
  }
};

// server/routes.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
var genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
var model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.put("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.updateUserProfile(userId, req.body);
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.post("/api/workouts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const processedData = {
        ...req.body,
        userId,
        duration: req.body.duration ? parseInt(req.body.duration) : null,
        caloriesBurned: req.body.caloriesBurned ? parseInt(req.body.caloriesBurned) : null,
        sets: req.body.sets ? parseInt(req.body.sets) : null,
        reps: req.body.reps ? parseInt(req.body.reps) : null,
        weight: req.body.weight ? parseFloat(req.body.weight) : null
      };
      const workoutData = insertWorkoutSchema.parse(processedData);
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error) {
      console.error("Error creating workout:", error);
      res.status(500).json({ message: "Failed to create workout" });
    }
  });
  app2.get("/api/workouts", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const workouts2 = await storage.getUserWorkouts(userId, limit);
      res.json(workouts2);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });
  app2.get("/api/workouts/range", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      const workouts2 = await storage.getWorkoutsByDateRange(userId, start, end);
      res.json(workouts2);
    } catch (error) {
      console.error("Error fetching workouts by range:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });
  app2.post("/api/nutrition", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const processedData = {
        ...req.body,
        userId,
        calories: req.body.calories ? parseInt(req.body.calories) : null,
        protein: req.body.protein || null,
        carbs: req.body.carbs || null,
        fat: req.body.fat || null,
        quantity: req.body.quantity || null
      };
      const nutritionData = insertNutritionSchema.parse(processedData);
      const nutrition2 = await storage.createNutrition(nutritionData);
      res.json(nutrition2);
    } catch (error) {
      console.error("Error creating nutrition entry:", error);
      res.status(500).json({ message: "Failed to create nutrition entry" });
    }
  });
  app2.get("/api/nutrition", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const date2 = req.query.date ? new Date(req.query.date) : void 0;
      const nutrition2 = await storage.getUserNutrition(userId, date2);
      res.json(nutrition2);
    } catch (error) {
      console.error("Error fetching nutrition:", error);
      res.status(500).json({ message: "Failed to fetch nutrition" });
    }
  });
  app2.post("/api/water-intake", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const waterData = insertWaterIntakeSchema.parse({ ...req.body, userId });
      const water = await storage.updateWaterIntake(waterData);
      res.json(water);
    } catch (error) {
      console.error("Error updating water intake:", error);
      res.status(500).json({ message: "Failed to update water intake" });
    }
  });
  app2.get("/api/water-intake", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const date2 = new Date(
        req.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      );
      const water = await storage.getWaterIntake(userId, date2);
      res.json(water || { glasses: 0 });
    } catch (error) {
      console.error("Error fetching water intake:", error);
      res.status(500).json({ message: "Failed to fetch water intake" });
    }
  });
  app2.post("/api/daily-goals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalData = insertDailyGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createDailyGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating daily goal:", error);
      res.status(500).json({ message: "Failed to create daily goal" });
    }
  });
  app2.get("/api/daily-goals", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const date2 = new Date(
        req.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      );
      const goals = await storage.getUserDailyGoals(userId, date2);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching daily goals:", error);
      res.status(500).json({ message: "Failed to fetch daily goals" });
    }
  });
  app2.put("/api/daily-goals/:id", isAuthenticated, async (req, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const { currentValue, completed } = req.body;
      const goal = await storage.updateDailyGoal(
        goalId,
        currentValue,
        completed
      );
      res.json(goal);
    } catch (error) {
      console.error("Error updating daily goal:", error);
      res.status(500).json({ message: "Failed to update daily goal" });
    }
  });
  app2.post("/api/friends/request", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const friendshipData = insertFriendshipSchema.parse({
        userId,
        friendId: req.body.friendId
      });
      const friendship = await storage.sendFriendRequest(friendshipData);
      res.json(friendship);
    } catch (error) {
      console.error("Error sending friend request:", error);
      res.status(500).json({ message: "Failed to send friend request" });
    }
  });
  app2.post(
    "/api/friends/accept/:id",
    isAuthenticated,
    async (req, res) => {
      try {
        const friendshipId = parseInt(req.params.id);
        const friendship = await storage.acceptFriendRequest(friendshipId);
        res.json(friendship);
      } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Failed to accept friend request" });
      }
    }
  );
  app2.get("/api/friends", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const friends = await storage.getUserFriends(userId);
      res.json(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });
  app2.get("/api/friends/requests", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getFriendRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Failed to fetch friend requests" });
    }
  });
  app2.post("/api/challenges", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const challengeData = insertChallengeSchema.parse({
        ...req.body,
        creatorId: userId
      });
      const challenge = await storage.createChallenge(challengeData);
      res.json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  app2.get("/api/challenges", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const challenges2 = await storage.getUserChallenges(userId);
      res.json(challenges2);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  app2.get("/api/achievements", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements2 = await storage.getUserAchievements(userId);
      res.json(achievements2);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  app2.post("/api/workout-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const planData = insertWorkoutPlanSchema.parse({ ...req.body, userId });
      const plan = await storage.createWorkoutPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating workout plan:", error);
      res.status(500).json({ message: "Failed to create workout plan" });
    }
  });
  app2.get("/api/workout-plans", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const plans = await storage.getUserWorkoutPlans(userId);
      res.json(plans);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });
  app2.post("/api/ai/chat", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, messageType = "fitness" } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      const user = await storage.getUser(userId);
      const userStats = await storage.getUserStats(userId);
      let prompt = `You are a professional fitness coach and nutritionist. `;
      if (user) {
        prompt += `The user is ${user.age || "unknown"} years old, `;
        if (user.fitnessGoal) {
          prompt += `with a goal to ${user.fitnessGoal.replace("_", " ")}, `;
        }
        if (user.activityLevel) {
          prompt += `and has a ${user.activityLevel.replace("_", " ")} activity level. `;
        }
      }
      prompt += `They have completed ${userStats.totalWorkouts} workouts and burned ${userStats.totalCalories} calories so far. `;
      prompt += `Please provide helpful, encouraging, and personalized advice. `;
      prompt += `Keep your response concise but informative. `;
      prompt += `User's question: ${message}`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      await storage.createChatHistory({
        userId,
        message,
        response,
        messageType
      });
      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });
  app2.post("/api/ai/workout-plan", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { goal, experience, daysPerWeek } = req.body;
      const user = await storage.getUser(userId);
      let prompt = `Create a detailed workout plan for a user with the following profile: `;
      prompt += `Goal: ${goal}, Experience level: ${experience}, Days per week: ${daysPerWeek}. `;
      if (user) {
        prompt += `Age: ${user.age || "unknown"}, `;
        if (user.fitnessGoal) {
          prompt += `Fitness goal: ${user.fitnessGoal.replace("_", " ")}, `;
        }
      }
      prompt += `Please provide a structured weekly workout plan with specific exercises, sets, reps, and rest periods. `;
      prompt += `Format the response as a JSON object with days as keys and exercise arrays as values. `;
      prompt += `Each exercise should have: name, sets, reps, rest, notes.`;
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      let planData;
      try {
        planData = JSON.parse(response);
      } catch {
        planData = { description: response };
      }
      const workoutPlan = await storage.createWorkoutPlan({
        userId,
        title: `${goal} - ${experience} Plan`,
        description: `AI-generated ${daysPerWeek} day workout plan`,
        plan: planData,
        difficulty: experience,
        daysPerWeek: parseInt(daysPerWeek)
      });
      res.json(workoutPlan);
    } catch (error) {
      console.error("Error generating workout plan:", error);
      res.status(500).json({ message: "Failed to generate workout plan" });
    }
  });
  app2.get("/api/chat-history", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : void 0;
      const history = await storage.getUserChatHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });
  app2.get("/api/leaderboard", isAuthenticated, async (req, res) => {
    try {
      const period = req.query.period || "week";
      const leaderboard = await storage.getLeaderboard(period);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  app2.get("/api/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
