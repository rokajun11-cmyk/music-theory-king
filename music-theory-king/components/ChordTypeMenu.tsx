import React from 'react';
import { ChevronRight } from 'lucide-react';
import { LangStrings, ScaleMode } from '../types';

interface ChordTypeMenuProps {
  strings: LangStrings;
  onSelectMode: (mode: ScaleMode) => void;
}

export default function ChordTypeMenu({ strings, onSelectMode }: ChordTypeMenuProps) {
  const modes: ScaleMode[] = ['Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor'];
  const titleKeys: Record<ScaleMode, string> = {
    'Major': 'major_title',
    'Natural Minor': 'natural_minor_title',
    'Harmonic Minor': 'harmonic_minor_title',
    'Melodic Minor': 'melodic_minor_title'
  };

  return (
    <div className="main-menu w-full grid grid-cols-1 gap-3 mt-4 max-w-md mx-auto">
      {modes.map(mode => (
        <button 
          key={mode}
          className="menu-card group w-full flex items-center justify-between p-6 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-orange-300 dark:hover:border-orange-700 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:bg-zinc-800 cursor-pointer transition-all"
          onClick={() => onSelectMode(mode)}
        >
          <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 tracking-tight">
            {strings[titleKeys[mode]]}
          </span>
          <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-orange-400" />
        </button>
      ))}
    </div>
  );
}