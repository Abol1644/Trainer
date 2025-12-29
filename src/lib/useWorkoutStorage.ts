'use client';

import { useState, useEffect } from 'react';
import { DayWorkout, Workout } from '@/types/workout';

const STORAGE_KEY = 'workout-trainer-data';
const SETTINGS_KEY = 'workout-trainer-settings';

interface WorkoutStorage {
  days: DayWorkout[];
  lastUpdated: string;
}

export interface AppSettings {
  useLocalStorage: boolean;
}

export function useWorkoutStorage(settings: AppSettings) {
  const [days, setDays] = useState<DayWorkout[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    if (settings.useLocalStorage && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: WorkoutStorage = JSON.parse(stored);
          setDays(parsed.days);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
    setLoaded(true);
  }, [settings.useLocalStorage]);

  // Save data to localStorage whenever days change
  useEffect(() => {
    if (loaded && settings.useLocalStorage && typeof window !== 'undefined') {
      try {
        const data: WorkoutStorage = {
          days,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [days, loaded, settings.useLocalStorage]);

  const addDayWorkout = (dayWorkout: DayWorkout) => {
    setDays(prev => {
      const existingIndex = prev.findIndex(d => d.date === dayWorkout.date);
      if (existingIndex >= 0) {
        // Update existing day
        const updated = [...prev];
        updated[existingIndex] = dayWorkout;
        return updated;
      }
      // Add new day
      return [...prev, dayWorkout].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  };

  const getDayWorkout = (date: string): DayWorkout | undefined => {
    return days.find(d => d.date === date);
  };

  const toggleWorkoutDone = (date: string, workoutId: string) => {
    setDays(prev =>
      prev.map(day => {
        if (day.date !== date) return day;
        return {
          ...day,
          workouts: day.workouts.map(workout =>
            workout.id === workoutId
              ? { ...workout, done: !workout.done }
              : workout
          ),
        };
      })
    );
  };

  const getAllDates = (): string[] => {
    return days.map(d => d.date);
  };

  return {
    days,
    loaded,
    addDayWorkout,
    getDayWorkout,
    toggleWorkoutDone,
    getAllDates,
  };
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    useLocalStorage: true,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
          setSettings(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    setLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    }
    setSettings({ useLocalStorage: true });
    window.location.reload();
  };

  return {
    settings,
    loaded,
    updateSettings,
    resetAllData,
  };
}
