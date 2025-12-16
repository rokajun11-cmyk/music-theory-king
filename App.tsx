import React, { useState, useEffect, useRef } from 'react';
import { Home, ArrowLeft, Music2, Layers, ChevronRight, Moon, Sun, Share, X } from 'lucide-react';
import { ViewState, Language, ChordMode, ChordDegree } from './types';
import { LANGUAGES, baseNotes, valueNoteMap, chordTypes3, chordTypes7, semitoneToInterval, noteValueMap } from './constants';
import { AudioEngine } from './services/audioEngine';
import { calculateInterval, calculateScale, calculateChordTones, extractChordType } from './services/musicLogic';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [history, setHistory] = useState<ViewState[]>(['home']);
  const [lang, setLang] = useState<Language>('zh');
  const [isDark, setIsDark] = useState(false);
  
  // Settings
  const [currentMode, setCurrentMode] = useState<ChordMode>('Major');
  const [currentKey, setCurrentKey] = useState('C');
  const [chordDegree, setChordDegree] = useState<ChordDegree>(7);
  const [isChromatic, setIsChromatic] = useState(false);

  // Interval State
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [intervalResult, setIntervalResult] = useState<string>('');

  // Test State
  const [testData, setTestData] = useState<{question: string, answer: string, type: 'note' | 'interval'} | null>(null);
  const [testInput, setTestInput] = useState('');
  const [testFeedback, setTestFeedback] = useState<{msg: string, isCorrect: boolean} | null>(null);
  const [errorCount, setErrorCount] = useState(0);

  const testInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Dark mode init
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const t = LANGUAGES[lang] as any; 

  const navigate = (newView: ViewState) => {
    setHistory([...history, newView]);
    setView(newView);
    // Reset states on nav
    if (newView === 'test') generateTest();
    if (newView === 'interval') {
      setSelectedNotes([]);
      setIntervalResult('');
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setView(newHistory[newHistory.length - 1]);
    }
  };

  const toggleLang = () => {
    const order: Language[] = ['zh', 'en', 'jp'];
    const idx = order.indexOf(lang);
    setLang(order[(idx + 1) % order.length]);
  };

  // --- Logic for Views ---

  const handleNoteSelect = (note: string) => {
    AudioEngine.play(note, 4);
    
    if (selectedNotes.length === 0) {
      setSelectedNotes([note]);
      setIntervalResult('...');
    } else {
      const newSelected = [selectedNotes[0], note];
      setSelectedNotes(newSelected);
      const res = calculateInterval(newSelected[0], newSelected[1]);
      setIntervalResult(res.replace('/P8', '').replace('P1/', ''));
      
      setTimeout(() => {
        setSelectedNotes([]);
        setIntervalResult('');
      }, 1200);
    }
  };

  const generateTest = () => {
    const startNote = isChromatic 
      ? valueNoteMap[Math.floor(Math.random()*12)] 
      : baseNotes[Math.floor(Math.random()*7)];
    
    const intervalsArr = Object.entries(semitoneToInterval).filter(([k,v]) => v.length < 5);
    const [semitonesStr, intName] = intervalsArr[Math.floor(Math.random() * intervalsArr.length)];
    const semitones = parseInt(semitonesStr);
    
    const endVal = (noteValueMap[startNote] + semitones) % 12;
    const endNote = valueNoteMap[endVal];

    const testType = Math.random() > 0.5 ? 'note' : 'interval';
    let q = '';
    let a = '';

    if (testType === 'note') {
      q = t.quiz_template_note.replace('{0}', startNote).replace('{1}', intName);
      a = endNote;
    } else {
      q = t.quiz_template_interval.replace('{0}', startNote).replace('{1}', endNote);
      a = calculateInterval(startNote, endNote);
    }

    setTestData({ question: q, answer: a, type: testType });
    setTestInput('');
    setTestFeedback(null);
    setErrorCount(0);
    
    setTimeout(() => {
      testInputRef.current?.focus();
    }, 100);
  };

  const checkTestAnswer = () => {
    if (!testData) return;
    
    // Normalize input
    const userAns = testInput.trim().toUpperCase().replace(/B/g, 'b').replace(/#/g, '#');
    let isCorrect = false;
    const correctAns = testData.answer;

    if (correctAns.includes('/')) {
        isCorrect = correctAns.split('/').map(a => a.trim()).includes(userAns);
    } else {
        isCorrect = (userAns === correctAns);
    }
    
    // Special case for unison/octave
    if (correctAns.includes('P1/P8') && (userAns === 'P1' || userAns === 'P8')) isCorrect = true;

    if (isCorrect) {
      setTestFeedback({ msg: t.feedback_correct, isCorrect: true });
      setTimeout(generateTest, 1500);
    } else {
      const newErr = errorCount + 1;
      setErrorCount(newErr);
      if (newErr >= 3) {
        const displayAnswer = correctAns.includes('P1/P8') ? 'P8' : correctAns;
        setTestFeedback({ msg: `${t.feedback_wrong} ${t.feedback_reveal} ${displayAnswer}`, isCorrect: false });
        setTimeout(() => {
           generateTest();
        }, 2000);
      } else {
        setTestFeedback({ msg: t.feedback_wrong, isCorrect: false });
      }
    }
  };

  // --- Render Functions ---

  const renderHome = () => (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-8">
      <div 
        className="group relative h-48 sm:h-64 p-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-orange-200 dark:hover:border-orange-900/50 bg-white dark:bg-zinc-900/50 hover:bg-orange-50/50 dark:hover:bg-zinc-900 active:scale-[0.98] active:bg-orange-100/50 dark:active:bg-zinc-800 active:border-orange-300 cursor-pointer flex flex-col items-center justify-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300"
        onClick={() => navigate('interval')}
      >
        <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 group-active:bg-orange-200 dark:group-active:bg-orange-900/40 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-active:text-orange-700 dark:group-active:text-orange-300 transition-colors duration-300">
          <Music2 className="w-8 h-8" />
        </div>
        <span className="group-hover:text-orange-600 dark:group-hover:text-orange-400 group-active:text-orange-700 dark:group-active:text-orange-300 text-xl font-bold text-zinc-800 dark:text-zinc-200 tracking-tight transition-colors">
          {t.interval_menu}
        </span>
      </div>

      <div 
        className="group h-48 sm:h-64 border border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-orange-200 dark:hover:border-orange-900/50 bg-white dark:bg-zinc-900/50 hover:bg-orange-50/50 dark:hover:bg-zinc-900 active:scale-[0.98] active:bg-orange-100/50 dark:active:bg-zinc-800 active:border-orange-300 cursor-pointer flex flex-col items-center justify-center gap-6 shadow-sm hover:shadow-xl transition-all duration-300"
        onClick={() => navigate('chord-type-menu')}
      >
        <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 group-active:bg-orange-200 dark:group-active:bg-orange-900/40 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-active:text-orange-700 dark:group-active:text-orange-300 transition-colors duration-300">
          <Layers className="w-8 h-8" />
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-active:text-orange-700 dark:group-active:text-orange-300 transition-colors">
          {t.chord_menu}
        </span>
      </div>
    </div>
  );

  const renderChordMenu = () => {
    const modes: ChordMode[] = ['Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor'];
    const titles = {
      'Major': t.major_title,
      'Natural Minor': t.natural_minor_title,
      'Harmonic Minor': t.harmonic_minor_title,
      'Melodic Minor': t.melodic_minor_title
    };

    return (
      <div className="w-full grid grid-cols-1 gap-3 mt-4 max-w-md mx-auto">
        {modes.map(mode => (
          <button 
            key={mode}
            className="group w-full flex items-center justify-between p-6 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:border-orange-300 dark:hover:border-orange-700 bg-white dark:bg-zinc-900 hover:shadow-lg dark:hover:bg-zinc-800 active:bg-zinc-50 dark:active:bg-zinc-800 active:border-orange-400 active:scale-[0.99] cursor-pointer transition-all"
            onClick={() => {
              setCurrentMode(mode);
              setCurrentKey('C');
              navigate('chord');
            }}
          >
            <span className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-active:text-orange-700 dark:group-active:text-orange-300 tracking-tight">
              {titles[mode]}
            </span>
            <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-600 group-hover:text-orange-400 group-active:text-orange-500" />
          </button>
        ))}
      </div>
    );
  };

  const renderIntervalView = () => {
    const notesToRender = isChromatic ? valueNoteMap : baseNotes;

    return (
      <div className="w-full flex flex-col items-center">
        <div className="h-32 flex items-center justify-center mb-4 w-full">
          <span className={`text-[5rem] sm:text-[6rem] font-black text-zinc-900 dark:text-white tracking-tighter transition-all ${selectedNotes.length === 1 ? 'animate-pulse' : ''}`}>
            {intervalResult}
          </span>
        </div>

        <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-6 my-4 px-2 select-none">
          {notesToRender.map(note => {
            const isSelected = selectedNotes.includes(note);
            return (
              <button
                key={note}
                className={`w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-transparent 
                  ${isSelected ? 'text-orange-500 font-extrabold scale-110 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'text-zinc-300 dark:text-zinc-700 font-bold'}
                  text-3xl sm:text-4xl hover:text-zinc-900 dark:hover:text-zinc-100 active:text-orange-500 dark:active:text-orange-400 active:scale-110 cursor-pointer select-none outline-none transition-all duration-300`}
                onClick={() => handleNoteSelect(note)}
              >
                {note}
              </button>
            );
          })}
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800">
          <button 
            className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:bg-orange-600 dark:hover:bg-orange-500 active:bg-orange-700 dark:active:bg-orange-600 hover:scale-105 active:scale-95 transition-all text-sm tracking-wide shadow-lg"
            onClick={() => navigate('test')}
          >
            {t.test_btn}
          </button>
          <button 
            className="px-8 py-3 bg-transparent text-zinc-500 dark:text-zinc-400 font-medium hover:text-zinc-900 dark:hover:text-zinc-100 active:text-zinc-900 dark:active:text-zinc-100 active:bg-zinc-100 dark:active:bg-zinc-900 rounded-full transition-all text-sm tracking-wide"
            onClick={() => setIsChromatic(!isChromatic)}
          >
            {isChromatic ? t.chromatic_toggle_basic : t.chromatic_toggle}
          </button>
        </div>
      </div>
    );
  };

  const renderChordView = () => {
    const scaleNotes = calculateScale(currentMode, currentKey);
    const romanChords = chordDegree === 7 ? chordTypes7[currentMode] : chordTypes3[currentMode];
    const solfege = ['1', '2', '3', '4', '5', '6', '7'];

    return (
      <div className="w-full">
        <div className="flex justify-center gap-1 mb-8 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-full w-fit mx-auto border border-zinc-200 dark:border-zinc-700">
          <button 
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${chordDegree === 7 ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            onClick={() => setChordDegree(7)}
          >
            {t.seventh_chord_btn}
          </button>
          <button 
             className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${chordDegree === 3 ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            onClick={() => setChordDegree(3)}
          >
            {t.triad_btn}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 w-full">
          {scaleNotes.map((note, i) => {
            const roman = romanChords[i];
            const type = extractChordType(roman);
            const displayChordName = `${note}${type.replace('Maj7', 'maj7').replace('m7', 'min7').replace('7', '7')}`.replace('$\\text{dim7}$', '°7').replace('+', '');
            const chordTones = calculateChordTones(note, type).join(' ');

            return (
              <div 
                key={i}
                className="group flex flex-col items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg dark:hover:bg-zinc-800 active:border-orange-300 active:scale-[0.98] active:bg-zinc-50 dark:active:bg-zinc-800 transition-all h-36 sm:h-44 cursor-pointer"
                onClick={() => AudioEngine.playChord(note, type)}
              >
                <div className="text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">{solfege[i]}</div>
                <div 
                  className="text-3xl sm:text-4xl font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-orange-500 group-active:text-orange-600 transition-colors py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTonic = prompt('Change tonic to:', note);
                    if (newTonic && noteValueMap[newTonic.toUpperCase()] !== undefined) {
                      setCurrentKey(newTonic.toUpperCase());
                    }
                  }}
                >
                  {note}
                </div>
                <div className="text-sm font-medium text-zinc-400 dark:text-zinc-500 text-center leading-tight h-8 flex items-center justify-center transition-all group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:text-xs group-hover:font-bold">
                  <span className="block group-hover:hidden">{displayChordName}</span>
                  <span className="hidden group-hover:block">{chordTones}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTestView = () => {
    if (!testData) return null;
    
    return (
       <div className="w-full max-w-xl mx-auto flex flex-col items-center pt-10">
          <div className="w-full text-center text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 leading-relaxed mb-12">
            <span dangerouslySetInnerHTML={{ __html: testData.question }} />
            <br/><br/>
            <input 
              ref={testInputRef}
              type="text" 
              maxLength={4}
              className={`inline-block w-20 mx-2 border-b-2 bg-transparent text-center font-bold text-3xl pb-1 focus:outline-none 
                ${testFeedback 
                  ? (testFeedback.isCorrect 
                      ? 'border-green-500 text-green-500' 
                      : 'border-red-500 text-red-500')
                  : 'border-zinc-300 dark:border-zinc-600 text-orange-600 dark:text-orange-400 focus:border-orange-500'
                }`}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') checkTestAnswer(); }}
              autoComplete="off"
            />
          </div>
          
          <div className={`h-8 text-center font-bold text-sm mb-8 tracking-wide ${testFeedback?.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {testFeedback ? testFeedback.msg : ''}
          </div>

          <div className="w-full flex justify-center gap-4">
              <button 
                className="w-full sm:w-auto min-w-[120px] px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:bg-orange-600 dark:hover:bg-orange-500 active:bg-orange-700 dark:active:bg-orange-600 hover:scale-105 active:scale-95 transition-all text-sm tracking-wide shadow-xl"
                onClick={checkTestAnswer}
              >
                {testFeedback?.isCorrect ? t.next_btn : t.check_btn}
              </button>
              {testFeedback?.isCorrect && (
                <button 
                  className="w-full sm:w-auto min-w-[120px] px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-600 transition-all text-sm tracking-wide"
                  onClick={generateTest}
                >
                  {t.next_btn}
                </button>
              )}
          </div>
       </div>
    );
  };

  // --- Header Construction ---

  let headerTitle = t.app_title;
  let headerSubtitle = '';

  if (view === 'interval') headerTitle = t.interval_title;
  if (view === 'chord-type-menu') headerTitle = t.chord_select_title;
  if (view === 'test') headerTitle = t.test_title;
  if (view === 'chord') {
     const modeKey = currentMode.toLowerCase().replace(/\s/g, '_') + '_title';
     headerTitle = (t as any)[modeKey] || t.app_title;
     const modeName = currentMode.includes('Minor') ? t.key_minor : t.key_major;
     headerSubtitle = `${currentKey} ${modeName}`;
  }

  return (
    <div className="app-container min-h-screen flex flex-col bg-white dark:bg-zinc-950 w-full max-w-5xl mx-auto relative shadow-2xl shadow-zinc-200/50 dark:shadow-none border-x border-zinc-100 dark:border-zinc-900">
      
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center transition-colors duration-300">
        <div className="nav-buttons flex items-center gap-2 sm:gap-3 shrink-0">
          <button 
            className="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors" 
            onClick={() => navigate('home')}
          >
            <Home className="w-5 h-5 sm:w-4 sm:h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="hidden sm:inline">{t.home_btn}</span>
          </button>
          
          {history.length > 1 && view !== 'home' && (
            <button 
              className="group flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors" 
              onClick={goBack}
            >
              <ArrowLeft className="w-6 h-6 sm:w-4 sm:h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="hidden sm:inline">{t.back_btn}</span>
            </button>
          )}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <h1 className="font-tech-title text-lg sm:text-xl font-bold tracking-wide text-zinc-900 dark:text-zinc-100 whitespace-nowrap uppercase">
            {headerTitle}
          </h1>
          {headerSubtitle && (
            <div className="text-[10px] sm:text-xs font-medium text-orange-500 dark:text-orange-400 tracking-wider uppercase mt-0.5 transition-all">
              {headerSubtitle}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex shrink-0 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-800">
             {(['zh', 'en', 'jp'] as Language[]).map(l => (
               <button 
                 key={l}
                 className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${lang === l ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                 onClick={() => setLang(l)}
               >
                 {l === 'zh' ? '中' : l.toUpperCase()}
               </button>
             ))}
          </div>

          <button 
             className="sm:hidden w-9 h-9 flex shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-bold"
             onClick={toggleLang}
          >
            {lang === 'zh' ? '中' : (lang === 'en' ? 'En' : 'JP')}
          </button>

          <button 
            className="w-9 h-9 flex shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="content-area flex-grow flex flex-col sm:px-8 w-full max-w-4xl mx-auto pt-8 pr-4 pb-12 pl-4 items-center justify-start">
         {view === 'home' && renderHome()}
         {view === 'chord-type-menu' && renderChordMenu()}
         {view === 'interval' && renderIntervalView()}
         {view === 'chord' && renderChordView()}
         {view === 'test' && renderTestView()}
      </div>
    </div>
  );
}
