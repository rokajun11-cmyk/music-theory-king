import React from 'react';
import { Music2, Layers } from 'lucide-react';
import { LangStrings, View } from '../types';

interface HomeMenuProps {
  strings: LangStrings;
  onNavigate: (view: View) => void;
}

export default function HomeMenu({ strings, onNavigate }: HomeMenuProps) {
  return (
    <div className="main-menu w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-8">
      <div 
        className="menu-card group sm:h-64 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-orange-900/50 dark:bg-zinc-900/50 hover:bg-orange-50/50 dark:hover:bg-zinc-900 cursor-pointer flex flex-col gap-6 hover:shadow-xl transition-all duration-300 bg-white h-48 border-zinc-200 border rounded-3xl pt-8 pr-8 pb-8 pl-8 relative shadow-sm gap-x-6 gap-y-6 items-center justify-center"
        onClick={() => onNavigate('interval')}
      >
        <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
          <Music2 size={32} className="text-current" />
        </div>
        <span className="group-hover:text-orange-600 dark:group-hover:text-orange-400 text-xl font-bold text-zinc-800 dark:text-zinc-200 tracking-tight transition-colors">
          {strings.interval_menu}
        </span>
      </div>
      
      <div 
        className="menu-card group h-48 sm:h-64 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-orange-200 dark:hover:border-orange-900/50 bg-white dark:bg-zinc-900/50 hover:bg-orange-50/50 dark:hover:bg-zinc-900 cursor-pointer flex flex-col items-center justify-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300 relative"
        onClick={() => onNavigate('chord-type-menu')}
      >
        <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
          <Layers size={32} className="text-current" />
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {strings.chord_menu}
        </span>
      </div>
    </div>
  );
}