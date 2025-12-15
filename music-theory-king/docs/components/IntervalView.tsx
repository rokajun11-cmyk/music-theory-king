import React, { useState } from 'react';
import { LangStrings } from '../types';
import { valueNoteMap, baseNotes } from '../constants';
import { calculateInterval } from '../utils';

interface IntervalViewProps {
  strings: LangStrings;
  onStartTest: () => void;
}

export default function IntervalView({ strings, onStartTest }: IntervalViewProps) {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [isChromatic, setIsChromatic] = useState(false);
  const [displayResult, setDisplayResult] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);

  const notesToRender = isChromatic ? valueNoteMap : baseNotes;

  const handleNoteClick = (note: string) => {
    if (selectedNotes.length === 0) {
      const newSelected = [note];
      setSelectedNotes(newSelected);
      setDisplayResult('...');
      setIsPulsing(true);
    } else {
      const newSelected = [selectedNotes[0], note];
      setSelectedNotes(newSelected);
      
      const interval = calculateInterval(newSelected[0], newSelected[1]);
      setIsPulsing(false);
      setDisplayResult(interval.replace('/P8', '').replace('P1/', ''));
      
      setTimeout(() => {
        setSelectedNotes([]);
        setDisplayResult('');
      }, 1200);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="interval-result h-32 flex items-center justify-center mb-4 w-full">
        <span className={`text-[5rem] sm:text-[6rem] font-black text-zinc-900 dark:text-white tracking-tighter transition-all ${isPulsing ? 'animate-pulse' : ''}`}>
          {displayResult}
        </span>
      </div>

      <div className="note-display w-full flex flex-wrap justify-center gap-2 sm:gap-6 my-4 px-2 select-none">
        {notesToRender.map((note) => {
          const isSelected = selectedNotes.includes(note);
          return (
            <button
              key={note}
              className={`note-name w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-transparent font-bold text-3xl sm:text-4xl cursor-pointer select-none outline-none transition-all duration-300
                ${isSelected 
                  ? 'text-orange-500 scale-125 font-extrabold !text-shadow-[0_0_20px_rgba(249,115,22,0.3)]' 
                  : 'text-zinc-300 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
                }
              `}
              onClick={() => handleNoteClick(note)}
            >
              {note}
            </button>
          );
        })}
      </div>

      <div className="test-controls w-full flex flex-col sm:flex-row justify-center gap-4 mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <button 
          className="test-btn px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:bg-orange-600 dark:hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all text-sm tracking-wide shadow-lg"
          onClick={onStartTest}
        >
          {strings.test_btn}
        </button>
        <button 
          className="test-btn px-8 py-3 bg-transparent text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 transition-all text-sm tracking-wide"
          onClick={() => {
              setIsChromatic(!isChromatic);
              setSelectedNotes([]);
              setDisplayResult('');
          }}
        >
          {isChromatic ? strings.chromatic_toggle_basic : strings.chromatic_toggle}
        </button>
      </div>
    </div>
  );
}