
import { LangData, NoteMap } from './types.ts';

export const LANGUAGES: Record<string, LangData> = {
  zh: {
      app_title: '乐理学习王', home_btn: '首页', back_btn: '返回',
      interval_menu: '音程关系', chord_menu: '和弦组成音',
      interval_title: '音程关系学习', chord_select_title: '和弦调式选择',
      major_title: '自然大调', natural_minor_title: '自然小调',
      harmonic_minor_title: '和声小调', melodic_minor_title: '旋律小调',
      test_title: '音程测试', test_btn: '开始测试', check_btn: '检查答案', next_btn: '下一题',
      chromatic_toggle: '切换到：带升降音', chromatic_toggle_basic: '切换到：基础音名',
      seventh_chord_btn: '七和弦', triad_btn: '三和弦',
      key_major: '大调', key_minor: '小调',
      feedback_correct: '太棒了！正确', feedback_wrong: '哎呀！错误',
      feedback_reveal: '正确答案是：', edit_key_hint: '点击修改调性',
      quiz_template_note: '从 <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{0}</span> 开始，<br> <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{1}</span> 是哪个音？',
      quiz_template_interval: '<span class="text-orange-600 dark:text-orange-400 font-bold px-1">{0}</span> 到 <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{1}</span> <br>的音程是？'
  },
  en: {
      app_title: 'Music Theory King', home_btn: 'Home', back_btn: 'Back',
      interval_menu: 'Intervals', chord_menu: 'Chords',
      interval_title: 'Intervals', chord_select_title: 'Select Mode',
      major_title: 'Major Scale', natural_minor_title: 'Natural Minor',
      harmonic_minor_title: 'Harmonic Minor', melodic_minor_title: 'Melodic Minor',
      test_title: 'Quiz', test_btn: 'Start Quiz', check_btn: 'Check', next_btn: 'Next',
      chromatic_toggle: 'Mode: Chromatic', chromatic_toggle_basic: 'Mode: Basic',
      seventh_chord_btn: 'Sevenths', triad_btn: 'Triads',
      key_major: 'Major', key_minor: 'Minor',
      feedback_correct: 'Correct!', feedback_wrong: 'Wrong!',
      feedback_reveal: 'Answer is: ', edit_key_hint: 'Click to change key',
      quiz_template_note: 'What is the note <br> <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{1}</span> above <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{0}</span>?',
      quiz_template_interval: 'What is the interval between <br> <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{0}</span> and <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{1}</span>?'
  },
  jp: {
      app_title: '楽典のキング', home_btn: 'ホーム', back_btn: '戻る',
      interval_menu: '音程', chord_menu: 'コード',
      interval_title: '音程学習', chord_select_title: 'モード選択',
      major_title: '長調', natural_minor_title: '自然的短調',
      harmonic_minor_title: '和声的短調', melodic_minor_title: '旋律的短調',
      test_title: 'テスト', test_btn: 'テスト開始', check_btn: '確認', next_btn: '次へ',
      chromatic_toggle: '切替: 変化記号', chromatic_toggle_basic: '切替: 基本音',
      seventh_chord_btn: '7和音', triad_btn: '3和音',
      key_major: '長調', key_minor: '短調',
      feedback_correct: '正解！', feedback_wrong: '不正解',
      feedback_reveal: '正解は：', edit_key_hint: 'キーを変更',
      quiz_template_note: '<span class="text-orange-600 dark:text-orange-400 font-bold px-1">{0}</span> の <br> <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{1}</span> 上の音は？',
      quiz_template_interval: '<span class="text-orange-600 dark:text-orange-400 font-bold px-1">{0}</span> から <span class="text-orange-600 dark:text-orange-400 font-bold px-1">{1}</span> <br>への音程は？'
  }
};

export const noteValueMap: NoteMap = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
  'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
  // Extended
  'E#': 5, 'Fb': 4, 'B#': 0, 'Cb': 11, 'Bbb': 9, 
  'Cx': 2, 'Dx': 4, 'Ex': 6, 'Fx': 7, 'Gx': 9, 'Ax': 11, 'Bx': 1,
  'Dbb': 0, 'Ebb': 2, 'Fbb': 3, 'Gbb': 5, 'Abb': 7, 'Cbb': 10
};

export const baseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const valueNoteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const midiToNoteNames: Record<number, string[]> = {
  0: ['C', 'B#', 'Dbb'], 1: ['C#', 'Db', 'Bx'], 2: ['D', 'Cx', 'Ebb'], 
  3: ['D#', 'Eb', 'Fbb'], 4: ['E', 'Fb', 'Dx'], 5: ['F', 'E#', 'Gbb'], 
  6: ['F#', 'Gb', 'Ex'], 7: ['G', 'Fx', 'Abb'], 8: ['G#', 'Ab'], 
  9: ['A', 'Gx', 'Bbb'], 10: ['A#', 'Bb', 'Cbb'], 11: ['B', 'Ax', 'Cb']
};

export const semitoneToInterval: Record<number, string> = {
  0: 'P1/P8', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3', 5: 'P4', 6: 'A4/d5',
  7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8'
};

export const scaleIntervals: Record<string, number[]> = {
  'Major': [0, 2, 4, 5, 7, 9, 11, 12],
  'Natural Minor': [0, 2, 3, 5, 7, 8, 10, 12],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11, 12],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11, 12]
};

export const chordOffsetMap: Record<string, number[]> = {
  'Maj7': [0, 4, 7, 11], 'm7': [0, 3, 7, 10], '7': [0, 4, 7, 10], 
  'm7(b5)': [0, 3, 6, 10], 'dim7': [0, 3, 6, 9], 'mM7': [0, 3, 7, 11], 
  'Maj7#5': [0, 4, 8, 11], 'I': [0, 4, 7], 'i': [0, 3, 7], 
  'ii': [0, 3, 7], 'iii': [0, 3, 7], 'IV': [0, 4, 7], 'V': [0, 4, 7], 
  'vi': [0, 3, 7], 'ii°': [0, 3, 6], 'vii°': [0, 3, 6], 'III+': [0, 4, 8], 
  'v': [0, 3, 7], 'vi°': [0, 3, 6]
};

export const chordTypes7: Record<string, string[]> = {
  'Major': ['Imaj7', 'IIm7', 'IIIm7', 'IVmaj7', 'V7', 'VIm7', 'VIIm7(b5)'],
  'Natural Minor': ['Im7', 'IIm7(b5)', 'IIImaj7', 'IVm7', 'Vm7', 'VImaj7', 'VII7'],
  'Harmonic Minor': ['ImM7', 'IIm7(b5)', 'IIImaj7#5', 'IVm7', 'V7', 'VImaj7', 'VII$\text{dim7}$'],
  'Melodic Minor': ['ImM7', 'IIm7', 'IIImaj7#5', 'IV7', 'V7', 'VIm7(b5)', 'VIIm7(b5)']
};

export const chordTypes3: Record<string, string[]> = {
  'Major': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  'Natural Minor': ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  'Harmonic Minor': ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
  'Melodic Minor': ['i', 'ii', 'III+', 'iv', 'V', 'vi°', 'vii°']
};
