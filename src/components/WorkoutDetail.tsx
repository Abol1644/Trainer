'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CheckCircle2, Timer, Target, Calendar, Info, Dumbbell } from 'lucide-react';
import { Workout } from '@/types/workout';

interface WorkoutDetailProps {
  workout: Workout;
  date: string;
  onToggleDone: () => void;
  onBack: () => void;
}

export function WorkoutDetail({ workout, date, onToggleDone, onBack }: WorkoutDetailProps) {
  const getWorkoutTypeLabel = (): string => {
    if (workout.reps) {
      return `${workout.sets} sets × ${workout.reps} reps`;
    }
    if (workout.duration) {
      return `${workout.sets} sets × ${workout.duration} min`;
    }
    return `${workout.sets} sets`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-6 sm:px-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Workout Details</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Main Workout Card */}
        <Card
          className={`border-gray-800 bg-gradient-to-br ${
            workout.done
              ? 'from-gray-900/50 to-gray-950/50 opacity-75'
              : 'from-gray-900 to-gray-950'
          }`}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#03c39a]/20 to-[#02a080]/20 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-[#03c39a]" />
                  </div>
                  <CardTitle className={`text-xl sm:text-2xl ${workout.done ? 'line-through text-gray-500' : ''}`}>
                    {workout.name}
                  </CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-[#03c39a]/20 to-[#02a080]/20 text-[#03c39a] border-[#03c39a]/30 text-xs sm:text-sm">
                    <Target className="w-3 h-3 mr-1" />
                    {getWorkoutTypeLabel()}
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-xs sm:text-sm">
                    <Timer className="w-3 h-3 mr-1" />
                    Rest: {workout.rest}
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    {date}
                  </Badge>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Checkbox
                  checked={workout.done}
                  onCheckedChange={onToggleDone}
                  className="w-7 h-7 sm:w-8 sm:h-8 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#03c39a] data-[state=checked]:to-[#02a080] data-[state=checked]:border-[#03c39a] transition-all"
                />
              </div>
            </div>
          </CardHeader>

          {workout.description && (
            <CardContent className="space-y-4">
              <div className="p-4 sm:p-5 bg-gray-950/50 rounded-xl border border-gray-800">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{workout.description}</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Sets Tracking */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#03c39a]" />
              Set Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
              {Array.from({ length: workout.sets }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-300 ${
                    workout.done
                      ? 'bg-gradient-to-br from-[#03c39a]/20 to-[#02a080]/20 border-[#03c39a] text-[#03c39a]'
                      : 'border-gray-700 text-gray-400 hover:border-[#03c39a]/50'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {workout.done ? (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-[#03c39a]/10 to-[#02a080]/10 border border-[#03c39a]/30 rounded-xl flex items-center gap-3 sm:gap-4">
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#03c39a] flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#03c39a] text-sm sm:text-base">Excellent Work!</p>
                  <p className="text-xs sm:text-sm text-gray-400">All sets completed</p>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-gray-950/50 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm sm:text-base">
                  <span className="font-semibold text-white">{workout.sets}</span> sets remaining
                  {workout.reps && ` × ${workout.reps} reps each`}
                  {workout.duration && ` × ${workout.duration} each`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Info className="w-4 h-4 text-[#03c39a]" />
              Workout Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                Rest for <span className="text-white font-medium">{workout.rest}</span> between each set
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                Focus on <span className="text-white font-medium">proper form</span> rather than speed
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                <span className="text-white font-medium">Stop immediately</span> if you feel pain
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                Stay <span className="text-white font-medium">hydrated</span> during your workout
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center pt-2 sm:pt-4">
          <Button
            onClick={onToggleDone}
            className={`w-full sm:w-auto px-8 h-12 sm:h-14 font-semibold text-base transition-all shadow-lg ${
              workout.done
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                : 'bg-gradient-to-r from-[#03c39a] to-[#02a080] hover:from-[#02a080] hover:to-[#028a6d] text-white shadow-[#03c39a]/25'
            }`}
          >
            {workout.done ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
