import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: Number,
    notes: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Workout = mongoose.model('Workout', workoutSchema); 