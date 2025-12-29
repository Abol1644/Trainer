'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle2, XCircle, Copy } from 'lucide-react';
import { validateWorkoutJSON, parseJSONSafely } from '@/lib/workoutValidation';
import { DayWorkout } from '@/types/workout';

interface ImportWorkoutProps {
  onImport: (workout: DayWorkout) => void;
}

export function ImportWorkout({ onImport }: ImportWorkoutProps) {
  const [jsonText, setJsonText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonText(content);
      handleImport(content);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileUpload(file);
      } else {
        setErrors(['Please select a JSON file']);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleImport = (content: string) => {
    setErrors([]);
    setSuccess(false);

    const parseResult = parseJSONSafely(content);

    if (!parseResult.success) {
      setErrors([`Error parsing JSON: ${parseResult.error}`]);
      return;
    }

    const validationResult = validateWorkoutJSON(parseResult.data);

    if (!validationResult.valid) {
      setErrors(validationResult.errors.map(e => `${e.field}: ${e.message}`));
      return;
    }

    if (validationResult.workout) {
      setSuccess(true);
      onImport(validationResult.workout);
    }
  };

  const handleButtonClick = () => {
    handleImport(jsonText);
  };

  const handleCopySample = () => {
    const today = new Date().toISOString().split('T')[0];
    const sample = {
      date: today,
      workouts: [
        {
          id: 'w1',
          name: 'Push-ups',
          sets: 4,
          reps: 15,
          rest: '60s',
          description: 'Keep proper form, hands shoulder-width apart',
          done: false,
        },
        {
          id: 'w2',
          name: 'Squats',
          sets: 3,
          reps: 20,
          rest: '90s',
          description: 'Keep knees behind toes, go slow',
          done: false,
        },
        {
          id: 'w3',
          name: 'Plank',
          sets: 3,
          duration: '30s',
          rest: '45s',
          description: 'Keep body straight, engage core',
          done: false,
        },
      ],
    };
    setJsonText(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 py-6 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#03c39a] to-[#02a080] shadow-lg shadow-[#03c39a]/20 mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Import Workout</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Upload your workout plan as a JSON file or paste it directly
          </p>
        </div>

        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Upload JSON</CardTitle>
            <CardDescription>Drag & drop or click to select a file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Section */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-[#03c39a] bg-[#03c39a]/10 scale-[1.02]'
                  : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Upload
                className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 transition-colors ${
                  dragActive ? 'text-[#03c39a]' : 'text-gray-500'
                }`}
              />
              <p className="text-base sm:text-lg font-medium mb-2">Drag & drop JSON file here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <Button
                type="button"
                variant="outline"
                className="border-[#03c39a] text-[#03c39a] hover:bg-[#03c39a] hover:text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Files
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-500">Or paste JSON directly</span>
              </div>
            </div>

            {/* Textarea Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">JSON Content</label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#03c39a] hover:text-[#02a080] hover:bg-[#03c39a]/10 h-8"
                  onClick={handleCopySample}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Use Sample
                </Button>
              </div>
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder={`{
  "date": "2025-01-01",
  "workouts": [...]
}`}
                className="min-h-[200px] sm:min-h-[250px] font-mono text-xs sm:text-sm bg-gray-950 border-gray-700 text-white placeholder:text-gray-600 focus:border-[#03c39a] focus:ring-1 focus:ring-[#03c39a] transition-all"
              />
            </div>

            {/* Import Button */}
            <Button
              onClick={handleButtonClick}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#03c39a] to-[#02a080] text-white hover:from-[#02a080] hover:to-[#028a6d] font-semibold text-base transition-all shadow-lg shadow-[#03c39a]/25 hover:shadow-[#03c39a]/35"
              disabled={!jsonText.trim()}
            >
              Import Workout
            </Button>

            {/* Error Messages */}
            {errors.length > 0 && (
              <Alert variant="destructive" className="border-red-900/50 bg-red-950/20">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm sm:text-base">Validation Errors:</p>
                    <ul className="space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-xs sm:text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span className="flex-1">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {success && (
              <Alert className="border-[#03c39a] bg-[#03c39a]/10">
                <CheckCircle2 className="h-4 w-4 text-[#03c39a]" />
                <AlertDescription className="text-[#03c39a] font-medium text-sm sm:text-base">
                  Workout plan imported successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="border-gray-800 bg-gray-900/30">
          <CardContent className="p-6">
            <h3 className="font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#03c39a]" />
              Tips
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#03c39a] mt-0.5">•</span>
                <span>Date must be in YYYY-MM-DD format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03c39a] mt-0.5">•</span>
                <span>Each workout needs either reps or duration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03c39a] mt-0.5">•</span>
                <span>Use the sample JSON as a template</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#03c39a] mt-0.5">•</span>
                <span>Data is stored locally on your device</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
