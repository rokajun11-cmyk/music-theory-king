import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react/client';
import { 
  Home, 
  ArrowLeft, 
  Moon, 
  Sun, 
  Music2, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// --- 常量与映射表 ---
const noteValueMap: Record<string, number> = { 'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11 };
const valueNoteMap = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const baseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const semitoneToInterval: Record<number, string> = { 0: 'P1/P8', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3', 5: 'P4', 6: 'A4/d5', 7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7' };
const midiToNoteNames: Record<number, string[]> = { 
    0: ['C', 'B#', 'Dbb'], 1: ['Db', 'C#', 'B##'], 2: ['D', 'C##', 'Ebb'], 3: ['Eb', 'D#', 'Fbb'], 4: ['E', 'Fb', 'D##'], 
    5: ['F', 'E#', 'Gbb'], 6: ['Gb', 'F#', 'E##'], 7: ['G', 'F##', 'Abb'], 8: ['Ab', 'G#'], 9: ['A', 'G##', 'Bbb'], 
    10: ['Bb', 'A#', 'Cbb'], 11: ['B', 'Cb', 'A##'] 
};

const chordOffsetMap: Record<string, number[]> = {
    'maj7': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], '7': [0, 4, 7, 10], 'm7(b5)': [0, 3, 6, 10], 
    'dim7': [0, 3, 6, 9], 'mMaj7': [0, 3, 7, 11], 'maj7#5': [0, 4, 8, 11], 
    'I': [0, 4, 7], 'i': [0, 3, 7], 'ii': [0, 3, 7], 'iii': [0, 3, 7], 'IV': [0, 4, 7], 'V': [0, 4, 7], 
    'vi': [0, 3, 7], 'ii°': [0, 3, 6], 'vii°': [0, 3, 6], 'III+': [0, 4, 8], 'v': [0, 3, 7], 'vi°': [0, 3, 6], 'VI': [0, 4, 7], 'VII': [0, 4, 7], 'iv': [0, 3, 7], 'III': [0, 4, 7]
};

const scaleIntervals: Record<string, number[]> = {
    'Major': [0, 2, 4, 5, 7, 9, 11, 12],
    'Natural Minor': [0, 2, 3, 5, 7, 8, 10, 12],
    'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11, 12],
    'Melodic Minor': [0, 2, 3, 5, 7, 9, 11, 12]
};

const chordTypes7: Record<string, string[]> = {
    'Major': ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7(b5)'],
    'Natural Minor': ['m7', 'm7(b5)', 'maj7', 'm7', 'm7', 'maj7', '7'],
    'Harmonic Minor': ['mMaj7', 'm7(b5)', 'maj7#5', 'm7', '7', 'maj7', 'dim7'],
    'Melodic Minor': ['mMaj7', 'm7', 'maj7#5', '7', '7', 'm7(b5)', '7']
};

const chordTypes3: Record<string, string[]> = {
    'Major': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Natural Minor': ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    'Harmonic Minor': ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
    'Melodic Minor': ['i', 'ii', 'III+', 'iv', 'V', 'vi°', 'vii°']
};

const modeRomans: Record<string, string[]> = {
    'Major': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Natural Minor': ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    'Harmonic Minor': ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
    'Melodic Minor': ['i', 'ii', 'III+', 'iv', 'V', 'vi°', 'vii°']
};

const modeFunctions: Record<string, string[]> = {
    'Major': ['T', 'PD', 'T', 'PD', 'D', 'T', 'D'],
    'Natural Minor': ['T', 'PD', 'T', 'PD', 'D', 'T', 'PD'],
    'Harmonic Minor': ['T', 'PD', 'T', 'PD', 'D', 'PD/T', 'D'],
    'Melodic Minor': ['T', 'PD', 'T', 'PD', 'D', 'PD', 'D']
};

const modalDataMap: Record<string, any> = {
    'Major': { names: ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'], avoids: [[3], [], [1, 5], [], [3], [5], [1]] },
    'Natural Minor': { names: ['Aeolian', 'Locrian', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian'], avoids: [[5], [1], [3], [], [1, 5], [], [3]] },
    'Harmonic Minor': { names: ['Harmonic Minor', 'Locrian nat6', 'Ionian #5', 'Dorian #4', 'Phrygian Dom', 'Lydian #2', 'Altered bb7'], avoids: [[5], [1], [3, 5], [], [1, 3, 5], [], [1, 2]] },
    'Melodic Minor': { names: ['Melodic Minor', 'Dorian b2', 'Lydian Aug', 'Lydian Dom', 'Mixolydian b6', 'Locrian nat2', 'Altered Scale'], avoids: [[], [1], [5], [], [3], [], [1, 3]] }
};

// --- 工具函数 ---
const getSpelledNote = (midiValue: number, targetLetter: string) => {
    const possibleNames = midiToNoteNames[midiValue] || [];
    return possibleNames.find(name => name.startsWith(targetLetter)) || possibleNames[0] || '?';
};

const calculateScale = (mode: string, tonic: string) => {
    const startValue = noteValueMap[tonic];
    const intervals = scaleIntervals[mode];
    const tonicLetterIndex = baseNotes.indexOf(tonic.charAt(0));
    return intervals.slice(0, 7).map((offset, index) => {
        const noteValue = (startValue + offset) % 12;
        const expectedLetter = baseNotes[(tonicLetterIndex + index) % 7];
        return getSpelledNote(noteValue, expectedLetter);
    });
};

const getSecondaryDominantInfo = (targetNote: string, targetRoman: string) => {
    const targetRootVal = noteValueMap[targetNote];
    const secRootVal = (targetRootVal + 7) % 12;
    const targetLetterIndex = baseNotes.indexOf(targetNote.charAt(0));
    const secRootLetterIndex = (targetLetterIndex + 4) % 7;
    const secRoot = getSpelledNote(secRootVal, baseNotes[secRootLetterIndex]);
    const isMinor = targetRoman.toLowerCase() === targetRoman;
    const modal = isMinor ? "Mixolydian ♭9 ♭13" : "Mixolydian";
    const offsets = isMinor ? [0, 1, 4, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 10];
    const scaleTones = offsets.map((off, idx) => getSpelledNote((secRootVal + off) % 12, baseNotes[(secRootLetterIndex + idx) % 7]));
    const chordTones = [0, 4, 7, 10].map(off => getSpelledNote((secRootVal + off) % 12, ""));
    return { abbr: `V/${targetRoman}`, name: `${secRoot}7`, tones: chordTones, modal: modal, root: secRoot, scaleTones: scaleTones, avoidIdxs: [3] };
};

// --- 音频引擎 ---
const AudioEngine = {
    ctx: null as AudioContext | null,
    TUNING_FREQ_A4: 440,
    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.ctx = new AudioContextClass();
        }
        if (this.ctx!.state === 'suspended') this.ctx!.resume();
        return this.ctx!;
    },
    playChord(rootNote: string, chordType: string) {
        const ctx = this.init();
        const rootBase = rootNote.replace(/[0-9]/g, '');
        const rootIndex = noteValueMap[rootBase];
        if (rootIndex === undefined) return;

        const offsets = chordOffsetMap[chordType] || [0, 4, 7];
        const now = ctx.currentTime;
        
        // 优化时间调度，确保琶音播放极度精准且不重叠
        offsets.forEach((offset, index) => {
            const midi = 60 + rootIndex + offset;
            const freq = this.TUNING_FREQ_A4 * Math.pow(2, (midi - 69) / 12);
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            const startTime = now + (index * 0.05); // 琶音间隔 50ms
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 0.9);
        });
    }
};

// --- 子组件: 和弦卡片 ---
const ChordCard = ({ root, type, roman, func, modalName, avoids, currentScale, onKeyChange }: any) => {
    const [isSecondary, setIsSecondary] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const touchStart = useRef({ x: 0, y: 0 });

    const secInfo = getSecondaryDominantInfo(root, roman);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

        // 进一步优化滑动算法：
        // 1. 水平位移必须足够大 (> 50px)
        // 2. 水平位移必须远大于垂直位移 (3倍以上)，极度降低误触率
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 3) {
            setIsSecondary(deltaX > 0);
            setIsExpanded(false);
        }
    };

    const renderTones = (tones: string[], highlightIdxs?: number[]) => (
        <div className="flex justify-center gap-1 mt-4 h-6 overflow-hidden">
            {tones.map((t, i) => {
                const isAvoid = highlightIdxs?.includes(i);
                return (
                    <span key={i} className={`text-[10px] font-bold px-1 rounded ${isAvoid ? 'line-through opacity-20 text-zinc-400' : 'text-orange-500'}`}>
                        {t}
                    </span>
                );
            })}
        </div>
    );

    return (
        <div 
            className={`relative overflow-hidden rounded-3xl border transition-all duration-500 h-64 select-none
                ${isSecondary 
                    ? 'border-orange-400/40 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:border-orange-900/40 dark:from-orange-950/20 dark:to-zinc-900 shadow-[inset_0_0_15px_rgba(249,115,22,0.08)]' 
                    : 'border-zinc-100 bg-white dark:bg-zinc-900 dark:border-zinc-800'}
                ${isExpanded ? 'shadow-inner' : 'shadow-sm hover:shadow-md'}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => {
                AudioEngine.playChord(isSecondary ? secInfo.root : root, isSecondary ? '7' : type);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
            }}
        >
            <div className={`flex w-[200%] h-full transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) ${isSecondary ? 'translate-x-0' : '-translate-x-1/2'}`}>
                {/* 副属和弦面 (Secondary Dominant) */}
                <div className="w-1/2 flex flex-col items-center justify-center p-4 relative group">
                    <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-4 opacity-80">{secInfo.abbr}</div>
                    <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-2 transition-transform group-active:scale-95">{secInfo.root}</div>
                    <div className={`transition-all duration-300 flex flex-col items-center ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0'}`}>
                        <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter text-center">{secInfo.modal}</div>
                        {renderTones(secInfo.scaleTones, secInfo.avoidIdxs)}
                    </div>
                    {!isExpanded && <div className="text-xs font-semibold text-orange-400/50">{secInfo.name}</div>}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 text-orange-400 dark:text-orange-800 opacity-20"><ChevronLeft size={16}/></div>
                </div>

                {/* 主功能和弦面 (Diatonic) */}
                <div className="w-1/2 flex flex-col items-center justify-center p-4 relative group">
                    <div className="flex gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                        <span>{roman}</span><span className="opacity-20">|</span><span>{func}</span>
                    </div>
                    <div 
                        className="text-4xl font-black text-zinc-800 dark:text-zinc-100 mb-2 hover:text-orange-500 cursor-pointer transition-transform group-active:scale-95"
                        onClick={(e) => { e.stopPropagation(); onKeyChange(root); }}
                    >{root}</div>
                    <div className={`transition-all duration-300 flex flex-col items-center ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0'}`}>
                        <div className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter text-center">{modalName}</div>
                        {renderTones(currentScale, avoids)}
                    </div>
                    {!isExpanded && <div className="text-xs font-semibold text-zinc-400">{root}{type}</div>}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-800 opacity-40"><ChevronRight size={16}/></div>
                </div>
            </div>
        </div>
    );
};

