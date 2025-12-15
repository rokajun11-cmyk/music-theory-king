import React, { useState } from 'react';
import { LangStrings, ScaleMode } from '../types';
import { calculateScale, extractChordType, calculateChordTones, formatChordDisplay } from '../utils';
import { chordTypes7, chordTypes3, solfege, noteValueMap } from '../constants';

interface ChordViewProps {
  strings: LangStrings;
  mode: ScaleMode;
  tonic: string;
  degree: 7 | 3;
  onSetDegree: (degree: 7 | 3) => void;
  onSetKey: (key: string) => void;
}

export default function ChordView({ 
  strings, 
  mode, 
  tonic, 
  degree, 
  onSetDegree, 
  onSetKey 
}: ChordViewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scaleNotes = calculateScale(mode, tonic);
  const romanChords = degree === 7 ? chordTypes7[mode] : chordTypes3[mode];

  const handleDegreeClick = (note: string) => {
    const newTonicNote = prompt(`${strings.edit_key_hint}?`, note);
    if (newTonicNote && noteValueMap[newTonicNote.toUpperCase()] !== undefined) {
      onSetKey(newTonicNote.toUpperCase());
    }
  };

  return (
    <div className="w-full">
      <div className="chord-settings flex justify-center gap-1 mb-8 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-full w-fit mx-auto border border-zinc-200 dark:border-zinc-700">
        <button 
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            degree === 7 
              ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
          onClick={() => onSetDegree(7)}
        >
          {strings.seventh_chord_btn}
        </button>
        <button 
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
            degree === 3 
              ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white' 
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
          onClick={() => onSetDegree(3)}
        >
          {strings.triad_btn}
        </button>
      </div>

      <div className="scale-display grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 w-full">
        {scaleNotes.map((note, i) => {
          const roman = romanChords[i];
          const type = extractChordType(roman);
          const isHovered = hoveredIndex === i;
          const displayChordName = formatChordDisplay(roman, type, note);
          const tones = calculateChordTones(note, type);

          return (
            <div 
              key={i}
              className="scale-degree flex flex-col items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg dark:hover:bg-zinc-800 transition-all h-36 sm:h-44 cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">
                {solfege[i]}
              </div>
              
              <div 
                className="text-3xl sm:text-4xl font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-orange-500 transition-colors py-2 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDegreeClick(note);
                }}
              >
                {note}
              </div>

              <div className={`degree-chord text-center leading-tight h-8 flex items-center justify-center transition-all
                  ${isHovered 
                    ? 'text-orange-600 dark:text-orange-400 font-bold text-xs' 
                    : 'text-sm font-medium text-zinc-400 dark:text-zinc-500'
                  }
                `}
              >
                {isHovered ? tones.join(' ') : displayChordName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}