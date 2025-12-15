import { ScaleMode } from './types';

export const semitoneToInterval: Record<number, string> = {
    0: 'P1/P8', 1: 'm2', 2: 'M2', 3: 'm3', 4: 'M3', 5: 'P4', 6: 'A4/d5',
    7: 'P5', 8: 'm6', 9: 'M6', 10: 'm7', 11: 'M7', 12: 'P8'
};

export const noteValueMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

export const valueNoteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; 
export const baseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const scaleIntervals: Record<ScaleMode, number[]> = {
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

export const chordTypes7: Record<ScaleMode, string[]> = {
    'Major': ['Imaj7', 'IIm7', 'IIIm7', 'IVmaj7', 'V7', 'VIm7', 'VIIm7(b5)'],
    'Natural Minor': ['Im7', 'IIm7(b5)', 'IIImaj7', 'IVm7', 'Vm7', 'VImaj7', 'VII7'],
    'Harmonic Minor': ['ImM7', 'IIm7(b5)', 'IIImaj7#5', 'IVm7', 'V7', 'VImaj7', 'VII$\text{dim7}$'],
    'Melodic Minor': ['ImM7', 'IIm7', 'IIImaj7#5', 'IV7', 'V7', 'VIm7(b5)', 'VIIm7(b5)']
};

export const chordTypes3: Record<ScaleMode, string[]> = {
    'Major': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    'Natural Minor': ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    'Harmonic Minor': ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
    'Melodic Minor': ['i', 'ii', 'III+', 'iv', 'V', 'vi°', 'vii°']
};

export const solfege = ['1', '2', '3', '4', '5', '6', '7'];