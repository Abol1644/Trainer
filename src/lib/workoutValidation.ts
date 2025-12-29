import { DayWorkout, ValidationError } from '@/types/workout';

export function validateWorkoutJSON(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  workout?: DayWorkout;
} {
  const errors: ValidationError[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push({
      field: 'root',
      message: 'Data must be an object',
    });
    return { valid: false, errors };
  }

  const workout = data as Record<string, unknown>;

  // Validate date
  if (!workout.date || typeof workout.date !== 'string') {
    errors.push({
      field: 'date',
      message: 'The date field must be a string',
    });
  } else {
    // Check if date is valid ISO format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(workout.date)) {
      errors.push({
        field: 'date',
        message: 'Date must be in YYYY-MM-DD format (e.g., 2025-01-01)',
      });
    }
  }

  // Validate workouts array
  if (!workout.workouts || !Array.isArray(workout.workouts)) {
    errors.push({
      field: 'workouts',
      message: 'The workouts field must be an array',
    });
  } else if (workout.workouts.length === 0) {
    errors.push({
      field: 'workouts',
      message: 'The workouts array cannot be empty',
    });
  } else {
    // Validate each workout
    workout.workouts.forEach((w: unknown, index: number) => {
      if (!w || typeof w !== 'object') {
        errors.push({
          field: `workouts[${index}]`,
          message: `Workout ${index + 1} must be an object`,
        });
        return;
      }

      const workoutItem = w as Record<string, unknown>;

      // Validate id
      if (!workoutItem.id || typeof workoutItem.id !== 'string') {
        errors.push({
          field: `workouts[${index}].id`,
          message: `The id field in workout ${index + 1} must be a string`,
        });
      }

      // Validate name
      if (!workoutItem.name || typeof workoutItem.name !== 'string') {
        errors.push({
          field: `workouts[${index}].name`,
          message: `The name field in workout ${index + 1} must be a string`,
        });
      }

      // Validate sets
      if (
        workoutItem.sets === undefined ||
        typeof workoutItem.sets !== 'number' ||
        workoutItem.sets < 0
      ) {
        errors.push({
          field: `workouts[${index}].sets`,
          message: `The sets field in workout ${index + 1} must be a non-negative number`,
        });
      }

      // Validate reps OR duration (at least one is required)
      const hasReps =
        workoutItem.reps !== undefined &&
        (typeof workoutItem.reps === 'number' || typeof workoutItem.reps === 'string');
      const hasDuration =
        workoutItem.duration !== undefined &&
        (typeof workoutItem.duration === 'number' || typeof workoutItem.duration === 'string');

      if (!hasReps && !hasDuration) {
        errors.push({
          field: `workouts[${index}].reps/duration`,
          message: `Workout ${index + 1} must have at least one of the following fields: reps or duration`,
        });
      }

      // Validate rest
      if (!workoutItem.rest || typeof workoutItem.rest !== 'string') {
        errors.push({
          field: `workouts[${index}].rest`,
          message: `The rest field in workout ${index + 1} must be a string`,
        });
      }

      // Validate description (optional)
      if (
        workoutItem.description !== undefined &&
        typeof workoutItem.description !== 'string'
      ) {
        errors.push({
          field: `workouts[${index}].description`,
          message: `The description field in workout ${index + 1} must be a string`,
        });
      }

      // Validate done
      if (typeof workoutItem.done !== 'boolean') {
        errors.push({
          field: `workouts[${index}].done`,
          message: `The done field in workout ${index + 1} must be a boolean`,
        });
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, errors: [], workout: workout as DayWorkout };
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function parseJSONSafely(jsonString: string): {
  success: boolean;
  data?: unknown;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing JSON',
    };
  }
}
