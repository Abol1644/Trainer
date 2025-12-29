'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Database, Trash2, ChevronLeft, Info, Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
  useLocalStorage: boolean;
  onToggleLocalStorage: (enabled: boolean) => void;
  onResetData: () => void;
  onBack: () => void;
}

export function Settings({
  useLocalStorage,
  onToggleLocalStorage,
  onResetData,
  onBack,
}: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    onResetData();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-6 sm:px-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
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
          <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Storage Settings */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Database className="w-4 h-4 text-[#03c39a]" />
              Data Storage
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Choose how your workout data is stored
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-xl">
              <div className="space-y-1">
                <p className="font-medium text-white text-sm sm:text-base">Save to Browser</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Data is stored locally on your device
                </p>
              </div>
              <Switch
                checked={useLocalStorage}
                onCheckedChange={onToggleLocalStorage}
                className="data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-[#03c39a] data-[state=checked]:to-[#02a080]"
              />
            </div>

            <Alert className="border-gray-700 bg-gray-950/30">
              <Info className="h-4 w-4 text-[#03c39a]" />
              <AlertDescription className="text-xs sm:text-sm text-gray-300">
                {useLocalStorage
                  ? 'Your data is automatically saved in your browser and will persist even after closing it.'
                  : 'Data is only kept in memory while the page is open. All data will be lost when you close the page.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#03c39a]" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-950/50 rounded-lg">
              <span className="text-gray-400 text-xs sm:text-sm">Version</span>
              <span className="text-white font-medium text-xs sm:text-sm">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-950/50 rounded-lg">
              <span className="text-gray-400 text-xs sm:text-sm">Storage Status</span>
              <span
                className={`font-medium text-xs sm:text-sm ${
                  useLocalStorage ? 'text-[#03c39a]' : 'text-orange-400'
                }`}
              >
                {useLocalStorage ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-950/50 rounded-lg">
              <span className="text-gray-400 text-xs sm:text-sm">Technology</span>
              <span className="text-white font-medium text-xs sm:text-sm">Next.js + React + TypeScript</span>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-950/50">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#03c39a]" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                All your data stays <span className="text-white font-medium">locally on your device</span>
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                <span className="text-white font-medium">No data</span> is sent to any server
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-950/30 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-[#03c39a] mt-1.5 sm:mt-2 flex-shrink-0" />
              <p className="text-gray-400 text-xs sm:text-sm">
                You have <span className="text-white font-medium">full control</span> over your data
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-900/50 bg-gradient-to-br from-red-950/20 to-gray-950/20">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-red-400">
              <Trash2 className="w-4 h-4" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-400/70 text-xs sm:text-sm">
              These actions are irreversible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-950/30 border border-red-900/30 rounded-xl">
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                Deleting all data will permanently remove all your workout plans and progress.
                This action cannot be undone.
              </p>
              {!showResetConfirm ? (
                <Button
                  onClick={() => setShowResetConfirm(true)}
                  variant="outline"
                  className="w-full sm:w-auto border-red-600 text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Data
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm sm:text-base text-red-400 font-semibold">
                    Are you sure? This action cannot be undone!
                  </p>
                  <div className="flex gap-2 sm:gap-3">
                    <Button
                      onClick={handleReset}
                      className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
                    >
                      Yes, Delete Everything
                    </Button>
                    <Button
                      onClick={() => setShowResetConfirm(false)}
                      variant="outline"
                      className="border-gray-600 hover:border-gray-500 flex-1 sm:flex-none"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
