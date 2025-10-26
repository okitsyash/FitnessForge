import { Request, Response, NextFunction } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

// Middleware to require authentication for protected routes
export const requireAuth = ClerkExpressRequireAuth();

// Middleware to get the authenticated user
export const getAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

// Helper to get the current user's ID
export const getCurrentUserId = (req: Request): string => {
    if (!req.auth?.userId) {
        throw new Error("No authenticated user");
    }
    return req.auth.userId;
}; 