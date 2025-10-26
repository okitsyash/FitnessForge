import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    mealType: { type: String, required: true },
    food: { type: String, required: true },
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Nutrition = mongoose.model('Nutrition', nutritionSchema); 