// --- 主 App 组件 ---
const MusicTheoryApp = () => {
  const [view, setView] = useState<'home' | 'chord-menu' | 'interval' | 'chord' | 'test'>('home');
  const [history, setHistory] = useState<string[]>(['home']);
  const [isDark, setIsDark] = useState(false);
  const [currentKey, setCurrentKey] = useState('C');
  const [currentMode, setCurrentMode] = useState('Major');
  const [chordDegree, setChordDegree] = useState(7);
  const [isChromatic, setIsChromatic] = useState(false);
  const [intervalNotes, setIntervalNotes] = useState<string[]>([]);
  const [testQuestion, setTestQuestion] = useState<any>(null);
  const [testFeedback, setTestFeedback] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [answerInput, setAnswerInput] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true);
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    matcher.addEventListener('change', handler);
    return () => matcher.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const navigateTo = (newView: any) => {
    setHistory(prev => [...prev, newView]);
    setView(newView);
    if(newView === 'test') generateTest();
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setView(newHistory[newHistory.length - 1] as any);
    }
  };

  const generateTest = () => {
    const startNote = baseNotes[Math.floor(Math.random() * 7)];
    const entries = Object.entries(semitoneToInterval);
    const [semi, name] = entries[Math.floor(Math.random() * entries.length)];
    const correct = valueNoteMap[(noteValueMap[startNote] + parseInt(semi)) % 12];
    setTestQuestion({ startNote, name, correct });
    setAnswerInput('');
    setTestFeedback(null);
  };

  const checkAnswer = () => {
    if (answerInput.trim().toUpperCase() === testQuestion.correct.toUpperCase()) {
      setTestFeedback({ msg: '正确！', type: 'success' });
      setTimeout(generateTest, 1000);
    } else {
      setTestFeedback({ msg: '不对哦，再试一次', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-4 h-16 flex justify-between items-center">
        <div className="flex gap-2">
           <button onClick={() => { setView('home'); setHistory(['home']); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-transform active:scale-90"><Home size={20}/></button>
           {view !== 'home' && <button onClick={goBack} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-transform active:scale-90"><ArrowLeft size={20}/></button>}
        </div>
        
        <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-widest text-zinc-400">Theory King</h1>
            {view === 'chord' && <div className="text-orange-500 text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in-50">Key: {currentKey}</div>}
        </div>

        <button onClick={() => setIsDark(!isDark)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-transform active:rotate-12 active:scale-90">
            {isDark ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
      </header>

      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
         {view === 'home' && (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div onClick={() => navigateTo('interval')} className="p-12 border rounded-[2.5rem] bg-white dark:bg-zinc-900 flex flex-col items-center gap-6 cursor-pointer hover:shadow-2xl transition-all group border-zinc-100 dark:border-zinc-800">
                <div className="p-6 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-full group-hover:scale-110 transition-transform"><Music2 size={40}/></div>
                <span className="text-2xl font-black">音程关系</span>
              </div>
              <div onClick={() => navigateTo('chord-menu')} className="p-12 border rounded-[2.5rem] bg-white dark:bg-zinc-900 flex flex-col items-center gap-6 cursor-pointer hover:shadow-2xl transition-all group border-zinc-100 dark:border-zinc-800">
                <div className="p-6 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-full group-hover:scale-110 transition-transform"><Layers size={40}/></div>
                <span className="text-2xl font-black">和弦系统</span>
              </div>
           </div>
         )}

         {view === 'interval' && (
            <div className="flex flex-col items-center mt-8 animate-in fade-in zoom-in-95">
                <div className="h-40 flex items-center justify-center">
                    <span className="text-8xl font-black tracking-tighter text-zinc-900 dark:text-white">
                        {intervalNotes.length === 2 ? calculateInterval(intervalNotes[0], intervalNotes[1]) : ''}
                    </span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {(isChromatic ? valueNoteMap : baseNotes).map(n => (
                        <button 
                            key={n}
                            onClick={() => {
                                if(intervalNotes.length >= 2) setIntervalNotes([n]);
                                else setIntervalNotes([...intervalNotes, n]);
                            }}
                            className={`w-16 h-16 rounded-2xl font-black text-xl transition-all
                                ${intervalNotes.includes(n) ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-400 active:scale-95'}`}
                        >{n}</button>
                    ))}
                </div>
                <div className="mt-12 flex gap-4">
                    <button onClick={() => navigateTo('test')} className="px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold shadow-xl transition-transform active:scale-95">开始挑战</button>
                    <button onClick={() => setIsChromatic(!isChromatic)} className="px-8 py-4 border rounded-full font-bold opacity-50 hover:opacity-100 transition-opacity">半音模式: {isChromatic ? '开' : '关'}</button>
                </div>
            </div>
         )}

         {view === 'chord-menu' && (
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mt-8">
                {['Major', 'Natural Minor', 'Harmonic Minor', 'Melodic Minor'].map(m => (
                    <button 
                        key={m}
                        onClick={() => { setCurrentMode(m); navigateTo('chord'); }}
                        className="flex items-center justify-between p-8 border rounded-3xl bg-white dark:bg-zinc-900 hover:border-orange-500 transition-all group border-zinc-100 dark:border-zinc-800 active:scale-[0.98]"
                    >
                        <span className="text-xl font-bold">{m} Chords</span>
                        <ChevronRight className="text-zinc-300 group-hover:text-orange-500 transition-colors"/>
                    </button>
                ))}
            </div>
         )}

         {view === 'chord' && (
            <div className="animate-in fade-in duration-500">
                <div className="flex justify-center gap-2 mb-10 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full w-fit mx-auto shadow-sm">
                    {[7, 3].map(d => (
                        <button 
                            key={d}
                            onClick={() => setChordDegree(d)}
                            className={`px-8 py-2 rounded-full text-xs font-black transition-all ${chordDegree === d ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-500' : 'text-zinc-400'}`}
                        >{d === 7 ? 'SEVENTH' : 'TRIAD'}</button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                    {calculateScale(currentMode, currentKey).map((root, i) => {
                        const type = (chordDegree === 7 ? chordTypes7[currentMode] : chordTypes3[currentMode])[i];
                        const roman = modeRomans[currentMode][i];
                        const func = modeFunctions[currentMode][i];
                        const mData = modalDataMap[currentMode];
                        const modalScale = [];
                        const parentScale = calculateScale(currentMode, currentKey);
                        for (let j = 0; j < 7; j++) modalScale.push(parentScale[(i + j) % 7]);

                        return (
                            <ChordCard 
                                key={i}
                                root={root}
                                type={type}
                                roman={roman}
                                func={func}
                                modalName={mData.names[i]}
                                avoids={mData.avoids[i]}
                                currentScale={modalScale}
                                onKeyChange={setCurrentKey}
                            />
                        );
                    })}
                </div>
            </div>
         )}

         {view === 'test' && testQuestion && (
            <div className="max-w-md mx-auto mt-20 text-center animate-in zoom-in-95">
                <div className="text-3xl font-black mb-12 leading-tight">
                    从 <span className="text-orange-500">{testQuestion.startNote}</span> 开始<br/>
                    第 <span className="text-orange-500">{testQuestion.name}</span> 是哪个音？
                </div>
                <input 
                    type="text" 
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    className="w-full text-center text-5xl font-black py-4 bg-transparent border-b-4 border-zinc-200 dark:border-zinc-800 focus:border-orange-500 outline-none transition-colors uppercase"
                    autoFocus
                    placeholder="?"
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                />
                {testFeedback && (
                    <div className={`mt-8 font-bold flex items-center justify-center gap-2 animate-bounce ${testFeedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                        {testFeedback.type === 'success' ? <CheckCircle2 size={18}/> : <XCircle size={18}/>}
                        {testFeedback.msg}
                    </div>
                )}
                <div className="flex gap-4 mt-12">
                    <button onClick={checkAnswer} className="flex-1 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl font-black shadow-xl active:scale-95 transition-transform">检查</button>
                    <button onClick={generateTest} className="px-8 py-4 bg-zinc-100 dark:bg-zinc-800 rounded-3xl font-bold opacity-50 hover:opacity-100">跳过</button>
                </div>
            </div>
         )}
      </main>
      
      <footer className="p-8 text-center text-[10px] font-bold text-zinc-300 dark:text-zinc-800 tracking-widest uppercase">
          Music Theory King Pro &copy; 2025
      </footer>
    </div>
  );
};

// 帮助函数
function calculateInterval(note1: string, note2: string) {
    const v1 = noteValueMap[note1] || 0;
    const v2 = noteValueMap[note2] || 0;
    let semitones = (v2 - v1 + 12) % 12; 
    return semitoneToInterval[semitones];
}

const rootEl = document.getElementById('root');
if (rootEl) {
    createRoot(rootEl).render(<MusicTheoryApp />);
}
