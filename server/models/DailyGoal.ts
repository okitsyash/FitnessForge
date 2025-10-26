import mongoose from 'mongoose';

const dailyGoalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const DailyGoal = mongoose.model('DailyGoal', dailyGoalSchema); 