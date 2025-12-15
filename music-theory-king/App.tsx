import React, { useState, useEffect } from 'react';
import { Language, View, LANGUAGES, ScaleMode } from './types';
import Header from './components/Header';
import HomeMenu from './components/HomeMenu';
import IntervalView from './components/IntervalView';
import ChordTypeMenu from './components/ChordTypeMenu';
import ChordView from './components/ChordView';
import TestView from './components/TestView';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [history, setHistory] = useState<View[]>(['home']);
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [isDark, setIsDark] = useState(false);
  
  // App State
  const [currentMode, setCurrentMode] = useState<ScaleMode>('Major');
  const [currentKey, setCurrentKey] = useState<string>('C');
  const [chordDegree, setChordDegree] = useState<7 | 3>(7);

  // Initialize theme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  // Update HTML class for dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  // Update document title based on language
  useEffect(() => {
    document.title = LANGUAGES[currentLang].app_title;
  }, [currentLang]);

  const goToView = (view: View) => {
    setHistory(prev => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setHistory(newHistory);
      setCurrentView(newHistory[newHistory.length - 1]);
    }
  };

  const strings = LANGUAGES[currentLang];

  const handleChordModeSelect = (mode: ScaleMode) => {
    setCurrentMode(mode);
    setCurrentKey('C');
    setChordDegree(7);
    goToView('chord');
  };

  return (
    <div className="app-container min-h-screen border-x flex flex-col dark:bg-zinc-950 dark:border-zinc-900 shadow-zinc-200/50 dark:shadow-none bg-white w-full max-w-5xl border-zinc-100 mr-auto ml-auto relative shadow-2xl">
      <Header 
        currentView={currentView}
        currentLang={currentLang}
        isDark={isDark}
        canGoBack={history.length > 1 && currentView !== 'home'}
        currentMode={currentMode}
        currentKey={currentKey}
        onLangChange={setCurrentLang}
        onThemeToggle={() => setIsDark(!isDark)}
        onGoHome={() => goToView('home')}
        onGoBack={goBack}
      />

      <div className="content-area flex-grow flex flex-col sm:px-8 w-full max-w-4xl mr-auto ml-auto pt-8 pr-4 pb-12 pl-4 items-center justify-start">
        {currentView === 'home' && (
          <HomeMenu 
            strings={strings} 
            onNavigate={goToView} 
          />
        )}
        
        {currentView === 'interval' && (
          <IntervalView 
            strings={strings} 
            onStartTest={() => goToView('test')} 
          />
        )}

        {currentView === 'chord-type-menu' && (
          <ChordTypeMenu 
            strings={strings} 
            onSelectMode={handleChordModeSelect} 
          />
        )}

        {currentView === 'chord' && (
          <ChordView 
            strings={strings}
            mode={currentMode}
            tonic={currentKey}
            degree={chordDegree}
            onSetDegree={setChordDegree}
            onSetKey={setCurrentKey}
          />
        )}

        {currentView === 'test' && (
          <TestView 
            strings={strings} 
            currentLang={currentLang}
          />
        )}
      </div>
    </div>
  );
}