'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Clock, CheckCircle2, ChevronLeft, Dumbbell, History } from 'lucide-react';
import { DayWorkout } from '@/types/workout';
import { formatDateDisplay, getTodayDateString } from '@/lib/workoutValidation';

interface PlansProps {
  days: DayWorkout[];
  onDaySelect: (date: string) => void;
  onBack: () => void;
}

export function Plans({ days, onDaySelect, onBack }: PlansProps) {
  const today = getTodayDateString();
  const hasTodayWorkout = days.some(d => d.date === today);

  const getProgressForDay = (day: DayWorkout): { completed: number; total: number; percentage: number } => {
    const completed = day.workouts.filter(w => w.done).length;
    const total = day.workouts.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-6 sm:px-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Workout Plans</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Stats Card */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <History className="w-4 h-4 text-[#03c39a]" />
              Your Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center space-y-1 p-4 bg-gray-950/50 rounded-xl">
                <p className="text-2xl sm:text-3xl font-bold text-white">{days.length}</p>
                <p className="text-xs sm:text-sm text-gray-400">Days</p>
              </div>
              <div className="text-center space-y-1 p-4 bg-gray-950/50 rounded-xl">
                <p className="text-2xl sm:text-3xl font-bold text-[#03c39a]">
                  {days.reduce((sum, day) => sum + day.workouts.filter(w => w.done).length, 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">Completed</p>
              </div>
              <div className="text-center space-y-1 p-4 bg-gray-950/50 rounded-xl">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {days.reduce((sum, day) => sum + day.workouts.length, 0)}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today Alert */}
        {!hasTodayWorkout && days.length > 0 && (
          <Card className="bg-gradient-to-r from-[#03c39a]/10 to-[#02a080]/10 border-[#03c39a]/30">
            <CardContent className="p-4 sm:p-5 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#03c39a] flex-shrink-0" />
              <p className="text-sm sm:text-base text-gray-300">
                No workout planned for today. Import your workout to get started!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Days List */}
        {days.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900/30">
            <CardContent className="p-12 sm:p-16 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">No Workouts Yet</p>
              <p className="text-gray-500 text-sm sm:text-base mb-6">
                Import your first workout plan to get started
              </p>
              <Button
                className="bg-gradient-to-r from-[#03c39a] to-[#02a080] hover:from-[#02a080] hover:to-[#028a6d] text-white"
                onClick={onBack}
              >
                Import Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {days.map((day) => {
              const progress = getProgressForDay(day);
              const isToday = day.date === today;

              return (
                <Card
                  key={day.date}
                  className={`cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                    isToday
                      ? 'border-[#03c39a]/50 bg-gradient-to-br from-[#03c39a]/5 to-[#02a080]/5'
                      : 'border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 hover:border-[#03c39a]/30'
                  }`}
                  onClick={() => onDaySelect(day.date)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                            {formatDateDisplay(day.date)}
                          </h3>
                          {isToday && (
                            <Badge className="bg-gradient-to-r from-[#03c39a]/20 to-[#02a080]/20 text-[#03c39a] border-[#03c39a]/30 text-xs">
                              Today
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-400 truncate">{day.workouts.length} exercises</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#03c39a] flex-shrink-0" />
                            <span className="text-[#03c39a] truncate">
                              {progress.completed} done
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <TrendingUp className="w-3.5 h-3.5 text-white flex-shrink-0" />
                            <span className="text-white font-semibold truncate">
                              {Math.round(progress.percentage)}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#03c39a] to-[#02a080] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>

                      <ChevronLeft className="w-5 h-5 text-gray-400 flex-shrink-0 mt-8" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 hover:border-[#03c39a] hover:text-[#03c39a] hover:bg-[#03c39a]/10 transition-all"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
