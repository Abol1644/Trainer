'use client';

import { useState, useEffect } from 'react';
import { ImportWorkout } from '@/components/ImportWorkout';
import { Today } from '@/components/Today';
import { WorkoutDetail } from '@/components/WorkoutDetail';
import { Plans } from '@/components/Plans';
import { Settings } from '@/components/Settings';
import { Navigation } from '@/components/Navigation';
import { useWorkoutStorage, useAppSettings } from '@/lib/useWorkoutStorage';
import { getTodayDateString, formatDateDisplay } from '@/lib/workoutValidation';
import { Dumbbell, FileText, Calendar, TrendingUp, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const { settings, loaded: settingsLoaded, updateSettings, resetAllData } = useAppSettings();
  const { days, loaded: storageLoaded, addDayWorkout, getDayWorkout, toggleWorkoutDone } = useWorkoutStorage(settings);

  const [currentView, setCurrentView] = useState<'home' | 'import' | 'today' | 'detail' | 'plans' | 'settings'>('home');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  // Load today's workout on mount
  useEffect(() => {
    if (settingsLoaded && storageLoaded) {
      const today = getTodayDateString();
      const todayWorkout = getDayWorkout(today);
      if (todayWorkout) {
        setCurrentView('today');
      }
    }
  }, [settingsLoaded, storageLoaded, getDayWorkout]);

  const handleImport = (workout: any) => {
    addDayWorkout(workout);
    setTimeout(() => {
      setCurrentView('today');
      setSelectedDate(workout.date);
    }, 1000);
  };

  const handleWorkoutClick = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
    setCurrentView('detail');
  };

  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
    setCurrentView('today');
  };

  const handleNavigate = (view: 'home' | 'import' | 'today' | 'plans' | 'settings') => {
    setCurrentView(view);
    if (view === 'today' && !selectedDate) {
      const today = getTodayDateString();
      setSelectedDate(today);
    }
  };

  const handleBack = () => {
    if (currentView === 'detail') {
      setCurrentView('today');
      setSelectedWorkoutId(undefined);
    } else if (currentView === 'today' || currentView === 'import' || currentView === 'plans' || currentView === 'settings') {
      setCurrentView('home');
    }
  };

  // Get current workout based on selected date
  const getCurrentWorkout = () => {
    if (selectedDate) {
      return getDayWorkout(selectedDate);
    }
    const today = getTodayDateString();
    return getDayWorkout(today);
  };

  const currentWorkout = getCurrentWorkout();
  const selectedWorkout = currentWorkout?.workouts.find(w => w.id === selectedWorkoutId);

  if (!settingsLoaded || !storageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#03c39a]/20 to-[#02a080]/20 flex items-center justify-center mx-auto">
            <Dumbbell className="w-8 h-8 text-[#03c39a] animate-pulse" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  const showNavigation = currentView !== 'home';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white pb-20">
      <main>
        {currentView === 'home' && (
          <div className="max-w-lg mx-auto space-y-6 px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="text-center space-y-3 pb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#03c39a] to-[#02a080] shadow-2xl shadow-[#03c39a]/30 mb-4">
                <Dumbbell className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Workout Trainer
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">Your personal fitness planner</p>
            </div>

            {/* Today's Status Card */}
            {currentWorkout ? (
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg sm:text-xl">Today's Workout</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateDisplay(currentWorkout.date)}
                      </CardDescription>
                    </div>
                    <Badge className="bg-gradient-to-r from-[#03c39a]/20 to-[#02a080]/20 text-[#03c39a] border-[#03c39a]/30 text-xs sm:text-sm">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm sm:text-base">Progress</span>
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#03c39a]" />
                      <span className="text-[#03c39a] font-semibold text-base sm:text-lg">
                        {currentWorkout.workouts.filter(w => w.done).length} / {currentWorkout.workouts.length}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setCurrentView('today')}
                    className="w-full h-12 bg-gradient-to-r from-[#03c39a] to-[#02a080] hover:from-[#02a080] hover:to-[#028a6d] text-white font-semibold shadow-lg shadow-[#03c39a]/25 transition-all"
                  >
                    View Workout
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-gray-400">No Workout Today</CardTitle>
                  <CardDescription className="text-xs sm:text-base">
                    Import your workout plan to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setCurrentView('import')}
                    className="w-full h-12 bg-gradient-to-r from-[#03c39a] to-[#02a080] hover:from-[#02a080] hover:to-[#028a6d] text-white font-semibold shadow-lg shadow-[#03c39a]/25 transition-all"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Import Workout
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Button
                onClick={() => setCurrentView('import')}
                variant="outline"
                className="h-24 sm:h-28 flex-col border-gray-700 hover:border-[#03c39a] hover:bg-[#03c39a]/10 transition-all group"
              >
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base">Import Plan</span>
              </Button>
              <Button
                onClick={() => setCurrentView('plans')}
                variant="outline"
                className="h-24 sm:h-28 flex-col border-gray-700 hover:border-[#03c39a] hover:bg-[#03c39a]/10 transition-all group"
              >
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm sm:text-base">All Plans</span>
              </Button>
            </div>

            {/* Stats */}
            {days.length > 0 && (
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#03c39a]" />
                    Your Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center space-y-1 p-3 sm:p-4 bg-gray-950/50 rounded-xl">
                      <p className="text-2xl sm:text-3xl font-bold text-white">{days.length}</p>
                      <p className="text-xs sm:text-sm text-gray-400">Days</p>
                    </div>
                    <div className="text-center space-y-1 p-3 sm:p-4 bg-gray-950/50 rounded-xl">
                      <p className="text-2xl sm:text-3xl font-bold text-[#03c39a]">
                        {days.reduce((sum, day) => sum + day.workouts.filter(w => w.done).length, 0)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">Done</p>
                    </div>
                    <div className="text-center space-y-1 p-3 sm:p-4 bg-gray-950/50 rounded-xl">
                      <p className="text-2xl sm:text-3xl font-bold text-white">
                        {days.reduce((sum, day) => sum + day.workouts.length, 0)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievement Banner */}
            {days.length > 0 && days.every(day => day.workouts.every(w => w.done)) && (
              <Card className="bg-gradient-to-r from-[#03c39a]/10 to-[#02a080]/10 border-[#03c39a]/30">
                <CardContent className="p-4 sm:p-5 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#03c39a]/30 to-[#02a080]/30 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#03c39a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#03c39a] text-sm sm:text-base">Amazing Progress!</p>
                    <p className="text-xs sm:text-sm text-gray-400">You've completed all your workouts</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentView === 'import' && <ImportWorkout onImport={handleImport} />}

        {currentView === 'today' && currentWorkout && (
          <Today
            workout={currentWorkout}
            onToggleWorkout={(workoutId) => toggleWorkoutDone(currentWorkout.date, workoutId)}
            onWorkoutClick={handleWorkoutClick}
            onBack={handleBack}
          />
        )}

        {currentView === 'today' && !currentWorkout && (
          <div className="px-4 py-6 sm:px-6">
            <Card className="max-w-lg mx-auto border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50">
              <CardContent className="p-12 sm:p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">No Workout Found</p>
                <p className="text-gray-500 text-sm sm:text-base mb-6">
                  {selectedDate ? `For ${formatDateDisplay(selectedDate)}` : 'For today'}
                </p>
                <div className="flex gap-3 justify-center flex-col sm:flex-row">
                  <Button onClick={() => setCurrentView('import')} className="bg-gradient-to-r from-[#03c39a] to-[#02a080] hover:from-[#02a080] hover:to-[#028a6d] text-white">
                    Import Workout
                  </Button>
                  <Button onClick={() => setCurrentView('plans')} variant="outline" className="border-gray-600">
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'detail' && selectedWorkout && selectedDate && (
          <WorkoutDetail
            workout={selectedWorkout}
            date={selectedDate}
            onToggleDone={() => toggleWorkoutDone(selectedDate, selectedWorkout.id)}
            onBack={handleBack}
          />
        )}

        {currentView === 'plans' && (
          <Plans
            days={days}
            onDaySelect={handleDaySelect}
            onBack={handleBack}
          />
        )}

        {currentView === 'settings' && (
          <Settings
            useLocalStorage={settings.useLocalStorage}
            onToggleLocalStorage={(enabled) => updateSettings({ useLocalStorage: enabled })}
            onResetData={resetAllData}
            onBack={handleBack}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      {showNavigation && <Navigation currentView={currentView} onNavigate={handleNavigate} />}
    </div>
  );
}
