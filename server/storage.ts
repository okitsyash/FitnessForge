import {
  users,
  workouts,
  nutrition,
  waterIntake,
  dailyGoals,
  friendships,
  challenges,
  achievements,
  workoutPlans,
  chatHistory,
  type User,
  type UpsertUser,
  type InsertWorkout,
  type Workout,
  type InsertNutrition,
  type Nutrition,
  type InsertWaterIntake,
  type WaterIntake,
  type InsertDailyGoal,
  type DailyGoal,
  type InsertFriendship,
  type Friendship,
  type InsertChallenge,
  type Challenge,
  type Achievement,
  type InsertWorkoutPlan,
  type WorkoutPlan,
  type InsertChatHistory,
  type ChatHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<UpsertUser>): Promise<User>;
  
  // Workout operations
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  getUserWorkouts(userId: string, limit?: number): Promise<Workout[]>;
  getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]>;
  
  // Nutrition operations
  createNutrition(nutrition: InsertNutrition): Promise<Nutrition>;
  getUserNutrition(userId: string, date?: Date): Promise<Nutrition[]>;
  getNutritionByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Nutrition[]>;
  
  // Water intake operations
  updateWaterIntake(waterIntake: InsertWaterIntake): Promise<WaterIntake>;
  getWaterIntake(userId: string, date: Date): Promise<WaterIntake | undefined>;
  
  // Daily goals operations
  createDailyGoal(goal: InsertDailyGoal): Promise<DailyGoal>;
  updateDailyGoal(goalId: number, currentValue: number, completed: boolean): Promise<DailyGoal>;
  getUserDailyGoals(userId: string, date: Date): Promise<DailyGoal[]>;
  
  // Friends operations
  sendFriendRequest(friendship: InsertFriendship): Promise<Friendship>;
  acceptFriendRequest(friendshipId: number): Promise<Friendship>;
  getUserFriends(userId: string): Promise<User[]>;
  getFriendRequests(userId: string): Promise<Friendship[]>;
  
  // Challenge operations
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getUserChallenges(userId: string): Promise<Challenge[]>;
  updateChallenge(challengeId: number, data: Partial<Challenge>): Promise<Challenge>;
  
  // Achievement operations
  getUserAchievements(userId: string): Promise<Achievement[]>;
  
  // Workout plan operations
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  getUserWorkoutPlans(userId: string): Promise<WorkoutPlan[]>;
  
  // Chat history operations
  createChatHistory(chat: InsertChatHistory): Promise<ChatHistory>;
  getUserChatHistory(userId: string, limit?: number): Promise<ChatHistory[]>;
  
  // Leaderboard operations
  getLeaderboard(period: 'week' | 'month' | 'all'): Promise<User[]>;
  getUserStats(userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Workout operations
  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    // Calculate points based on duration and intensity
    let points = Math.round(workout.duration * 0.5);
    switch (workout.intensity) {
      case 'low': points *= 1; break;
      case 'moderate': points *= 1.2; break;
      case 'high': points *= 1.5; break;
      case 'very_high': points *= 1.8; break;
    }
    
    const [newWorkout] = await db
      .insert(workouts)
      .values({ ...workout, pointsEarned: Math.round(points) })
      .returning();
      
    // Update user total points
    await db
      .update(users)
      .set({ 
        totalPoints: sql`${users.totalPoints} + ${points}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, workout.userId));
      
    return newWorkout;
  }

  async getUserWorkouts(userId: string, limit = 10): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date))
      .limit(limit);
  }

  async getWorkoutsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(
        and(
          eq(workouts.userId, userId),
          gte(workouts.date, startDate),
          lte(workouts.date, endDate)
        )
      )
      .orderBy(desc(workouts.date));
  }

  // Nutrition operations
  async createNutrition(nutritionData: InsertNutrition): Promise<Nutrition> {
    const [newNutrition] = await db
      .insert(nutrition)
      .values(nutritionData)
      .returning();
    return newNutrition;
  }

  async getUserNutrition(userId: string, date?: Date): Promise<Nutrition[]> {
    const whereCondition = date 
      ? and(eq(nutrition.userId, userId), eq(nutrition.date, date))
      : eq(nutrition.userId, userId);
      
    return await db
      .select()
      .from(nutrition)
      .where(whereCondition)
      .orderBy(desc(nutrition.createdAt));
  }

  async getNutritionByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Nutrition[]> {
    return await db
      .select()
      .from(nutrition)
      .where(
        and(
          eq(nutrition.userId, userId),
          gte(nutrition.date, startDate),
          lte(nutrition.date, endDate)
        )
      )
      .orderBy(desc(nutrition.date));
  }

  // Water intake operations
  async updateWaterIntake(waterIntakeData: InsertWaterIntake): Promise<WaterIntake> {
    const [water] = await db
      .insert(waterIntake)
      .values(waterIntakeData)
      .onConflictDoUpdate({
        target: [waterIntake.userId, waterIntake.date],
        set: { glasses: waterIntakeData.glasses },
      })
      .returning();
    return water;
  }

  async getWaterIntake(userId: string, date: Date): Promise<WaterIntake | undefined> {
    const [water] = await db
      .select()
      .from(waterIntake)
      .where(and(eq(waterIntake.userId, userId), eq(waterIntake.date, date)));
    return water;
  }

  // Daily goals operations
  async createDailyGoal(goal: InsertDailyGoal): Promise<DailyGoal> {
    const [newGoal] = await db
      .insert(dailyGoals)
      .values(goal)
      .returning();
    return newGoal;
  }

  async updateDailyGoal(goalId: number, currentValue: number, completed: boolean): Promise<DailyGoal> {
    const [goal] = await db
      .update(dailyGoals)
      .set({ currentValue, completed })
      .where(eq(dailyGoals.id, goalId))
      .returning();
    return goal;
  }

  async getUserDailyGoals(userId: string, date: Date): Promise<DailyGoal[]> {
    return await db
      .select()
      .from(dailyGoals)
      .where(and(eq(dailyGoals.userId, userId), eq(dailyGoals.date, date)));
  }

  // Friends operations
  async sendFriendRequest(friendship: InsertFriendship): Promise<Friendship> {
    const [newFriendship] = await db
      .insert(friendships)
      .values(friendship)
      .returning();
    return newFriendship;
  }

  async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
    const [friendship] = await db
      .update(friendships)
      .set({ status: 'accepted' })
      .where(eq(friendships.id, friendshipId))
      .returning();
    return friendship;
  }

  async getUserFriends(userId: string): Promise<User[]> {
    const friendIds = await db
      .select({ friendId: friendships.friendId })
      .from(friendships)
      .where(and(eq(friendships.userId, userId), eq(friendships.status, 'accepted')));
      
    if (friendIds.length === 0) return [];
    
    return await db
      .select()
      .from(users)
      .where(sql`${users.id} IN ${friendIds.map(f => f.friendId)}`);
  }

  async getFriendRequests(userId: string): Promise<Friendship[]> {
    return await db
      .select()
      .from(friendships)
      .where(and(eq(friendships.friendId, userId), eq(friendships.status, 'pending')));
  }

  // Challenge operations
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db
      .insert(challenges)
      .values(challenge)
      .returning();
    return newChallenge;
  }

  async getUserChallenges(userId: string): Promise<Challenge[]> {
    return await db
      .select()
      .from(challenges)
      .where(
        or(
          eq(challenges.creatorId, userId),
          eq(challenges.participantId, userId)
        )
      )
      .orderBy(desc(challenges.createdAt));
  }

  async updateChallenge(challengeId: number, data: Partial<Challenge>): Promise<Challenge> {
    const [challenge] = await db
      .update(challenges)
      .set(data)
      .where(eq(challenges.id, challengeId))
      .returning();
    return challenge;
  }

  // Achievement operations
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.unlockedAt));
  }

  // Workout plan operations
  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const [newPlan] = await db
      .insert(workoutPlans)
      .values(plan)
      .returning();
    return newPlan;
  }

  async getUserWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
    return await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.userId, userId))
      .orderBy(desc(workoutPlans.createdAt));
  }

  // Chat history operations
  async createChatHistory(chat: InsertChatHistory): Promise<ChatHistory> {
    const [newChat] = await db
      .insert(chatHistory)
      .values(chat)
      .returning();
    return newChat;
  }

  async getUserChatHistory(userId: string, limit = 50): Promise<ChatHistory[]> {
    return await db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.userId, userId))
      .orderBy(desc(chatHistory.createdAt))
      .limit(limit);
  }

  // Leaderboard operations
  async getLeaderboard(period: 'week' | 'month' | 'all'): Promise<User[]> {
    // For now, return by total points. In a real app, you'd calculate based on the period
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.totalPoints))
      .limit(10);
  }

  async getUserStats(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    const workoutCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(workouts)
      .where(eq(workouts.userId, userId));
      
    const totalCalories = await db
      .select({ total: sql<number>`sum(${workouts.caloriesBurned})` })
      .from(workouts)
      .where(eq(workouts.userId, userId));
      
    return {
      user,
      totalWorkouts: workoutCount[0]?.count || 0,
      totalCalories: totalCalories[0]?.total || 0,
    };
  }
}

export const storage = new DatabaseStorage();
