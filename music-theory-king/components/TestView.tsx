import React, { useState, useEffect, useRef } from 'react';
import { LangStrings, Language } from '../types';
import { valueNoteMap, baseNotes, semitoneToInterval, noteValueMap } from '../constants';
import { calculateInterval } from '../utils';

interface TestViewProps {
  strings: LangStrings;
  currentLang: Language;
}

export default function TestView({ strings, currentLang }: TestViewProps) {
  const [question, setQuestion] = useState<{
    textPrefix?: string;
    startNote: string;
    midText?: string;
    targetName?: string;
    endNote?: string;
    suffix?: string;
    correctAnswer: string;
    type: 'note' | 'interval';
  } | null>(null);
  
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [errorCount, setErrorCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateQuestion = () => {
    // Reset state
    setUserAnswer('');
    setStatus('idle');
    setErrorCount(0);
    
    // Logic
    const isChromatic = Math.random() > 0.5;
    const startNote = isChromatic 
      ? valueNoteMap[Math.floor(Math.random() * 12)] 
      : baseNotes[Math.floor(Math.random() * 7)];
    
    const intervalsArr = Object.entries(semitoneToInterval).filter(([k, v]) => v.length < 5);
    const [semitonesStr, name] = intervalsArr[Math.floor(Math.random() * intervalsArr.length)];
    const semitones = parseInt(semitonesStr);

    const endVal = (noteValueMap[startNote] + semitones) % 12;
    const endNote = valueNoteMap[endVal];

    const testType = Math.floor(Math.random() * 2); // 0: Find Note, 1: Find Interval

    if (testType === 0) {
      setQuestion({
        startNote,
        targetName: name,
        correctAnswer: endNote,
        type: 'note'
      });
    } else {
      setQuestion({
        startNote,
        endNote,
        correctAnswer: calculateInterval(startNote, endNote),
        type: 'interval'
      });
    }
    
    // Auto focus
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Initial load
  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = () => {
    if (!question) return;

    if (status === 'correct') {
      generateQuestion();
      return;
    }

    const cleanUser = userAnswer.trim().toUpperCase().replace(/B/g, 'b').replace(/#/g, '#');
    let isCorrect = false;

    if (question.correctAnswer.includes('/')) {
        isCorrect = question.correctAnswer.split('/').map(a => a.trim()).includes(cleanUser);
    } else {
        isCorrect = (cleanUser === question.correctAnswer);
    }
    
    if (question.correctAnswer.includes('P1/P8') && (cleanUser === 'P1' || cleanUser === 'P8')) isCorrect = true;

    if (isCorrect) {
      setStatus('correct');
    } else {
      setStatus('wrong');
      setErrorCount(prev => prev + 1);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          handleCheck();
      }
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center pt-10">
      <div className="test-question w-full text-center text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 leading-relaxed mb-12">
        {question.type === 'note' ? (
          <>
            {currentLang === 'en' ? 'Starting from ' : '从 '}
            <span className="text-orange-600 dark:text-orange-400 font-bold px-1">{question.startNote}</span>
            {currentLang === 'en' ? ', what is ' : ' 开始，'}
            <br className="sm:hidden" />
            <span className="text-orange-600 dark:text-orange-400 font-bold px-1">{question.targetName}</span>
            {currentLang === 'en' ? '?' : ' 是哪个音？'}
          </>
        ) : (
          <>
            <span className="text-orange-600 dark:text-orange-400 font-bold px-1">{question.startNote}</span>
            {currentLang === 'en' ? ' to ' : ' 到 '}
            <span className="text-orange-600 dark:text-orange-400 font-bold px-1">{question.endNote}</span>
            <br className="sm:hidden" />
            {currentLang === 'en' ? ' interval is?' : ' 的音程是？'}
          </>
        )}
        
        <br/><br/>
        
        <input 
          ref={inputRef}
          type="text" 
          maxLength={4} 
          className={`inline-block w-20 mx-2 border-b-2 bg-transparent text-center font-bold text-3xl pb-1 focus:outline-none 
            ${status === 'correct' ? 'border-green-500 text-green-500' : 
              status === 'wrong' ? 'border-red-500 text-red-500' : 
              'border-zinc-300 dark:border-zinc-600 text-orange-600 dark:text-orange-400 focus:border-orange-500'
            }`}
          autoComplete="off"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className={`h-8 text-center font-bold text-sm mb-8 tracking-wide ${
          status === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
      }`}>
        {status === 'correct' && strings.feedback_correct}
        {status === 'wrong' && (
             errorCount >= 3 
             ? `${strings.feedback_wrong} ${strings.feedback_reveal} ${question.correctAnswer.split('/')[0]}`
             : strings.feedback_wrong
        )}
      </div>

      <div className="test-controls w-full flex justify-center gap-4">
        <button 
          className="test-btn w-full sm:w-auto min-w-[120px] px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:bg-orange-600 dark:hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all text-sm tracking-wide shadow-xl"
          onClick={handleCheck}
        >
          {status === 'correct' ? strings.next_btn : strings.check_btn}
        </button>
        <button 
          className="test-btn w-full sm:w-auto min-w-[120px] px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all text-sm tracking-wide"
          onClick={generateQuestion}
        >
          {strings.next_btn}
        </button>
      </div>
    </div>
  );
}