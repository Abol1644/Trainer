'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Circle, ChevronRight, Calendar, Trophy, ArrowLeft, Flame } from 'lucide-react';
import { DayWorkout, Workout } from '@/types/workout';
import { formatDateDisplay } from '@/lib/workoutValidation';

interface TodayProps {
  workout: DayWorkout;
  onToggleWorkout: (workoutId: string) => void;
  onWorkoutClick: (workoutId: string) => void;
  onBack: () => void;
}

export function Today({ workout, onToggleWorkout, onWorkoutClick, onBack }: TodayProps) {
  const completedCount = workout.workouts.filter(w => w.done).length;
  const totalCount = workout.workouts.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  const getWorkoutTypeLabel = (workout: Workout): string => {
    if (workout.reps) {
      return `${workout.sets} sets × ${workout.reps} reps`;
    }
    if (workout.duration) {
      return `${workout.sets} sets × ${workout.duration}`;
    }
    return `${workout.sets} sets`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-6 sm:px-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Today's Workout</h1>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Date Header */}
        <div className="text-center space-y-1 mb-6">
          <p className="text-lg sm:text-xl font-semibold text-white">{formatDateDisplay(workout.date)}</p>
          {allDone && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#03c39a]/20 to-[#02a080]/20 px-4 py-2 rounded-full border border-[#03c39a]/30">
              <Trophy className="w-4 h-4 text-[#03c39a]" />
              <span className="text-sm font-semibold text-[#03c39a]">All Complete! Great Job!</span>
            </div>
          )}
        </div>

        {/* Progress Card */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center justify-between">
              <span>Daily Progress</span>
              <div className="flex items-center gap-1.5 text-[#03c39a]">
                <Flame className="w-4 h-4" />
                <span className="font-bold text-lg sm:text-xl">{Math.round(progress)}%</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress
              value={progress}
              className="h-3 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-[#03c39a] [&>div]:to-[#02a080]"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-gray-800">
              <div className="text-center space-y-1 p-3 bg-gray-950/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-[#03c39a]">{completedCount}</p>
                <p className="text-xs text-gray-400">Done</p>
              </div>
              <div className="text-center space-y-1 p-3 bg-gray-950/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {totalCount - completedCount}
                </p>
                <p className="text-xs text-gray-400">Left</p>
              </div>
              <div className="text-center space-y-1 p-3 bg-gray-950/50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-white">{totalCount}</p>
                <p className="text-xs text-gray-400">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout List */}
        <div className="space-y-3 sm:space-y-4">
          {workout.workouts.map((workoutItem) => (
            <Card
              key={workoutItem.id}
              className={`transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-xl ${
                workoutItem.done
                  ? 'bg-gray-900/30 border-gray-800/50 opacity-60'
                  : 'bg-gray-900/80 border-gray-800 hover:border-[#03c39a]/50'
              }`}
              onClick={() => onWorkoutClick(workoutItem.id)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWorkout(workoutItem.id);
                    }}
                    className="pt-1"
                  >
                    <Checkbox
                      checked={workoutItem.done}
                      className="w-5 h-5 sm:w-6 sm:h-6 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#03c39a] data-[state=checked]:to-[#02a080] data-[state=checked]:border-[#03c39a] transition-all"
                    />
                  </div>

                  {/* Workout Info */}
                  <div className="flex-1 min-w-0 flex items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                      <h3
                        className={`text-base sm:text-lg font-semibold transition-all ${
                          workoutItem.done
                            ? 'line-through text-gray-500'
                            : 'text-white'
                        }`}
                      >
                        {workoutItem.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-[#03c39a]/10 text-[#03c39a] text-xs sm:text-sm font-medium rounded-full border border-[#03c39a]/20">
                          {getWorkoutTypeLabel(workoutItem)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Rest: {workoutItem.rest}
                        </span>
                      </div>
                      {workoutItem.description && (
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 sm:line-clamp-2">
                          {workoutItem.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
