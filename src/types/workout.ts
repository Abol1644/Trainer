export interface Workout {
  id: string;
  name: string;
  sets: number;
  reps?: number | string;
  duration?: number | string;
  rest: string;
  description?: string;
  done: boolean;
}

export interface DayWorkout {
  date: string;
  workouts: Workout[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AppState {
  currentView: 'import' | 'today' | 'detail' | 'plans' | 'settings';
  selectedWorkoutId?: string;
  selectedDate?: string;
}
