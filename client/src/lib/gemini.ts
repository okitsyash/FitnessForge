export interface ChatMessage {
  message: string;
  response: string;
  messageType?: string;
  createdAt: string;
}

export interface WorkoutPlanRequest {
  goal: string;
  experience: string;
  daysPerWeek: number;
}

export interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  plan: any;
  difficulty: string;
  daysPerWeek: number;
  createdAt: string;
}

export const chatWithAI = async (message: string, messageType = 'fitness'): Promise<string> => {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ message, messageType }),
  });

  if (!response.ok) {
    throw new Error('Failed to get AI response');
  }

  const data = await response.json();
  return data.response;
};

export const generateWorkoutPlan = async (request: WorkoutPlanRequest): Promise<WorkoutPlan> => {
  const response = await fetch('/api/ai/workout-plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to generate workout plan');
  }

  return response.json();
};
