import { db } from './db';
import { workouts } from '@shared/schema';

async function main() {
    try {
        const result = await db.select().from(workouts);
        console.log('Workouts table structure:', workouts);
        console.log('Sample data:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 