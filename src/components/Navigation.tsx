'use client';

import { Button } from '@/components/ui/button';
import { Home, Plus, Calendar, Settings as SettingsIcon, Dumbbell } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: 'home' | 'import' | 'today' | 'plans' | 'settings') => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'import' as const, label: 'Import', icon: Plus },
    { id: 'today' as const, label: 'Today', icon: Dumbbell },
    { id: 'plans' as const, label: 'Plans', icon: Calendar },
    { id: 'settings' as const, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-lg border-t border-gray-800/50 px-2 py-1 sm:py-2 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <Button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              variant="ghost"
              className={`flex-1 flex flex-col items-center gap-1 py-2 sm:py-3 h-auto min-h-[56px] transition-all duration-300 ${
                isActive
                  ? 'text-[#03c39a]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#03c39a] rounded-full" />
                )}
              </div>
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
