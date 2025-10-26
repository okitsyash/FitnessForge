-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  age INTEGER,
  height DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  goal_weight DECIMAL(5,2),
  activity_level VARCHAR,
  fitness_goal VARCHAR,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  type TEXT NOT NULL,
  duration INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create nutrition table
CREATE TABLE IF NOT EXISTS nutrition (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  meal_type TEXT NOT NULL,
  food TEXT NOT NULL,
  calories INTEGER,
  protein INTEGER,
  carbs INTEGER,
  fat INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create water_intake table
CREATE TABLE IF NOT EXISTS water_intake (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  amount INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create daily_goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  type TEXT NOT NULL,
  target INTEGER NOT NULL,
  current INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
); 