import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    profileImageUrl: String,
    age: Number,
    height: Number, // in cm
    currentWeight: Number, // in kg
    goalWeight: Number, // in kg
    activityLevel: String,
    fitnessGoal: String,
    totalPoints: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema); 