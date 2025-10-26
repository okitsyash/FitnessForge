import mongoose from 'mongoose';

const waterIntakeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema); 